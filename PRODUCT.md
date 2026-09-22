# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Professionals** — scientific and biotech talent in Chile (biotechnologists, lab technicians, R&D scientists, students) searching for jobs, tracking applications, and managing their careers. Primary audience of `/`.
2. **Organizations** — biotech companies, laboratories, and R&D organizations hiring through an ATS: publishing offers, managing a candidate pipeline, screening with AI scoring. Primary audience of `/companies`.
3. **Admins** — internal Biovity team managing users, organizations, waitlist, AI logs (inferred from `app/dashboard/@admin/`).

## Product Purpose

Biovity connects scientific talent with biotechnology companies, laboratories, and R&D organizations in Chile. Success means: professionals find relevant, transparent opportunities (visible salaries), and organizations fill specialized roles faster with AI-assisted screening.

## Positioning

A vertical, science-specialized job ecosystem — not a generic job board. Differentiators: salary transparency as a first-class feature, AI-powered candidate matching/scoring, and science-specific taxonomy (specialties, techniques, categories).

## Operating Context

- Public marketing routes: `/`, `/companies`, `/recruiting`, `/jobs`, `/salaries`, plus brand pages.
- Authenticated product: `/dashboard` with three parallel slots by role (`@user`, `@organization`, `@admin`).
- Users speak Spanish (Chile). All product copy is in Spanish.
- Data flows through a typed REST backend (`/api/v1/*` proxied) via TanStack Query hooks in `lib/api/`.

## Capabilities and Constraints

- Professional dashboard: applications tracking, saved jobs, job search with filters/sort, job alerts, messages with recruiters, metrics (response rate), calendar, profile.
- Organization dashboard: offers management (create/publish, AI description writer), applications kanban pipeline with AI scoring and scorecards, talent pool search, org metrics (conversion funnel, geographic distribution), team management, plans/subscription.
- Auth via Better Auth; role from `user.type` (`professional | organization | admin`).
- **Demo mode (added 2026-09):** the landing pages embed interactive dashboard demos with synthetic fixture data. Demos must be visually accurate to the real dashboards but must not require a session, perform real mutations, or present synthetic data as real (labeled as demo).

## Brand Commitments

- Design authority: `DESIGN.md` ("The Curated Organism"), two registers — brand (marketing) vs product (dashboard) — with strict rules per register.
- Palette: Deep Slate Navy primary, Emerald Green secondary, Biovity Violet accent (contrast-restricted), tonal surfaces, **no drop shadows on cards anywhere**.
- Typography: Geist Sans + Geist Mono (eyebrows, technical labels).

## Evidence on Hand

- Live data: job categories counts (`/api/landing/home/categories`), org/specialty stats (`/api/landing/empresas/stats`, currently unused).
- **No real customer logos or testimonials exist** — the logos/testimonials sections on `/companies` are commented out. Never fabricate them.
- Demo dashboards use authored synthetic personas/fixtures (labeled as demo), not real user data.

## Product Principles

1. Show, don't tell: the product's value is the dashboard experience itself — demonstrate it with accurate, interactive previews rather than claims.
2. Transparency is the product: visible salaries, clear states, honest empty states.
3. Density with clarity: product surfaces pack real data but stay scannable; brand surfaces breathe.
4. Spanish first: all user-facing copy in natural Chilean-professional Spanish.

## Accessibility & Inclusion

- WCAG AA contrast pairings enforced in DESIGN.md §2.3; `prefers-reduced-motion` respected on animated sections.
