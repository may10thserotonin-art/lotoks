import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
import { userAuthMiddleware } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/user/signup — Register a new user
router.post('/user/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  if (!name || name.trim().length === 0) {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ message: 'An account with this email already exists' });
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);

  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash, verified) VALUES (?, ?, ?, ?)'
  ).run(name.trim(), email.toLowerCase(), password_hash, 1);

  const userId = result.lastInsertRowid;

  // Generate JWT
  const token = jwt.sign(
    { id: userId, email: email.toLowerCase() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: false, // set true in production
  });

  res.json({
    user: {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase(),
    },
    message: 'Account created successfully!',
  });
});

// POST /api/auth/user/login — User login with email + password
router.post('/user/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as
    | { id: number; name: string; email: string; password_hash: string; country: string }
    | undefined;

  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  if (!user.password_hash) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: false,
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
    },
  });
});

// GET /api/auth/user/me — Get current user
router.get('/user/me', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, country, created_at FROM users WHERE id = ?').get(req.user!.id) as
    | { id: number; name: string; email: string; country: string; created_at: string }
    | undefined;

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  res.json({ user });
});

// POST /api/auth/user/logout — Clear auth cookie
router.post('/user/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// POST /api/auth/user/forgot-password — Request password reset
router.post('/user/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    // Don't reveal whether the email exists
    res.json({ message: 'If that email exists, a reset link has been sent.' });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?').run(
    resetToken,
    expires,
    email.toLowerCase()
  );

  res.json({ message: 'Password reset link generated. Check your email.' });
});

// POST /api/auth/user/reset-password — Reset password with token
router.post('/user/reset-password', (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
    return;
  }

  const db = getDb();
  const user = db.prepare(
    "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > datetime('now')"
  ).get(token) as { id: number } | undefined;

  if (!user) {
    res.status(400).json({ message: 'Invalid or expired reset token.' });
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?').run(
    password_hash,
    user.id
  );

  res.json({ message: 'Password updated successfully!' });
});

export default router;
