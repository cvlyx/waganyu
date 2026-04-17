# Waganyu Web

React + Vite + Tailwind CSS web application for the Waganyu task marketplace.

## Status

**Landing page is complete.** All other pages are yet to be built.

## Getting Started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Stack

- **React 18** + TypeScript
- **Vite 5** — build tool
- **Tailwind CSS 3** — styling
- **Framer Motion** — animations
- **Lucide React** — icons
- **Inter** font (Google Fonts)

## Design Tokens (matches mobile app)

| Token | Value |
|---|---|
| Primary | `#059669` (deep emerald) |
| Primary Light | `#D1FAE5` |
| Accent | `#D97706` (amber) |
| Background | `#FAFAFA` |
| Foreground | `#0F172A` |
| Muted text | `#64748B` |
| Border | `#E2E8F0` |

All tokens are defined in `tailwind.config.js` and mirror the mobile app's `constants/colors.ts`.

## Project Structure

```
waganyu-web/
├── src/
│   ├── pages/
│   │   └── LandingPage.tsx    ✅ Complete
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.svg
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Pages to Build

| Route | Page | Status |
|---|---|---|
| `/` | Landing page | ✅ Done |
| `/login` | Sign in | ⬜ Todo |
| `/register` | Create account | ⬜ Todo |
| `/dashboard` | User dashboard | ⬜ Todo |
| `/jobs` | Browse jobs | ⬜ Todo |
| `/jobs/:id` | Job detail | ⬜ Todo |
| `/workers` | Browse professionals | ⬜ Todo |
| `/workers/:id` | Worker profile | ⬜ Todo |
| `/post-job` | Post a job | ⬜ Todo |
| `/profile` | My profile | ⬜ Todo |
| `/messages` | Inbox | ⬜ Todo |

## Recommended Libraries to Add

```bash
npm install react-router-dom        # routing
npm install @tanstack/react-query   # data fetching
npm install react-hook-form zod     # forms + validation
npm install axios                   # HTTP client
```

## Notes for the Developer

- Keep the same colour palette as the mobile app (already in `tailwind.config.js`)
- The API base URL will be `https://api.waganyu.com` (set as env var)
- Currency is **MK** (Malawian Kwacha)
- All city references should use Malawian cities (Lilongwe, Blantyre, Mzuzu, etc.)
- The landing page sections (Hero, Categories, How It Works, Features, Testimonials, CTA, Footer) are all in `src/pages/LandingPage.tsx` — use them as reference for the design language
