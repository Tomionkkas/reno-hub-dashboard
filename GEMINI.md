# RenoHub Project Context

## Project Overview

RenoHub is a unified platform that integrates three specialized renovation and construction applications into a single ecosystem. It provides authentication, a dashboard, and access management for:

1.  **CalcReno**: A material calculation and planning tool (Mobile-first, available on iOS/Android).
2.  **RenoTimeline**: A web-based project management tool for renovations.
3.  **RenoScout**: An AI-powered real estate investment platform (currently in "coming soon" status).

The project is built as a single-page application (SPA) using React and serves as the central hub for users to access these tools.

## Tech Stack

*   **Frontend Framework:** React 18 with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, shadcn/ui (Radix UI primitives)
*   **Animations:** GSAP, Tailwind animations
*   **Backend & Auth:** Supabase (Auth, Database)
*   **State Management:** React Context API (for Auth), TanStack Query (for data fetching)
*   **Routing:** React Router v6

## Key Directories & Files

*   **`src/App.tsx`**: Defines the main application routing and providers (Auth, QueryClient, Helmet, etc.).
*   **`src/lib/app-config.ts`**: Central configuration file for the integrated applications (metadata, IDs, status).
*   **`src/integrations/supabase/client.ts`**: Supabase client initialization and configuration.
*   **`src/contexts/AuthContext.tsx`**: Manages user authentication state, handling Supabase sessions and local storage fallbacks.
*   **`src/components/ui/`**: Contains reusable UI components, primarily based on shadcn/ui.
*   **`src/pages/`**: Contains top-level page components (Index, Dashboard, Login, Register, etc.).
*   **`vite.config.ts`**: Vite configuration, including path aliases (`@/` maps to `src/`).

## Development Conventions

*   **Path Aliases**: Use `@/` to import from the `src` directory.
*   **Authentication**: The app uses a hybrid approach. It prioritizes Supabase Auth but has a localStorage fallback for development/offline scenarios.
*   **Data Fetching**: Use `TanStack Query` for server state. The client is configured with a 5-minute stale time and does not retry on 4xx errors.
*   **Styling**: Use Tailwind CSS utility classes. Theming is handled via CSS variables (HSL values).
*   **Components**: Prefer using existing `shadcn/ui` components from `src/components/ui`.
*   **Animations**: Complex animations use GSAP; simple transitions use Tailwind/CSS.

## Build & Run Commands

*   `npm run dev`: Starts the development server (default port 8080).
*   `npm run build`: Builds the application for production.
*   `npm run preview`: Previews the production build locally.
*   `npm run lint`: Runs ESLint to check for code quality issues.
