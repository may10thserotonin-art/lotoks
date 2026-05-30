# Lotoks

## Project Structure

lotoks/
├── lotoks-frontend/   # Vite + React SPA — deployed to Vercel
├── lotoks-backend/    # Express + SQLite API — deploy to Railway or Render
├── scripts/           # Utility scripts
├── processed_assets/  # Pre-processed image assets
├── .kilo/             # Kilo config
└── AGENTS.md          # AI agent instructions

## Frontend (lotoks-frontend/)
- Stack: Vite + React 19, TypeScript, React Router DOM v7, TanStack Query v5, Zustand, Framer Motion
- Deploy: Vercel — set Root Directory to `lotoks-frontend` in Vercel dashboard
- Dev: `cd lotoks-frontend && npm install && npm run dev`
- Build: `cd lotoks-frontend && npm run build`

## Backend (lotoks-backend/)
- Stack: Node.js, Express, SQLite, JWT, BCryptJS
- Deploy separately on Railway or Render (not on Vercel)
- Dev: `cd lotoks-backend && npm run build && node dist/server.js`
- Default admin: admin@lotoks.com / admin123