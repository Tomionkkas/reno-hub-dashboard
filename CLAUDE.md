# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RenoHub is a unified platform combining three renovation and construction applications:
- **CalcReno**: Material calculation and planning tool (Mobile - iOS/Android)
- **RenoTimeline**: Project management for renovations (Web app)
- **RenoScout**: AI-powered real estate investment platform (Coming soon)

This is a React-based web application that serves as the hub, providing authentication, dashboards, and integration with the individual apps.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (development server on port 8080)
- **Styling**: Tailwind CSS with extensive custom animations
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (Auth, Database, MCP integration)
- **Routing**: React Router v6
- **State Management**: React Context API (AuthContext)
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: GSAP + Tailwind animations
- **Forms**: React Hook Form + Zod validation

## Development Commands

```bash
# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development mode (includes component tagger)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Key Architecture Patterns

### Path Aliases
The project uses `@/` as an alias for `src/`:
```typescript
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
```

### Authentication Flow
Authentication is handled through `AuthContext.tsx` with a hybrid approach:
1. **Primary**: Supabase Auth (production)
2. **Fallback**: localStorage mock auth (development/offline)

The auth system checks Supabase session first via `getSession()`, then `getUser()`, and only falls back to localStorage if Supabase is unavailable. All new authentication should use Supabase.

Admin role is determined by email: `admin@renohub.com`

### App Configuration System
Apps are centrally configured in `src/lib/app-config.ts`:
```typescript
export interface AppConfig {
  id: AppId;
  name: string;
  schema: string | null;        // Supabase schema name
  tableName: string | null;      // Main table for app data
  userIdColumn: string | null;   // Column to filter by user
  externalUrl: string | null;    // External app URL if applicable
  icon: string;
  tags: string[];
  status: 'available' | 'coming_soon';
}
```

Each app can have its own Supabase schema for data isolation. Projects are queried using app-specific schemas.

### Beta Mode
The platform has a beta mode flag (`IS_BETA_MODE`) that controls feature availability. Default is `true` unless `VITE_IS_BETA_MODE` env var is set to `false`.

### React Query Configuration
Query client is configured with:
- 5-minute stale time
- 10-minute garbage collection time
- No retry on 4xx errors
- Max 3 retries on other errors
- Window focus refetch disabled

### Route Structure
All routes are defined in `App.tsx`:
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (shows subscribed apps)
- `/admin` - Admin panel
- `/renoscout` - RenoScout application page
- `*` - 404 Not Found

**Important**: Custom routes must be added ABOVE the catch-all `*` route.

### UI Components
The codebase uses shadcn/ui components located in `src/components/ui/`. Notable custom components:
- `error-boundary.tsx` - Top-level error handling
- `lazy-wrapper.tsx` - Code splitting wrapper
- `seo-head.tsx` - Dynamic SEO meta tags
- `visual-enhancements.tsx` - Performance-optimized animations
- `accessibility-enhancer.tsx` - WCAG compliance features
- `micro-interactions.tsx` - User feedback animations

### Animations
Heavy use of animations via:
1. **Tailwind animations**: Custom keyframes defined in `tailwind.config.ts` (fade-in, slide-in, float, glow-pulse, etc.)
2. **GSAP**: Advanced animations in `src/components/animations/`

### Supabase Integration
Supabase client is initialized in `src/integrations/supabase/client.ts` with:
- Session persistence enabled
- Auto token refresh enabled
- Session detection in URL enabled

MCP Server for Supabase is configured in `.mcp.json` for Claude Code integration.

### PWA Features
The app is PWA-ready with:
- Service Worker (`public/sw.js`)
- Web manifest (`public/manifest.json`)
- Theme color: `#5A4BFF` (reno-purple)

## Important Development Notes

### TypeScript Configuration
The project has relaxed TypeScript settings:
- `noImplicitAny: false`
- `noUnusedParameters: false`
- `noUnusedLocals: false`
- `strictNullChecks: false`

ESLint also has `@typescript-eslint/no-unused-vars` disabled. Be mindful of type safety when making changes.

### Styling Conventions
- Brand colors: `reno-purple` (#5A4BFF), `reno-blue` (#7F67FF), `reno-mint` (#00D4AA)
- Uses CSS custom properties for theming (HSL-based)
- Inter font family for typography
- Dark mode support via `class` strategy

### Component Organization
```
src/
├── components/
│   ├── animations/      # GSAP animation components
│   ├── sections/        # Page section components
│   └── ui/              # Reusable UI components (shadcn/ui + custom)
├── contexts/            # React contexts (Auth, etc.)
├── hooks/               # Custom hooks (use-mobile, use-toast, etc.)
├── integrations/        # Third-party integrations (Supabase)
├── lib/                 # Utilities (app-config, utils, queries)
└── pages/               # Route pages
```

### Adding a New Route
1. Create page component in `src/pages/`
2. Import in `App.tsx`
3. Add `<Route>` **before** the `*` catch-all route
4. Ensure route uses `ErrorBoundary` and `LazyWrapper` (provided by App structure)

### Working with Supabase
- Always use the `supabase` client from `@/integrations/supabase/client`
- Auth state is managed via `AuthContext` - use `useAuth()` hook
- The Supabase MCP server is connected and can be used for database operations
- Each app can have its own schema for data isolation

### Performance Considerations
- Components use lazy loading via `LazyWrapper`
- React Query caching reduces network requests
- Service Worker provides offline capability
- Performance monitoring hooks available in `src/hooks/use-performance.tsx`

### Error Handling
- Top-level `ErrorBoundary` wraps the entire app
- Supabase errors should be caught and provide user-friendly messages
- Network errors in auth show Polish language messages (project has Polish language support)

## Multi-language Support
The project includes Polish language support in user-facing messages, particularly in authentication error messages.
