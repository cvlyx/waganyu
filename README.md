# Waganyu — Task Marketplace Platform

Malawi's task marketplace connecting job posters with skilled professionals. This monorepo contains the **Expo mobile app** and the **web landing page**.

---

## Repository Structure

```
waganyu/
├── Task-Connect-Hub/          # Expo React Native mobile app (pnpm monorepo)
│   ├── artifacts/
│   │   ├── waganyu-mobile/    # Main mobile app
│   │   ├── api-server/        # Express backend (future)
│   │   └── mockup-sandbox/    # UI component sandbox
│   ├── lib/
│   │   ├── api-client-react/  # Generated API hooks (Orval)
│   │   ├── api-spec/          # OpenAPI spec
│   │   ├── api-zod/           # Zod validation schemas
│   │   └── db/                # Drizzle ORM schema
│   └── package.json
└── waganyu-web/               # React + Vite web landing page
    ├── src/
    │   └── pages/LandingPage.tsx
    └── package.json
```

---

## Quick Start

### Mobile App

```bash
cd Task-Connect-Hub
pnpm install
cd artifacts/waganyu-mobile
pnpm exec expo start
```

Scan the QR code with **Expo Go** on your phone, or press `w` to open in browser.

### Web App

```bash
cd waganyu-web
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile framework | Expo SDK 54 + React Native 0.81 |
| Navigation | Expo Router (file-based) |
| State | React Context + AsyncStorage |
| Animations | React Native Reanimated |
| Font | Poppins (400/500/600/700) |
| Icons | Expo Vector Icons (Feather) |
| Web framework | React 18 + Vite 5 |
| Web styling | Tailwind CSS 3 |
| Web animations | Framer Motion |
| Package manager | pnpm (mobile) / npm (web) |
| Language | TypeScript throughout |

---

## Mobile App — Feature Overview

### Authentication Flow
1. **Landing page** — animated hero with stats, categories, features
2. **Register** — name, email, password only (no role selection)
3. **Profile Setup** (4 steps) — intent, skills, city, bio
4. **Login** — email + password

### Main Screens

| Screen | Description |
|---|---|
| Home | Job feed with search, category filter, urgent jobs, top pros |
| Workers | Browse professionals with skill/verified/online filters |
| Messages | Chat list with unread badges |
| Notifications | Activity feed with mark-all-read |
| Profile | Stats, settings menu, logout |

### Detail Screens
- **Job Detail** — full description, budget, poster info, apply button
- **Worker Profile** — bio, skills, rate, hire/message actions
- **Chat** — real-time-style messaging UI
- **Post a Job** — category, budget, location, urgency toggle

### Design System
- **Primary colour:** `#059669` (deep emerald)
- **Accent:** `#D97706` (amber — ratings/stars only)
- **Background:** `#FAFAFA` / Cards: `#FFFFFF`
- **Text:** `#0F172A` / Muted: `#64748B`
- **Light mode forced** — `useColors()` always returns light palette
- **Currency:** MK (Malawian Kwacha)
- **Locations:** Lilongwe, Blantyre, Mzuzu and other Malawian cities

---

## What Still Needs to Be Done

### 🔴 Critical (before launch)

- [ ] **Real authentication** — replace mock login with actual API (JWT or session)
- [ ] **Backend API** — connect `api-server` to a real PostgreSQL database
- [ ] **Real job/worker data** — replace `MOCK_JOBS` and `MOCK_WORKERS` in `DataContext.tsx` with API calls
- [ ] **Payment integration** — implement secure escrow payment flow (e.g. Airtel Money, TNM Mpamba)
- [ ] **Push notifications** — integrate Expo Notifications for job alerts, messages
- [ ] **Image uploads** — profile photos, job images via Expo ImagePicker + cloud storage

### 🟡 Important (post-MVP)

- [ ] **Worker verification system** — admin panel to verify professional credentials
- [ ] **Reviews & ratings** — allow posters to rate workers after job completion
- [ ] **Real-time chat** — replace mock messages with WebSocket or Firebase
- [ ] **Job application flow** — workers apply, poster accepts/rejects
- [ ] **Location services** — use Expo Location to show nearby jobs on a map
- [ ] **Search & filtering** — server-side search with distance radius
- [ ] **Saved jobs persistence** — sync saved jobs to backend, not just AsyncStorage

### 🟢 Web App (colleague to complete)

- [ ] **Auth pages** — `/login`, `/register`, `/forgot-password`
- [ ] **Dashboard** — job poster and worker dashboards
- [ ] **Job listings page** — browse and search all jobs
- [ ] **Worker directory** — browse professionals
- [ ] **Post a job form** — web version of the mobile post-job screen
- [ ] **User profile page** — view and edit profile
- [ ] **Responsive design** — ensure all pages work on mobile browsers
- [ ] **SEO** — meta tags, sitemap, Open Graph

### 🔵 Infrastructure

- [ ] **Environment variables** — set up `.env` for API URLs, DB connection strings
- [ ] **CI/CD** — GitHub Actions for lint, typecheck, build on every PR
- [ ] **App Store submission** — iOS App Store + Google Play Store
- [ ] **Domain & hosting** — deploy web app (Vercel/Netlify) and API (Railway/Render)
- [ ] **Error monitoring** — integrate Sentry for crash reporting

---

## Environment Variables

Create a `.env` file in `Task-Connect-Hub/artifacts/waganyu-mobile/`:

```env
EXPO_PUBLIC_API_URL=https://api.waganyu.com
EXPO_PUBLIC_APP_ENV=development
```

Create a `.env` in `Task-Connect-Hub/artifacts/api-server/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/waganyu
PORT=8080
NODE_ENV=development
```

---

## Mock Test Accounts

These work with the current mock auth:

| Email | Password | Role |
|---|---|---|
| `alex@example.com` | any | Job Poster (Lilongwe) |
| `james@example.com` | any | Skilled Worker (Blantyre) |

Any other email will create a new account and go through profile setup.

---

## Contributing

1. Clone the repo
2. Install dependencies (`pnpm install` in `Task-Connect-Hub`, `npm install` in `waganyu-web`)
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make changes, commit, push
5. Open a pull request

---

*Waganyu Digital Excellence © 2025*
