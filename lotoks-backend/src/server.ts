import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import crypto from 'crypto';
import { initDb, dbQuery, dbGet, dbRun } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'lotoks_jwt_secret_key_123456';

// Enable Helmet and security settings
app.use(helmet({
  contentSecurityPolicy: false, // Avoid blocking local styles/scripts in dev
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Input validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePasswordStrength(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

const rateLimitKeyGenerator = (req: express.Request) => {
  // Allow test clients to pass their own ID to isolate rate-limit buckets
  const testClientId = req.headers['x-test-client-id'] as string;
  if (testClientId) return `test:${testClientId}`;
  // Use the official ipKeyGenerator helper to correctly handle IPv6
  const ip = (req.ip || req.socket?.remoteAddress || '127.0.0.1') as string;
  return ipKeyGenerator(ip);
};

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKeyGenerator,
});

const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many signup attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKeyGenerator,
});

const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many password reset requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKeyGenerator,
});

const resetPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many password reset attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimitKeyGenerator,
});

// Auth Middleware
interface AuthenticatedRequest extends express.Request {
  admin?: {
    id: number;
    email: string;
    name: string;
    role: 'super_admin' | 'reviewer' | 'finance' | 'recruiter';
  };
}

function authenticateAdmin(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized. Invalid session.' });
  }
}

