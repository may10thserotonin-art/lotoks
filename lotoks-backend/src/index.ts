import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDb } from './db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import userAuthRoutes from './routes/user-auth';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

// ── Start ──
initializeDb();
console.log('Database initialized');

// Run seed if admin table is empty
import { getDb } from './db';
const db = getDb();
const count = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
if (count.count === 0) {
  console.log('No admins found, running seed...');
  // Dynamic import of seed
  require('./seed');
}

app.listen(PORT, () => {
  console.log(`✓ Lotoks backend running on http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
});
