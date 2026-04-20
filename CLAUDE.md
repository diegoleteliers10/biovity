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
- `NEXT_PUBLIC_SITE_URL` – Site URL for sitemap (default: [https://biovity.cl](https://biovity.cl))

## Code Style Guidelines

From `.cursor/rules/` - follow these patterns:

- **Early returns** for readability
- **Tailwind classes only** for styling (no CSS modules)
- **Descriptive names**: Event handlers use `handle` prefix (`handleClick`, `handleSubmit`)
- **Const functions**: Prefer `const toggle = () =>` over function declarations
- **Accessibility**: Include `aria-label`, `tabindex`, keyboard handlers
- **TypeScript strict**: Define types for all functions/components

### Post-implementation: `/remove-ai-slop`

After every code generation or modification, run the `/remove-ai-slop` skill to audit the touched files. Remove:

- Comments a human wouldn't write or that are inconsistent with the rest of the file
- Unnecessary defensive checks or try/catch blocks in trusted/validated codepaths
- Casts to `any` used to work around type issues
- Style inconsistencies with the surrounding code
- Unnecessary emoji usage

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

## MCP-Driven Development Workflow

Every implementation task MUST follow this three-phase workflow using the available MCP servers. No code should be written without completing phases 1 and 2 first.

### Phase 1: Research with DeepWiki (`user-deepwiki`)

Before writing any code, use DeepWiki to find reference implementations in relevant GitHub repositories. This provides real-world patterns and avoids reinventing solutions.

**When to use:**

- Implementing a new feature, API route, or component pattern
- Integrating a library you haven't used before in this project
- Solving an architectural decision (e.g. auth flow, data fetching strategy)

**How to use:**

1. `ask_question` — Ask implementation questions against repos from the tech stack:
  - `better-auth/better-auth` — auth flows, plugins, session management
  - `vercel/next.js` — App Router patterns, API routes, middleware
  - `colinhacks/zod` — validation schemas, transforms, branded types
  - `shadcn-ui/ui` — component patterns, Radix integration
  - `TanStack/query` — data fetching, mutations, cache invalidation
  - `supabase/supabase` — Postgres, storage, realtime
  - `recharts/recharts` — chart implementations
2. `read_wiki_structure` — Get the documentation topic tree before diving deep.
3. `read_wiki_contents` — Read full documentation for specific patterns.

**Example flow:**

```
# Before implementing password reset:
ask_question("better-auth/better-auth", "How to implement password reset flow with email verification?")

# Before building a Kanban board:
ask_question("vercel/next.js", "How to implement drag and drop with server actions in App Router?")
```

### Phase 2: Inspect Source Code with OpenSrc (`user-opensrc`)

After researching patterns, use OpenSrc to read the actual source code of dependencies used in this project. This ensures implementations align with how the library actually works, not how you think it works.

**When to use:**

- Before calling any library API for the first time in a feature
- When DeepWiki gives you a pattern but you need to verify exact function signatures
- When debugging unexpected behavior from a dependency
- When you need to understand internal types or exports

**How to use (via `execute` tool):**

1. **Fetch the dependency source:**
  ```js
   async () => {
     const [{ source }] = await opensrc.fetch("better-auth");
     return await opensrc.tree(source.name, { depth: 2 });
   }
  ```
2. **Search for specific patterns:**
  ```js
   async () => {
     return await opensrc.grep("forgetPassword", {
       sources: ["better-auth"],
       include: "*.ts"
     });
   }
  ```
3. **Read the actual implementation:**
  ```js
   async () => {
     return await opensrc.read("better-auth", "src/plugins/email-password/routes.ts");
   }
  ```

**Key dependencies to inspect when relevant:**

- `better-auth` — auth config, plugins, client methods
- `zod` — schema internals, error types
- `@tanstack/react-query` — hook signatures, mutation patterns
- `@radix-ui/`* — component props, accessibility internals
- `recharts` — chart component APIs, data shapes
- `motion` — animation API, variants

### Phase 3: Plan and Execute with Sequential Thinking (`user-sequential-thinking`)

Use Sequential Thinking to break down every non-trivial task into structured steps before writing code. This prevents half-baked implementations and ensures nothing is missed.

**When to use:**

- ANY task that involves more than a single file change
- Feature implementation, bug fixes with multiple causes, refactors
- When the solution path is not immediately obvious

**How to use (via `sequentialthinking` tool):**

1. **Start with problem decomposition** — Break the task into numbered steps.
2. **Plan each step** — Define what files to touch, what to change, dependencies.
3. **Revise if needed** — Use `isRevision: true` to correct course mid-plan.
4. **Verify hypothesis** — Before finishing, validate the plan covers all edge cases.

**Required parameters:**

- `thought`: Current reasoning step
- `thoughtNumber`: Step number (1, 2, 3...)
- `totalThoughts`: Estimated total steps (adjust as you go)
- `nextThoughtNeeded`: `true` until the final step

**Example flow for implementing a feature:**

```
Thought 1: Identify all files that need changes and their dependencies
Thought 2: Define the data model / types needed
Thought 3: Plan the API layer (endpoints, validation)
Thought 4: Plan the UI components and their state management
Thought 5: Define error handling and edge cases
Thought 6: Verify the plan covers the full requirement
```

### Complete Workflow Example

> Task: "Implement password reset flow"

1. **DeepWiki** → `ask_question("better-auth/better-auth", "How does password reset work? What routes and methods are needed?")`
2. **OpenSrc** → Fetch `better-auth`, grep for `forgetPassword`, read the actual route handler and client methods
3. **Sequential Thinking** → Plan: (1) add auth config, (2) create forgot-password page, (3) create reset-password page, (4) add email sending, (5) wire login page links, (6) add validation schemas, (7) test flow
4. **Implement** → Write code following the plan with full context from phases 1-2

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

### Animation Guidelines

Follow the animation tokens and patterns defined in `DESIGN.md`:

- **Micro-interactions**: 150ms ease-out for hover/focus states
- **Reveals**: 300ms ease-out with translateY(8px → 0) + opacity
- **Page transitions**: 300ms smooth via DirectionalTransition component
- **Hero animations**: 500ms slow with 50-100ms stagger between elements
- **Scale on hover**: 150ms scale(0.95 → 1) for interactive elements

Use `lib/animations.ts` for predefined animation variants. Prefer Motion for complex sequences and Tailwind utilities for simple transitions.

