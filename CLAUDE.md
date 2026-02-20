# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Biovity** is a Chilean job platform connecting professionals and students with opportunities in the scientific sector (biotechnology, biochemistry, chemistry, chemical engineering, and health). The platform serves as a bridge between talent and scientific companies.

## Development Commands

```bash
# Development
bun dev              # Start dev server with Turbopack (fast refresh)

# Production
bun build           # Build for production
bun start           # Start production server

# Code Quality
bun lint            # Run Biome linter
bun format          # Format code with Biome
bun check           # Lint and auto-fix
bun typecheck       # TypeScript type checking
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **TailwindCSS 4** for styling
- **PostgreSQL** (via pg driver) for database
- **Better Auth** for authentication
- **Biome** for linting/formatting (strict rules, line width: 100)
- **GSAP** and **Motion** for animations
- **Radix UI** + **Shadcn** for accessible components

## Authentication Architecture

The authentication system uses **Better Auth** configured in `lib/auth.ts` (server) and `lib/auth-client.ts` (client).

Key configuration:
- Email/password provider
- Custom user fields: `type` (employee/organization), `profession`, `avatar`, `isActive`, `organizationId`
- Session expiry: 7 days
- Rate limiting: 10 requests/minute per IP
- API endpoint: `app/api/auth/[...all]/route.ts`

## Directory Structure

### App Router (`app/`)
```
app/
├── api/auth/[...all]/route.ts    # Better Auth endpoint
├── dashboard/
│   ├── admin/                   # Admin dashboard
│   └── employee/                # Employee dashboard (nested layout)
│       ├── applications/        # Job applications
│       ├── calendar/           # Calendar integration
│       ├── messages/           # Messaging
│       ├── metrics/            # User analytics
│       ├── my-applications/    # User's applications
│       ├── profile/            # User profile
│       ├── saved/              # Saved jobs
│       ├── search/             # Job search
│       ├── layout.tsx          # Dashboard layout wrapper
│       └── page.tsx            # Dashboard home
├── empresas/                   # Companies landing page
├── login/                      # Login (user/org)
├── nosotros/                   # About us
├── page.tsx                    # Home
├── register/                   # Registration (user/org)
├── salarios/                   # Salary info
└── trabajos/                   # Public job board
```

### Components (`components/`)
```
components/
├── common/                     # Footer, Header, LogoutButton
├── landing/                    # Feature-based (home/, empresas/, nosotros/)
├── dashboard/employee/         # Dashboard tab components
├── layouts/                    # Layout wrappers (LandingLayout)
└── ui/                        # Base UI components (shadcn/radix)
```

### Library (`lib/`)
```
lib/
├── auth.ts                    # Better Auth server config
├── auth-client.ts             # Better Auth client config
├── data/                      # Static data files (jobs, categories, etc.)
├── types/                     # TypeScript definitions per feature
└── utils.ts                   # Utility functions (currency, dates, badges)
```

## Code Style Guidelines

From `.cursor/rules/` - follow these patterns:

- **Early returns** for readability
- **Tailwind classes only** for styling (no CSS modules)
- **Descriptive names**: Event handlers use `handle` prefix (`handleClick`, `handleSubmit`)
- **Const functions**: Prefer `const toggle = () =>` over function declarations
- **Accessibility**: Include `aria-label`, `tabindex`, keyboard handlers
- **TypeScript strict**: Define types for all functions/components

## Commit Convention

Follow Conventional Commits format:
```
<type>(<scope>): <description>

Types: feat, fix, hotfix, design, refactor, docs, test, chore, perf, style, ci
```

Example: `feat(dashboard): implement metrics chart`

Use imperatives ("add" not "added"), keep first line under 72 chars, reference issues with `Closes #123`.

## Branch Convention

```
<type>/<short-description>

Types: feat, fix, hotfix, design, refactor, docs, test, chore
```

Example: `feat/user-dashboard-metrics`

## Important Patterns

### Dashboard Layout
- Nested layouts in `app/dashboard/employee/`
- Tab-based navigation with separate content components
- Sidebar state persisted via cookies
- Role-based routing (employee vs admin)

### Component Organization
- Feature-based grouping under `components/landing/` and `components/dashboard/`
- Reusable UI components in `components/ui/`
- Layout wrappers for consistent structure

### Data Management
- Static data files in `lib/data/` (jobs, categories, filters)
- TypeScript interfaces in `lib/types/` matching data structure
- Utility functions for formatting (currency CLP, dates, badge colors)

### Database (Postgres)
- Shared connection pool in `lib/db/index.ts` (conn-pooling, conn-limits, conn-idle-timeout)
- Migrations in `lib/db/migrations/`
- Best practices: `docs/POSTGRES-BEST-PRACTICES.md`

### Styling Approach
- Tailwind-first (no CSS modules or inline styles)
- Utility classes for all styling
- Gradient backgrounds for visual hierarchy
- Consistent spacing with padding/margin utilities