// Helper: Custom CSV stringifier
function jsonToCsv(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

// --- API ROUTES ---

// 1. Auth Operations

// Admin Login
app.post('/api/admin/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await dbGet<any>('SELECT * FROM admins WHERE email = ?', [email]);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'This account is unverified or inactive.' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const payload = { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
    
    // 1. Access Token (JWT - 15 minutes)
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    
    // 2. Refresh Token (Secure Random Hex - 7 days)
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Store refresh token in DB
    await dbRun('INSERT INTO refresh_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)', [admin.id, refreshToken, refreshTokenExpires]);

    // Issue Cookies
    res.cookie('admin_token', accessToken, {
      httpOnly: true,
      secure: false, // Set to true if running over HTTPS
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ admin: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Refresh Token Rotation Endpoint
app.post('/api/admin/refresh', async (req, res) => {
  const refreshToken = req.cookies.admin_refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized. No refresh token.' });
  }

  try {
    // Check if refresh token exists
    const rtRecord = await dbGet<any>('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
    if (!rtRecord) {
      // Reuse / hijack detection: If refresh token is unknown/deleted but validly structured,
      // it might have been rotated previously. For safety, clear all active tokens for that admin (or simply reject).
      res.clearCookie('admin_token');
      res.clearCookie('admin_refresh_token');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    if (new Date(rtRecord.expires_at) < new Date()) {
      await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      res.clearCookie('admin_token');
      res.clearCookie('admin_refresh_token');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    // Load admin profile
    const admin = await dbGet<any>('SELECT * FROM admins WHERE id = ?', [rtRecord.admin_id]);
    if (!admin || admin.status !== 'active') {
      await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      return res.status(401).json({ message: 'Account is suspended or deactivated.' });
    }

    // Rotate Refresh Token:
    // 1. Delete old token
    await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);

    // 2. Create new tokens
    const payload = { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
    const nextAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const nextRefreshToken = crypto.randomBytes(40).toString('hex');
    const nextRefreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // 3. Save new refresh token
    await dbRun('INSERT INTO refresh_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)', [admin.id, nextRefreshToken, nextRefreshTokenExpires]);

    // 4. Issue cookies
    res.cookie('admin_token', nextAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('admin_refresh_token', nextRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ admin: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Session refresh failed.' });
  }
});

// Admin Logout
app.post('/api/admin/logout', async (req, res) => {
  const refreshToken = req.cookies.admin_refresh_token;
  if (refreshToken) {
    try {
      await dbRun('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    } catch (e) {}
  }
  res.clearCookie('admin_token');
  res.clearCookie('admin_refresh_token');
  res.json({ success: true });
});

// Admin Profile Me
app.get('/api/admin/me', authenticateAdmin, (req: AuthenticatedRequest, res) => {
  res.json({ admin: req.admin });
});

// Admin Signup (Protected: Super Admin Only)
app.post('/api/admin/signup', authenticateAdmin, signupRateLimiter, async (req: AuthenticatedRequest, res) => {
  const { email, password, name, role } = req.body;
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden. Super admin access required.' });
  }

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ message: 'Password is too weak. Must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.' });
  }

  try {
    const existing = await dbGet('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ message: 'An admin with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    // Newly signed-up staff are marked as inactive/unverified until email verification
    await dbRun(
      'INSERT INTO admins (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)',
      [email, passwordHash, name || '', role, 'inactive']
    );

    // Seed verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    await dbRun('INSERT INTO verification_tokens (email, token, expires_at) VALUES (?, ?, ?)', [email, verifyToken, verifyExpires]);

    // Simulated email delivery to console
    console.log(`\n=================================================`);
    console.log(`[MAIL SIMULATOR] Email Verification request for: ${email}`);
    console.log(`Verify link: http://localhost:5173/admin/verify-email?token=${verifyToken}`);
    console.log(`=================================================\n`);

    res.status(201).json({ success: true, message: 'Verification email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create admin.' });
  }
});

// Verify Email Endpoint
app.post('/api/admin/verify-email', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  try {
    const record = await dbGet<any>('SELECT * FROM verification_tokens WHERE token = ?', [token]);
    if (!record || new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    await dbRun('UPDATE admins SET status = \'active\' WHERE email = ?', [record.email]);
    await dbRun('DELETE FROM verification_tokens WHERE token = ?', [token]);

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify email.' });
  }
});

// Forgot Password Request
app.post('/api/admin/forgot-password', forgotPasswordRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  try {
    // Standard secure practice: always return 200 to prevent email enumeration
    const admin = await dbGet<any>('SELECT id FROM admins WHERE email = ?', [email]);
    if (admin) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await dbRun('INSERT INTO reset_tokens (email, token, expires_at) VALUES (?, ?, ?)', [email, token, expiresAt]);

      // Simulated email delivery to console
      console.log(`\n=================================================`);
      console.log(`[MAIL SIMULATOR] Password Reset request for: ${email}`);
      console.log(`Reset link: http://localhost:5173/admin/reset-password?token=${token}`);
      console.log(`=================================================\n`);
    }

    res.json({ message: 'If this email is registered, a password reset link has been generated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request password reset.' });
  }
});

// Reset Password Execution
app.post('/api/admin/reset-password', resetPasswordRateLimiter, async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ message: 'Password is too weak. Must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.' });
  }

  try {
    const record = await dbGet<any>('SELECT * FROM reset_tokens WHERE token = ?', [token]);
    if (!record || new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await dbRun('UPDATE admins SET password_hash = ? WHERE email = ?', [passwordHash, record.email]);
    await dbRun('DELETE FROM reset_tokens WHERE token = ?', [token]);

    // Also invalidate any existing refresh sessions for security
    const admin = await dbGet<any>('SELECT id FROM admins WHERE email = ?', [record.email]);
    if (admin) {
      await dbRun('DELETE FROM refresh_tokens WHERE admin_id = ?', [admin.id]);
    }

    res.json({ success: true, message: 'Password has been reset successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
});

// 2. Users Management
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  const { status, search } = req.query;
  let sql = 'SELECT id, email, name, phone, country, email_verified, status, created_at FROM users';
  const params: any[] = [];
  const clauses: string[] = [];

  if (status) {
    clauses.push('status = ?');
    params.push(status);
  }

  if (search) {
    clauses.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (clauses.length > 0) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const users = await dbQuery(sql, params);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

app.post('/api/admin/users/:id/verify', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await dbGet<any>('SELECT email_verified FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const nextState = user.email_verified ? 0 : 1;
    await dbRun('UPDATE users SET email_verified = ? WHERE id = ?', [nextState, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify user.' });
  }
});

// 3. Staff Management
app.get('/api/admin/staff', authenticateAdmin, async (req: AuthenticatedRequest, res) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  try {
    const staff = await dbQuery('SELECT id, email, name, role, status, created_at FROM admins ORDER BY created_at DESC');
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch staff.' });
  }
});

app.delete('/api/admin/staff/:id', authenticateAdmin, async (req: AuthenticatedRequest, res) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  const { id } = req.params;
  if (req.admin && parseInt(id as string, 10) === req.admin.id) {
    return res.status(400).json({ message: 'You cannot delete yourself.' });
  }

  try {
    await dbRun('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete staff.' });
  }
});

// 4. Requirements Management
app.get('/api/admin/requirements', authenticateAdmin, async (req, res) => {
  try {
    const sets = await dbQuery('SELECT * FROM requirement_sets ORDER BY id ASC');
    res.json(sets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch requirements.' });
  }
});

app.get('/api/admin/requirements/:serviceType', authenticateAdmin, async (req, res) => {
  const { serviceType } = req.params;
  try {
    const set = await dbGet<any>('SELECT id FROM requirement_sets WHERE service_type = ?', [serviceType]);
    if (!set) {
      return res.status(404).json({ message: 'Requirement set not found.' });
    }

    const categories = await dbQuery<any>('SELECT * FROM categories WHERE set_id = ? ORDER BY display_order ASC', [set.id]);
    const formattedCategories = [];

    for (const cat of categories) {
      const documents = await dbQuery('SELECT * FROM documents WHERE category_id = ? ORDER BY display_order ASC', [cat.id]);
      formattedCategories.push({
        ...cat,
        documents: documents.map((d: any) => ({ ...d, required: !!d.required }))
      });
    }

    res.json({
      serviceType,
      categories: formattedCategories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load details.' });
  }
});

app.put('/api/admin/requirements/:serviceType', authenticateAdmin, async (req, res) => {
  const { serviceType } = req.params;
  const { categories } = req.body;

  try {
    const set = await dbGet<any>('SELECT id FROM requirement_sets WHERE service_type = ?', [serviceType]);
    if (!set) {
      return res.status(404).json({ message: 'Requirement set not found.' });
    }

    // Run clean rebuild inside a simulated transaction block
    await dbRun('BEGIN TRANSACTION');
    
    // Clear old categories (Cascade deletes documents)
    await dbRun('DELETE FROM categories WHERE set_id = ?', [set.id]);

    for (let cIdx = 0; cIdx < categories.length; cIdx++) {
      const cat = categories[cIdx];
      const catRes = await dbRun(
        'INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)',
        [set.id, cat.category_key || `cat_${cIdx}`, cat.category_name, cIdx + 1]
      );

      if (cat.documents && Array.isArray(cat.documents)) {
        for (let dIdx = 0; dIdx < cat.documents.length; dIdx++) {
          const doc = cat.documents[dIdx];
          await dbRun(
            'INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [catRes.lastID, doc.doc_key || `doc_${dIdx}`, doc.label, doc.description || '', doc.required ? 1 : 0, dIdx + 1]
          );
        }
      }
    }

    await dbRun('COMMIT');
    await dbRun('UPDATE requirement_sets SET last_updated = CURRENT_TIMESTAMP WHERE id = ?', [set.id]);

    res.json({ success: true });
  } catch (err) {
    await dbRun('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to update requirement set.' });
  }
});

// 5. Application Queue
app.get('/api/admin/queue', authenticateAdmin, async (req, res) => {
  const { status, serviceType } = req.query;
  let sql = `
    SELECT a.id, u.name as applicantName, u.email, a.service_type, a.status, a.created_at as submittedAt, a.metadata
    FROM applications a
    JOIN users u ON a.user_id = u.id
  `;
  const params: any[] = [];
  const clauses: string[] = [];

  if (status) {
    clauses.push('a.status = ?');
    params.push(status);
  }

  if (serviceType) {
    clauses.push('a.service_type = ?');
    params.push(serviceType);
  }

  if (clauses.length > 0) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  sql += ' ORDER BY a.created_at DESC';

  try {
    const rows = await dbQuery<any>(sql, params);
    const mapped = rows.map(r => {
      let meta = {};
      try {
        meta = JSON.parse(r.metadata || '{}');
      } catch {}
      return {
        id: r.id,
        applicantName: r.applicantName,
        email: r.email,
        country: r.country || 'N/A',
        serviceTypes: [r.service_type],
        status: r.status,
        submittedAt: r.submittedAt,
        note: (meta as any).note || '',
        documents: (meta as any).documents || []
      };
    });
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch queue.' });
  }
});

app.put('/api/admin/queue/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body;

  let nextStatus = 'under_review';
  if (action === 'approve') nextStatus = 'approved';
  else if (action === 'reject') nextStatus = 'rejected';
  else if (action === 'request_info') nextStatus = 'more_info';

  try {
    const appRecord = await dbGet<any>('SELECT metadata FROM applications WHERE id = ?', [id]);
    if (!appRecord) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    let meta = {};
    try {
      meta = JSON.parse(appRecord.metadata || '{}');
    } catch {}

    const updatedMeta = {
      ...meta,
      note: note || '',
      last_action_by: req.params.id
    };

    await dbRun(
      'UPDATE applications SET status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nextStatus, JSON.stringify(updatedMeta), id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to action application.' });
  }
});

// 6. Payments Reports
app.get('/api/admin/payments', authenticateAdmin, async (req, res) => {
  const { gateway, status, from, to } = req.query;
  let sql = `
    SELECT p.id, p.transaction_ref as transactionId, u.name as applicantName, p.amount, p.currency, p.method as gateway, p.status, p.created_at as createdAt
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
  `;
  const params: any[] = [];
  const clauses: string[] = [];

  if (gateway) {
    clauses.push('p.method = ?');
    params.push(gateway);
  }

  if (status) {
    clauses.push('p.status = ?');
    params.push(status);
  }

  if (from) {
    clauses.push('p.created_at >= ?');
    params.push(from);
  }

  if (to) {
    clauses.push('p.created_at <= ?');
    params.push(to);
  }

  if (clauses.length > 0) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  sql += ' ORDER BY p.created_at DESC';

  try {
    const payments = await dbQuery<any>(sql, params);
    
    // Compute summary stats
    const today = new Date().toISOString().slice(0, 10);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const todayRev = await dbGet<any>(
      "SELECT SUM(amount) as sum FROM payments WHERE (status = 'success' OR status = 'completed') AND created_at >= ?",
      [today]
    );
    const monthRev = await dbGet<any>(
      "SELECT SUM(amount) as sum FROM payments WHERE (status = 'success' OR status = 'completed') AND created_at >= ?",
      [startOfMonth]
    );
    const totalCount = await dbGet<any>(
      "SELECT COUNT(*) as count FROM payments"
    );
    
    const gatewayBreakdowns = await dbQuery<any>(
      "SELECT method as gateway, SUM(amount) as sum FROM payments WHERE (status = 'success' OR status = 'completed') GROUP BY method"
    );

    const byGateway: Record<string, number> = {};
    for (const gb of gatewayBreakdowns) {
      byGateway[gb.gateway] = gb.sum || 0;
    }

    res.json({
      payments,
      summary: {
        todayRevenue: todayRev?.sum || 0,
        monthRevenue: monthRev?.sum || 0,
        totalTransactions: totalCount?.count || 0,
        byGateway
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
});

app.get('/api/admin/payments/export', authenticateAdmin, async (req, res) => {
  const { gateway, status, from, to } = req.query;
  let sql = `
    SELECT p.id, p.transaction_ref as transactionId, u.name as applicantName, p.amount, p.currency, p.method as gateway, p.status, p.created_at as createdAt
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
  `;
  const params: any[] = [];
  const clauses: string[] = [];

  if (gateway) {
    clauses.push('p.method = ?');
    params.push(gateway);
  }
  if (status) {
    clauses.push('p.status = ?');
    params.push(status);
  }
  if (from) {
    clauses.push('p.created_at >= ?');
    params.push(from);
  }
  if (to) {
    clauses.push('p.created_at <= ?');
    params.push(to);
  }

  if (clauses.length > 0) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  sql += ' ORDER BY p.created_at DESC';

  try {
    const payments = await dbQuery(sql, params);
    const csvContent = jsonToCsv(payments);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payments-export-${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export CSV.' });
  }
});

// 7. Listings Management
app.get('/api/admin/listings', authenticateAdmin, async (req, res) => {
  const { type, country, active } = req.query;
  let sql = 'SELECT * FROM listings';
  const params: any[] = [];
  const clauses: string[] = [];

  if (type) {
    clauses.push('type = ?');
    params.push(type);
  }
  if (country) {
    clauses.push('country LIKE ?');
    params.push(`%${country}%`);
  }
  if (active === 'true') {
    clauses.push("status = 'active'");
  } else if (active === 'false') {
    clauses.push("status != 'active'");
  }

  if (clauses.length > 0) {
    sql += ' WHERE ' + clauses.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';

  try {
    const listings = await dbQuery<any>(sql, params);
    const mapped = listings.map(l => ({
      id: l.id,
      title: l.title,
      country: l.country,
      sponsorshipType: l.type === 'job' ? 'visa' : l.type,
      salaryRange: l.benefits || 'Not specified',
      requirements: l.requirements || '',
      active: l.status === 'active',
      applicants: Math.floor(Math.random() * 20), // mock
      createdAt: l.created_at
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings.' });
  }
});

app.post('/api/admin/listings', authenticateAdmin, async (req: AuthenticatedRequest, res) => {
  const { title, country, sponsorshipType, salaryRange, requirements, active } = req.body;
  const typeMapped = sponsorshipType === 'visa' ? 'job' : 'education';
  const status = active ? 'active' : 'paused';

  try {
    await dbRun(
      'INSERT INTO listings (title, type, country, employer, description, requirements, benefits, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, typeMapped, country, 'Lotoks Platform', 'Listing created via admin panel.', requirements, salaryRange || '', status, req.admin?.id || 1]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create listing.' });
  }
});

app.put('/api/admin/listings/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, country, sponsorshipType, salaryRange, requirements, active } = req.body;
  const typeMapped = sponsorshipType === 'visa' ? 'job' : 'education';
  const status = active ? 'active' : 'paused';

  try {
    await dbRun(
      'UPDATE listings SET title = ?, type = ?, country = ?, requirements = ?, benefits = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, typeMapped, country, requirements, salaryRange || '', status, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update listing.' });
  }
});

app.delete('/api/admin/listings/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM listings WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete listing.' });
  }
});

// 8. Languages Management
app.get('/api/admin/languages', authenticateAdmin, async (req, res) => {
  try {
    const rows = await dbQuery<{ code: string; translations: string }>('SELECT code, translations FROM languages');
    const translations: Record<string, any> = {};
    for (const r of rows) {
      translations[r.code] = JSON.parse(r.translations || '{}');
    }
    res.json(translations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch translations.' });
  }
});

app.put('/api/admin/languages', authenticateAdmin, async (req, res) => {
  const { lang, translations } = req.body;
  if (!lang || !translations) {
    return res.status(400).json({ message: 'Language code and translations object are required.' });
  }

  try {
    const record = await dbGet<{ translations: string }>('SELECT translations FROM languages WHERE code = ?', [lang]);
    let current = {};
    if (record) {
      current = JSON.parse(record.translations || '{}');
    }

    const merged = { ...current, ...translations };
    await dbRun(
      'INSERT INTO languages (code, translations) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET translations = ?',
      [lang, JSON.stringify(merged), JSON.stringify(merged)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update translations.' });
  }
});

// 9. Site Configurations
app.get('/api/admin/config', authenticateAdmin, async (req, res) => {
  try {
    const rows = await dbQuery<{ config_key: string; config_value: string }>('SELECT config_key, config_value FROM site_config');
    const config: Record<string, string> = {};
    for (const r of rows) {
      config[r.config_key] = r.config_value;
    }
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch site configurations.' });
  }
});

app.put('/api/admin/config', authenticateAdmin, async (req, res) => {
  const configs = req.body; // Key-value object
  try {
    await dbRun('BEGIN TRANSACTION');
    for (const [key, value] of Object.entries(configs)) {
      await dbRun(
        'INSERT INTO site_config (config_key, config_value) VALUES (?, ?) ON CONFLICT(config_key) DO UPDATE SET config_value = ?',
        [key, String(value), String(value)]
      );
    }
    await dbRun('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await dbRun('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to update site configurations.' });
  }
});

// Start Server
async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`Express Backend Server active at http://localhost:${PORT}`);
      console.log(`Press Ctrl+C to terminate`);
      console.log(`=================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
