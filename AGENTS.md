# Lotoks Website - Agent Instructions

## Project Overview
- **Framework**: Vite + React 19, TypeScript, React Router DOM v7
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin)
- **State Management**: Zustand (`lotoks-frontend/src/store/`)
- **Data Fetching**: TanStack Query v5
- **Animations**: Framer Motion
- **Build**: `npm run build` (TypeScript check + Vite build)
- **Dev**: `npm run dev`

> ⚠️ **No root-level Next.js app exists anymore.** All frontend code lives in `lotoks-frontend/`.

## Key Commands

```bash
# Frontend
cd lotoks-frontend
npm run dev      # Start dev server on http://localhost:5173/
npm run build    # Builds production distribution assets in dist/

# Backend
cd lotoks-backend
npm run build     # Compiles TS to dist/
node dist/server.js  # Launches backend on port 3001
```

## Project Structure

```
lotoks/
├── lotoks-frontend/        # Vite + React SPA — THE main frontend
│   ├── src/
│   │   ├── pages/          # Route-level page components
│   │   ├── components/     # Reusable UI components
│   │   ├── store/          # Zustand state stores
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API clients, utilities
│   │   └── types/          # TypeScript type declarations
│   ├── public/             # Static assets
│   ├── index.html          # Vite HTML entry point
│   ├── vite.config.ts      # Vite configuration
│   └── vercel.json         # Vercel deployment config (rewrites for React Router)
├── lotoks-backend/         # Express + SQLite REST API
│   ├── src/                # TypeScript source
│   └── scripts/schema.sql  # MySQL schema reference
├── scripts/                # Utility/migration scripts
├── processed_assets/       # Pre-processed image assets (card/hero layouts)
└── AGENTS.md               # This file
```

## Vercel Deployment

- **Frontend** deploys from `lotoks-frontend/` as the root directory
- `lotoks-frontend/vercel.json` configures build command, output dir, and SPA rewrites
- The `rewrites` rule redirects all paths to `/index.html` so React Router handles navigation
- **Backend** is deployed separately (Railway or Render), NOT on Vercel

## Important Notes

### Routing
- React Router DOM v7 (`react-router-dom`) handles all client-side routing
- Use `useNavigate` instead of Next.js `useRouter`
- Use `<Link to="...">` instead of Next.js `<Link href="...">`
- Use `useParams`, `useLocation` from `react-router-dom`

### Authentication
- Auth state managed via Zustand store in `lotoks-frontend/src/store/`
- JWT tokens stored in cookies, validated against `/api/auth/me` on the backend
- Backend seeded credentials: `admin@lotoks.com` / `admin123` (role: `super_admin`)

### Backend API
- Express backend runs on port `3001`
- Vite dev server proxies `/api` requests to `http://localhost:3001` (see `vite.config.ts`)
- SQLite database auto-seeds on first run

### Tailwind CSS v4
- Uses `@tailwindcss/vite` plugin (not PostCSS)
- Theme config in `lotoks-frontend/tailwind.config.js`

### AI Layout Design Assets (`processed_assets/`)
Pre-compiled premium card and horizontal hero assets:
- **`card_ready.jpg`** (300 × 400 px): Subject-centered card layout
- **`web_ready.jpg`** (1200 × 800 px): Off-center horizontal hero banner with gradient overlay

## Testing Changes
After any code change, run:
```bash
cd lotoks-frontend && npm run build
```
Build must pass before considering changes complete.