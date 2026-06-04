# Lotoks — Agent Guide

## Monorepo Structure

- **`lotoks-frontend/`** — Vite + React 19 SPA. Deployed to Vercel (root dir: `lotoks-frontend`).
- **`lotoks-backend/`** — Express + SQLite API. Deployed separately (Railway/Render). Not on Vercel.
- Root `package.json` runs `npm run dev` to start both via `concurrently`.

## Key Commands

```bash
# Build frontend (MUST pass before pushing)
cmd /c "cd lotoks-frontend && npm run build"

# Frontend dev (requires backend running on port 3001 for /api proxy)
cd lotoks-frontend && npm run dev

# Backend dev (seed once, then build & start)
cd lotoks-backend && npm run seed   # first time only
cd lotoks-backend && npm run build && node dist/index.js

# Run both simultaneously from root
npm run dev
```

## Non-Obvious Facts

- **Build command**: `npm run build` uses `tsc -b && node --max-old-space-size=4096 node_modules/vite/bin/vite.js build`. The `--max-old-space-size=4096` flag is required to avoid OOM errors with Vite.
- **Shell**: Use `cmd /c "cd lotoks-frontend && npm run build"` — PowerShell does not support `&&`.
- **Tailwind CSS v4**: Uses `@tailwindcss/vite` plugin (no PostCSS config file). CSS imports `@import "tailwindcss" source(none)`, then explicitly sources `@source "../index.html"` and `@source "./**/*.{js,jsx,ts,tsx}"`.
- **Path alias**: `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- **API proxy**: Vite dev server proxies `/api` → `http://localhost:3001`. Backend must be running for admin features.
- **Vercel SPA**: `vercel.json` rewrites all routes to `/index.html` (client-side routing).
- **No tests**: There are no test suites. Verify changes by building.
- **WhatsApp**: Global floating WhatsApp button (`+48 790 733 839`) visible on all public pages.

## Frontend Architecture

| Layer | Details |
|-------|---------|
| State | Zustand stores in `src/store/` (`adminAuth.ts`, `auth.ts`) |
| Data fetching | TanStack Query v5 (`QueryClient` with staleTime 30s, retry 1) |
| Routing | React Router DOM v7 — all routes in `src/App.tsx` |
| UI kit | Custom components in `src/components/ui/` — `Card.tsx` (GlassCard, ElevatedCard, ImageCard, StatCard, ProcessStepCard), `Button.tsx`, `FormElements.tsx` |
| Public pages | `src/pages/` — Home, About, Services, Testimonials, Contact, Eligibility, Apply, Documents, Payment, Opportunities, Login, Signup, ForgotPassword, ResetPassword, Dashboard |
| Admin pages | `src/pages/admin/` — Queue, Listings, Payments, Users, Staff, Config, Languages, requirements/ |
| Navigation | Marketing Navbar/Footer in `src/components/marketing/`, admin layout in `src/components/admin/`, user sidebar in `src/components/Navigation.tsx` |

## Admin Auth & Roles

- JWT in HTTP-only cookie, validated via `GET /api/admin/me`.
- Login: `admin@lotoks.com` / `admin123` (super_admin role).
- Roles: `super_admin` (full access), `reviewer`, `finance`, `recruiter`.
- Admin auth store: `useAdminAuth` (Zustand, `src/store/adminAuth.ts`).
- `super_admin` only: staff management, config, translations.

## User API (prefix: `/api/auth`)

| Endpoint | Auth | Notes |
|----------|------|-------|
| POST `/user/login`, `/user/logout`, `/user/signup` | Mixed | Signup auto-logs in |
| GET `/user/me` | Yes | Returns user from JWT |
| POST `/user/forgot-password`, `/user/reset-password` | No | Password reset flow |

## Admin API (prefix: `/api/admin`)

| Endpoint | Auth | Notes |
|----------|------|-------|
| POST `/login`, `/logout`, `/signup` | Mixed | Signup requires super_admin |
| GET `/me` | Yes | Returns admin from JWT |
| POST `/forgot-password`, `/reset-password`, `/verify-email` | No | Public auth flows |
| GET/PUT `/queue/:id` | Yes | Application queue management |
| CRUD `/listings` | Yes | Job/visa listings |
| GET `/payments`, `/payments/export` | Yes | Payments + CSV export |
| GET/PUT `/users/:id/verify` | Yes | User management |
| GET/DELETE `/staff/:id` | super_admin | Staff CRUD |
| GET/PUT `/config` | super_admin | App configuration |
| GET/PUT `/languages` | super_admin | Translations |
| GET `/requirements`, `/requirements/:type`, PUT `/requirements/:type` | Yes | Document requirements |

## User Auth

- JWT in HTTP-only cookie, validated via `GET /api/auth/user/me`.
- `POST /api/auth/user/signup` — Register with name, email, password (auto-logs in, sets cookie).
- `POST /api/auth/user/login` — Login with email + password (sets cookie).
- `POST /api/auth/user/logout` — Clears auth cookie.
- `POST /api/auth/user/forgot-password` — Request reset link (generates token in DB).
- `POST /api/auth/user/reset-password` — Reset password with token + new password.
- User auth store: `useAuthStore` (Zustand with persist, `src/store/auth.ts`).
- Developer preview: PIN `091344` opens dev modal on login page, sets mock user in sessionStorage.
- User routes in `App.tsx`: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/dashboard`.
- Dashboard page (`src/pages/Dashboard.tsx`) shows quick stats, action cards, account info.
- User sidebar/navigation in `src/components/Navigation.tsx` (visible after login on `/dashboard`, `/apply`, `/documents`, `/payment`, `/opportunities`).

## Database

- **Engine**: SQLite via `better-sqlite3`.
- **Location**: `lotoks-backend/data/lotoks.db` (configurable via `DB_PATH` env).
- **Tables**: `admins`, `users`, `applications`, `listings`, `payments`, `config`, `languages`, `requirements`.
- **Seed**: `cd lotoks-backend && npm run seed` creates the default super_admin.

## Public Page Routes & Shared Components

- Global `<WhatsAppButton />` renders on all public pages (floating CTA).
- Global `<ToastContainer />` for toast notifications.
- Missing route → 404 page rendered inline in `App.tsx`.
- Content Security Policy is set in `vite.config.ts` — allows `unsafe-inline` for styles/scripts, `https:` for images.
