# Plan de Commits - Cambios Pendientes

Base: Conventional Commits (`<type>(<scope>): <description>`)
Types: feat, fix, refactor, docs, style, chore

## Ejecutados (2026-02-10)

| # | Commit | Descripción |
|---|--------|-------------|
| 1 | `feat(waitlist)` | Lista de espera con Supabase, API, rate limit, proxy |
| 2 | `feat(security)` | Security headers, .env.example, docs/SECURITY.md |
| 3 | `feat(blog)` | Blog section con MDX |
| 4 | `feat(trabajos)` | Job board público y páginas de detalle |
| 5 | `feat(salarios)` | Página de información salarial |
| 6 | `feat(seo)` | Sitemap, robots, OG images |
| 7 | `refactor(landing)` | Migración a estructura feature-based |
| 8 | `refactor(dashboard)` | Migración a estructura feature-based |
| 9 | `feat(ui)` | LogoutButton, auth, nuevos UI components, calendar |
| 10 | `style` | Globals y tailwind config |
| 11 | `chore` | Footer, Header, layout, utils |
| 12 | `docs` | CLAUDE.md, COMMITS.md |

---

## 1. feat(waitlist): add waitlist page with Supabase and production proxy

- `app/lista-espera/`
- `app/api/waitlist/`
- `lib/db/`
- `lib/rate-limit.ts`
- `proxy.ts`
- `docs/plans/2026-02-10-waitlist-design.md`

---

## 2. feat(security): add security headers, rate limiting, and env template

- `next.config.ts` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, X-XSS-Protection)
- `.gitignore` (!.env.example)
- `.env.example`
- `docs/SECURITY.md`

---

## 3. feat(blog): add blog section with MDX

- `app/blog/`
- `components/blog/`
- `lib/posts.ts`

---

## 4. feat(trabajos): add public job board and detail pages

- `app/trabajos/`
- `lib/data/trabajos-data.ts`
- `lib/data/trabajos-filtros-data.ts`
- `lib/types/` (trabajos)
- `docs/plans/2026-01-24-trabajo-page-design.md`

---

## 5. feat(salarios): add salary info page

- `app/salarios/`
- `lib/data/salarios-data.ts`

---

## 6. feat(seo): add sitemap, robots, and OG images

- `app/robots.ts`
- `app/sitemap.ts`
- `app/og/`
- `components/seo/`

---

## 7. refactor(landing): migrate to feature-based landing structure

- `components/landing/`
- `components/layouts/`
- `lib/data/home-data.ts`
- `lib/data/empresas-data.ts`
- `lib/data/nosotros-data.ts`
- `app/page.tsx`
- `app/empresas/page.tsx`
- `app/nosotros/page.tsx`
- Remove: `components/LandingComponents/`
- Remove: `components/Layouts/LandingLayout.tsx`

---

## 8. refactor(dashboard): migrate to feature-based dashboard structure

- `components/dashboard/`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/employee/*`
- Remove: `components/DashboardComponents/`

---

## 9. feat(ui): add LogoutButton, auth updates, and new UI components

- `components/common/LogoutButton.tsx`
- `lib/auth-client.ts`
- `lib/auth.ts`
- `app/login/`
- `app/register/`
- `components/ui/alert-dialog.tsx`
- `components/ui/breadcrumb.tsx`
- `components/ui/combobox.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/field.tsx`
- `components/ui/input-group.tsx`
- `components/ui/select.tsx`
- `components/ui/textarea.tsx`
- `components/base/select/multi-select.tsx`
- `components/animate-ui/primitives/effects/highlight.tsx`

---

## 10. refactor(calendar): remove legacy calendar components

- Remove: `components/calendar-section.tsx`, `components/calendar.tsx`, `components/day-modal.tsx`, `components/event-tooltip.tsx`, `components/upcoming-events.tsx`
- `hooks/useScrollAnimation.ts` → `hooks/useScrollAnimation.tsx`

---

## 11. style: update globals and tailwind config

- `app/globals.css`
- `tailwind.config.ts`

---

## 12. chore: update common components and layout

- `components/common/Footer.tsx`
- `components/common/Header.tsx`
- `app/layout.tsx`
- `lib/utils.ts`

---

## 13. docs: add CLAUDE and project docs

- `CLAUDE.md`
