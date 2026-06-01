# Lotoks - Agent Guide

## Non-Obvious Facts

- **Monorepo**: Frontend in `lotoks-frontend/`, backend in `lotoks-backend/` (deployed separately)
- **No tests**: Verify changes with `cd lotoks-frontend && npm run build`
- **Build needs memory**: `npm run build` uses `--max-old-space-size=4096` due to Vite memory limits
- **Tailwind CSS v4**: Uses `@tailwindcss/vite` plugin, not PostCSS
- **API proxy**: Vite dev server proxies `/api` to `http://localhost:3001` (backend must be running)
- **Vercel frontend only**: `lotoks-frontend/vercel.json` sets root directory; backend deploys to Railway/Render

## Key Commands

```bash
# Frontend dev (requires backend running on port 3001)
cd lotoks-frontend && npm run dev

# Verify changes
cd lotoks-frontend && npm run build   # Must pass

# Backend dev
cd lotoks-backend && npm run build && node dist/server.js
```

## Auth Credentials

- `admin@lotoks.com` / `admin123` (super_admin role)
- JWT in cookies, validated via `/api/auth/me`

## Routing

- Uses `react-router-dom` (`useNavigate`, `<Link to="...">`, `useParams`, `useLocation`)