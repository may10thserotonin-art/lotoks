# Lotoks Website - Agent Instructions

## Project Overview
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (using `@theme` in globals.css)
- **State Management**: Zustand (`/src/store/auth.ts`)
- **Build**: `npm run build` (includes type check)
- **Dev**: `npm run dev`

## Key Commands
```bash
npm run dev      # Start development server
npm run build    # Production build (includes type check)
npm run lint     # ESLint check
```

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Landing page
│   ├── dashboard/       # User dashboard
│   ├── admin/           # Admin panel (queue, listings, payments, staff, config, languages)
│   ├── login/           # Auth with preview login
│   ├── apply/           # Application wizard
│   ├── eligibility/     # Eligibility quiz
│   ├── opportunities/    # Job/education listings
│   ├── documents/       # User documents
│   └── payment/          # Payment page
├── components/          # Reusable UI components
│   ├── Navigation.tsx    # Sidebar, mobile menu, tab bar
│   └── Hero3D.tsx       # 3D hero section with Three.js
├── store/               # Zustand state
│   └── auth.ts          # Auth store (preview login)
├── hooks/               # Custom React hooks
└── types/               # TypeScript declarations
```

## Important Notes

### Authentication
- Preview login bypasses real auth: use `/login` page buttons for "Preview User Dashboard" or "Preview Admin Panel"
- Auth state managed via Zustand (`useAuthStore`)

### Routing
- User dashboard at `/dashboard`
- Admin panel at `/admin/*` (queue, listings, payments, staff, config, languages)
- Mobile navigation via hamburger menu (MobileMenu component)

### Tailwind CSS v4
- Theme tokens defined in `/src/app/globals.css` under `@theme`
- Custom colors: `navy`, `gold`, `teal`, `red` plus existing primary/secondary/tertiary
- Use `@apply` sparingly; prefer utility classes directly

### Known Issues Fixed
- three.js v0.162+ uses `colorSpace={THREE.SRGBColorSpace}` instead of deprecated `encoding={THREE.sRGBEncoding}`
- React 19 + @react-three/fiber v9 required for compatibility
- R3F JSX types may need `@ts-ignore` workaround in Next.js type system

### Brand Colors (in globals.css)
```css
--color-navy: #0B1D3A
--color-gold: #C9A44B
--color-teal: #1D7A7A
--color-red: #D14B4B
```

## Testing Changes
After any code change, run:
```bash
npm run build
```
This compiles and runs full TypeScript type checking. Build must pass before considering changes complete.

## Frontend Conversion
A standalone React Vite frontend is located in `lotoks-frontend/`. It is structured as a Vite SPA (using `react-router-dom` for routing) and communicates with a local Express.js backend on port 3001.

### Standalone Frontend (`lotoks-frontend/`)
* **Stack**: React 19, Vite 8, TypeScript 6, React Router DOM v7, TanStack Query v5, Zustand, Framer Motion, and Lucide React.
* **Blank Page Fix**: Cleaned up legacy imports from `next/navigation` in `src/pages/Login.tsx` to use `react-router-dom`'s `useNavigate` to prevent browser rendering crashes.
* **Build / Dev Commands**:
  ```bash
  cd lotoks-frontend
  npm run dev       # Starts dev server on http://localhost:5173/
  npm run build     # Builds production distribution assets in dist/
  ```

### Express Backend (`lotoks-backend/`)
We implemented a lightweight, robust Express.js backend using SQLite. It mimics the full-scale MySQL schema (`scripts/schema.sql`) and self-seeds on its initial execution.
* **Stack**: Node.js (ES Modules), Express, SQLite (`sqlite3` driver with Promise wrappers), JWT, Cookie Parser, BCryptJS, and TypeScript.
* **Seeded Credentials**:
  - **Email**: `admin@lotoks.com`
  - **Password**: `admin123`
  - **Role**: `super_admin`
* **Port Configuration**: Port `3001` (to match the Vite frontend proxy `/api` redirect).
* **Build / Dev Commands**:
  ```bash
  cd lotoks-backend
  npm run build     # Compiles TS files to dist/
  node dist/server.js # Launches the backend server and seeds database
  ```

### AI Layout Design Assets (`processed_assets/`)
Pre-compiled premium card and horizontal hero assets are saved under `processed_assets/` (and root `card_ready.jpg`/`web_ready.jpg`). These were processed using an OpenCV Haar Cascade face-detection script to apply smart rule-of-thirds, vertical headroom alignment, edge gradient-shading, and theme-contrast tuning:
* **`card_ready.jpg` / `.png`** (300 x 400 px): Subject-centered card layout with 24px rounded corners (JPG with navy bg, PNG with transparent alpha).
* **`web_ready.jpg`** (1200 x 800 px): Off-center horizontal hero banner with a smooth left-side transparent-to-solid gradient overlay for clear typography overlays.