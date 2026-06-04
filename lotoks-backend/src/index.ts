import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDb, getDb } from './db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import userAuthRoutes from './routes/user-auth';
import userRoutes from './routes/user';

const app = express();

// ── Middleware ──
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || (
      process.env.VERCEL
        ? 'https://lotoks.vercel.app'
        : 'http://localhost:5173'
    ),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ── Routes ──
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api', userRoutes);

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Initialize DB on import ──
// This runs once per cold start (on Vercel) or once at startup (locally)
initializeDb();

// ── Auto-seed if admin table is empty ──
try {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  if (count.count === 0) {
    console.log('No admins found, running seed...');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('./seed');
  }
} catch (err) {
  console.error('Seed check failed:', err);
}

// ── Start server (local dev only) ──
// In Vercel serverless mode, Vercel manages the HTTP server.
// The app is exported as the default export for the serverless runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✓ Lotoks backend running on http://localhost:${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health`);
  });
}

export default app;
