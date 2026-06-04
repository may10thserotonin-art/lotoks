import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/admin/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const db = getDb();
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as
    | { id: number; email: string; name: string; password_hash: string; role: string; verified: number }
    | undefined;

  if (!admin) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  if (!admin.verified) {
    res.status(401).json({ message: 'Email not verified. Please check your inbox.' });
    return;
  }

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
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
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

// POST /api/admin/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET /api/admin/me
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const admin = db.prepare('SELECT id, email, name, role FROM admins WHERE id = ?').get(req.admin!.id) as
    | { id: number; email: string; name: string; role: string }
    | undefined;

  if (!admin) {
    res.status(401).json({ message: 'Admin not found' });
    return;
  }

  res.json({ admin });
});

// POST /api/admin/signup (super_admin only)
router.post('/signup', authMiddleware, roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const validRoles = ['admin'];
  const assignRole = validRoles.includes(role) ? role : 'admin';

  const db = getDb();
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ message: 'An admin with this email already exists' });
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const verification_token = crypto.randomBytes(32).toString('hex');
  const name = email.split('@')[0];

  db.prepare(
    'INSERT INTO admins (email, name, password_hash, role, verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(email, name, password_hash, assignRole, 0, verification_token);

  res.json({ message: 'Staff admin created successfully! Verification email generated.' });
});

// POST /api/admin/forgot-password
router.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const db = getDb();
  const admin = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);

  if (!admin) {
    // Don't reveal whether the email exists
    res.json({ message: 'If that email exists, a reset link has been generated.' });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare('UPDATE admins SET reset_token = ?, reset_token_expires = ? WHERE email = ?').run(
    resetToken,
    expires,
    email
  );

  res.json({ message: 'Reset link generated.' });
});

// POST /api/admin/reset-password
router.post('/reset-password', (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required' });
    return;
  }

  const db = getDb();
  const admin = db.prepare(
    'SELECT id FROM admins WHERE reset_token = ? AND reset_token_expires > datetime(\'now\')'
  ).get(token) as { id: number } | undefined;

  if (!admin) {
    res.status(400).json({ message: 'Invalid or expired reset token.' });
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('UPDATE admins SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?').run(
    password_hash,
    admin.id
  );

  res.json({ message: 'Password updated successfully!' });
});

// POST /api/admin/verify-email
router.post('/verify-email', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: 'Verification token is required' });
    return;
  }

  const db = getDb();
  const admin = db.prepare('SELECT id FROM admins WHERE verification_token = ?').get(token) as
    | { id: number }
    | undefined;

  if (!admin) {
    res.status(400).json({ message: 'Invalid or expired verification token.' });
    return;
  }

  db.prepare('UPDATE admins SET verified = 1, verification_token = NULL WHERE id = ?').run(admin.id);

  res.json({ message: 'Email verified successfully!' });
});

// ── Role switching (super_admin only, for dev/testing) ──

// POST /api/admin/switch-role — temporarily switch to another role
router.post('/switch-role', authMiddleware, roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const { role } = req.body;
  const validRoles = ['super_admin', 'admin'];

  if (!role || !validRoles.includes(role)) {
    res.status(400).json({ message: `Invalid role. Valid: ${validRoles.join(', ')}` });
    return;
  }

  const admin = req.admin!;
  // Issue a new JWT with the target role (same admin id/email, different role)
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role },
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
    message: `Switched to ${role}`,
    admin: {
      id: admin.id,
      email: admin.email,
      name: req.body._name || admin.email,
      role,
    },
  });
});

// POST /api/admin/restore-role — restore back to the real DB role
router.post('/restore-role', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const realAdmin = db.prepare('SELECT id, email, name, role FROM admins WHERE id = ?').get(req.admin!.id) as
    | { id: number; email: string; name: string; role: string }
    | undefined;

  if (!realAdmin) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }

  const token = jwt.sign(
    { id: realAdmin.id, email: realAdmin.email, role: realAdmin.role },
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
    message: `Restored to ${realAdmin.role}`,
    admin: realAdmin,
  });
});

export default router;
