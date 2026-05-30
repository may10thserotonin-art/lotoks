const express = require('express');
const path    = require('path');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add future API routes here:
// const usersRouter = require('./routes/users');
// app.use('/api/users', usersRouter);

// ── Serve Vite Production Build ───────────────────────────────
const CLIENT_BUILD = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(CLIENT_BUILD));

// SPA fallback — must be last (handles client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Lotoks server running at http://localhost:${PORT}`);
  console.log(`   API health: http://localhost:${PORT}/api/health\n`);
});
