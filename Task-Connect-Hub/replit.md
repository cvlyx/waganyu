# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Includes a Waganyu mobile marketplace app built with Expo React Native.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo React Native (expo-router, Poppins font, React Query)

## Artifacts

### Waganyu Mobile (`artifacts/waganyu-mobile`)
A task marketplace mobile app connecting job posters with workers/skilled professionals.

**Features:**
- Login / Register screens with role selection (Poster, Worker, Skilled Pro)
- Home feed with job listings, categories, urgent jobs, and top professionals
- Workers directory with search, filter by skill, verified and online filters
- Job detail screen with apply functionality
- Worker profile screen with hire/message actions
- Post a Job screen with category, budget, urgency settings
- In-app messaging (chat screens)
- Notifications center
- Profile with stats, verification badge, settings menu

**Design:**
- Color palette: #1DB954 (green primary), #191414 (dark bg), #FFFFFF (white)
- Font: Poppins (400/500/600/700)
- Dark-aware colors via `constants/colors.ts` + `useColors()` hook
- Animations via react-native-reanimated

**Data persistence:** AsyncStorage (local, no backend required)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
