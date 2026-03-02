# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Biovity** is a Chilean job platform connecting professionals and students with opportunities in the scientific sector (biotechnology, biochemistry, chemistry, chemical engineering, and health). The platform serves as a bridge between talent and scientific companies.

## Development Commands

```bash
# Development
bun dev              # Start dev server with Turbopack (fast refresh)
bun dev:portless     # Dev with Portless (shareable URLs)

# Production
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Run Biome linter
bun format           # Format code with Biome
bun check            # Lint and auto-fix
bun typecheck        # TypeScript type checking
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **TailwindCSS 4** for styling
- **PostgreSQL** (via pg driver, Supabase) for database
- **Better Auth** (^1.5.0) for authentication
- **@better-auth/infra** (dash plugin) for auth dashboard/analytics
- **Zod** (^4.x) for validation schemas
- **Biome** for linting/formatting (strict rules, line width: 100)
- **GSAP** and **Motion** for animations
- **Radix UI** + **Shadcn** + **Base UI** for accessible components
- **Recharts** for data visualizations (charts)
- **next-mdx-remote** for blog MDX content

## Authentication Architecture

The authentication system uses **Better Auth** configured in `lib/auth.ts` (server) and `lib/auth-client.ts` (client).

Key configuration:
- Email/password provider
- Custom user fields: `type` (professional/organization), `profession`, `avatar`, `isActive`, `organizationId`
- Session expiry: 7 days
- Rate limiting: 10 requests/minute per IP
- API endpoint: `app/api/auth/[...all]/route.ts`
- **Dash plugin** (`@better-auth/infra`): dashboard and analytics; requires `BETTER_AUTH_API_KEY` env var
- **Admin override**: emails in `ADMIN_EMAILS` (comma-separated) are treated as admin role regardless of `type`

### Server-side helpers (`lib/auth.ts`)
- `checkUserRole()`: returns `"admin" | "professional" | "organization" | null` for conditional routing (e.g. Parallel Routes). Admin if email in `ADMIN_EMAILS`; otherwise uses `session.user.type`. Note: `session.user.type` is not inferred by `getSession`; use `(session.user as { type?: string }).type` when accessing.

## Directory Structure

### App Router (`app/`)
```
app/
├── api/
│   ├── auth/[...all]/route.ts    # Better Auth endpoint
│   ├── og/route.ts               # Dynamic OG image generation
│   ├── waitlist/route.ts         # Waitlist signup (rate-limited)
│   └── cron/route.ts             # Cron jobs
├── blog/[slug]/                  # Blog posts (MDX)
├── dashboard/                    # Role-based via Parallel Routes
│   ├── @admin/                   # Admin dashboard
│   ├── @user/                    # Professional dashboard
│   │   ├── applications/         # Job applications (org view)
│   │   ├── calendar/             # Calendar
│   │   ├── job/[id]/             # Job detail
│   │   ├── messages/             # Messaging
│   │   ├── metrics/              # User analytics
│   │   ├── my-applications/      # User's applications
│   │   ├── profile/              # User profile
│   │   ├── saved/                # Saved jobs
│   │   ├── search/               # Job search
│   │   └── layout.tsx + page.tsx
│   ├── @organization/            # Organization dashboard
│   └── layout.tsx                # Routes by checkUserRole()
├── empresas/                     # Companies landing page
├── lista-espera/                 # Waitlist signup page
├── login/
│   ├── professional/            # Professional login
│   └── organization/            # Organization login
├── nosotros/                    # About us
├── og/                          # OG image assets
├── register/
│   ├── professional/            # Professional registration
│   └── organization/            # Organization registration
├── salarios/                    # Salary info
├── trabajos/                    # Public job board
│   └── [id]/                    # Job detail
├── sitemap.ts                   # Dynamic sitemap
└── page.tsx                     # Home
```

### Components (`components/`)
```
components/
├── animate-ui/                  # Animated Radix/UI primitives
├── base/                        # Base primitives (avatar, select, input, badges, tags, tooltip)
├── blog/                        # MDX components, SocialShare
├── common/                      # Footer, Header, LogoutButton, DatePicker
├── dashboard/employee/          # Dashboard tab content (home, sidebar, search, metrics, calendar)
├── landing/                     # Feature-based
│   ├── empresas/                # Companies landing
│   ├── home/                    # Home sections
│   ├── nosotros/                # About us
│   ├── salarios/                # Salary charts
│   └── trabajos/                # Job board
├── layouts/                     # Layout wrappers (LandingLayout)
├── providers/                   # MotionProvider
├── seo/                         # JsonLd
└── ui/                          # Shadcn + charts (accordion, badge, button, combobox, etc.)
```

### Library (`lib/`)
```
lib/
├── auth.ts                      # Better Auth server config
├── auth-client.ts               # Better Auth client config
├── animations.ts                # Animation configs
├── data/                        # Static data (jobs, categories, filters, home, nosotros, etc.)
├── db/
│   ├── index.ts                 # PostgreSQL pool (Supabase)
│   ├── waitlist.ts              # Waitlist insert
│   └── migrations/              # SQL migrations
├── errors.ts                    # Typed error constructors (ContextError, SignUpError, etc.)
├── get-strict-context.tsx       # Strict context helper
├── posts.ts                     # Blog post loading
├── rate-limit.ts                # In-memory rate limiter (waitlist API)
├── types/                       # TypeScript definitions per feature
├── utils.ts                     # cn, formatCurrencyCLP, formatSalarioRango, etc.
├── utils/                       # cx, is-react-component
└── validations/                 # Zod schemas (auth, contact, job, profile, waitlist, primitives)
```

### Other
```
content/blog/                    # MDX blog posts
docs/                            # Plans, SECURITY.md, COMMITS.md
hooks/                           # use-data-state, use-resize-observer, use-mobile
```

## Environment Variables

- `DATABASE_URL` – PostgreSQL connection string (Supabase)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` – Better Auth
- `BETTER_AUTH_API_KEY` – Dash plugin
- `ADMIN_EMAILS` – Comma-separated admin emails (optional)
- `NEXT_PUBLIC_APP_URL` – App URL for client
- `NEXT_PUBLIC_SITE_URL` – Site URL for sitemap (default: https://biovity.cl)

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
- **Parallel Routes**: `@admin`, `@user`, `@organization` – layout picks slot by `checkUserRole()`
- Tab-based navigation with separate content components in `components/dashboard/employee/`
- Sidebar state persisted via cookies
- Role-based routing (admin vs professional vs organization)

### Component Organization
- Feature-based grouping under `components/landing/` and `components/dashboard/`
- Reusable UI in `components/ui/` (Shadcn) and `components/base/` (primitives)
- Layout wrappers for consistent structure
- `components/animate-ui/` for animated Radix variants

### Data Management
- Static data files in `lib/data/` (jobs, categories, filters)
- TypeScript interfaces in `lib/types/` matching data structure
- Zod schemas in `lib/validations/` for forms and API validation
- Utility functions for formatting (currency CLP, dates, badge colors) in `lib/utils.ts`

### Database (Postgres)
- Shared connection pool in `lib/db/index.ts` (Supabase, max 10 conns, idle timeout 30s)
- Migrations in `lib/db/migrations/`

### API Routes
- `app/api/waitlist/route.ts`: POST with rate limiting (`lib/rate-limit.ts`), Zod validation
- `app/api/og/route.ts`: Dynamic OG images
- `app/api/cron/route.ts`: Scheduled tasks

### Styling Approach
- Tailwind-first (no CSS modules or inline styles)
- Utility classes for all styling
- Gradient backgrounds for visual hierarchy
- Consistent spacing with padding/margin utilities
