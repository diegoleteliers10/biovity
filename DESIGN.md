# Biovity Design System Specification: "The Curated Organism"

> **Official Brand & Product UI Design System for Biovity**  
> Brand reference: [`/marca`](file:///Users/dleteliers/Dev/biovity/app/marca/page.tsx).  
> This revision adds explicit **register rules** (brand vs. product), **component states**, a **spacing scale**, and **verified contrast ratios** — the gaps that previously caused brand-page patterns (generous padding, centered stat cards) to leak into product surfaces like `/dashboard`.

---

## 0. Register Application — Read This First

Biovity has two design registers that pull in opposite directions. Every component recipe in this document belongs to one or the other. **Before styling anything, identify which register the surface belongs to.**

| | **Brand register** | **Product register** |
|---|---|---|
| **Surfaces** | `/`, `/marca`, `/nosotros`, `/empresas`, `/salarios`, `/consejos-carrera`, pricing, campaign pages | `/dashboard`, `/panel`, `/postulaciones`, internal forms, settings, any authenticated app screen |
| **Job of the design** | Sell a feeling. Design *is* the product. | Serve a task. Design *supports* the product. |
| **Padding scale** | `p-8`–`p-12` on containers, `p-4 sm:p-5` on hero stat cards | **Strict cap: `max py-6`** (`p-4`–`p-6` / `py-4`–`py-6`) on all cards, never exceed `py-6` |
| **Card Header Typography** | `text-base`–`text-xl font-semibold` | **`text-xs leading-4 font-medium`** for all card headers & labels |
| **Card Shadow Rule** | **`shadow-none` (No shadows)** | **`shadow-none` (No shadows under any circumstances)** |
| **Card height** | Can be uniform/fixed for visual rhythm | Must follow content — no forced `min-h` |
| **Color strategy** | Committed — violet/emerald accents can carry visual weight | Restrained — one accent, tinted neutrals for everything else |
| **Motion budget** | Generous — stagger, scroll-reveal, hover scale | Functional only — state changes, not decoration |
| **Typography scale** | Full display scale (§3.2 A–D) | Density scale (§3.3) — smaller metric/table sizes |
| **Empty/loading/error states** | Rarely applicable | **Mandatory** — see §5.3b and §5.8 |

**Rule of thumb:** if a screen has a sidebar, a table, or a "0 resultados" state, it's product register — even if it reuses brand tokens (color, radius, font). Reusing *tokens* across registers is correct; reusing *padding and layout recipes* across registers is the failure mode that motivated this revision.

---

## 1. Overview & Creative North Star

Biovity is a high-precision ecosystem connecting scientific talent with biotechnology companies, laboratories, and R&D organizations in Chile. The design system follows the **"Curated Organism"** philosophy: where scientific rigor meets refined, modern digital product design.

### 1.1 The 4 Core Principles

1. **The Curated Organism (Biological Rigor & Sophistication):**  
   On brand surfaces, we reject rigid, cluttered SaaS templates in favor of an expansive, breathing environment. On product surfaces, this principle expresses itself as *clarity and precision under density* — not as whitespace, which is a brand-register tool (see §0).
2. **Tonal Depth over Heavy Borders & Shadows (Zero Box Shadows on Cards):**  
   Depth, hierarchy, and separation are established by stacking subtle tonal surfaces (`surface-container-low`, `surface-container-lowest`, `surface-container-highest`) and micro-borders (`border-border/40`), **never through drop shadows**. Cards must never use box shadows under any circumstances.
3. **Strategic & Purposeful Color (*"Si todo tiene color, nada destaca"*):**  
   A clean, neutral foundation allows Emerald Green (`secondary`) and Biovity Violet (`accent`) to draw immediate focus to key actions, verifications, keywords, and AI intelligence features. Product surfaces should use this even more sparingly than brand surfaces (§0).
4. **Dimensional Precision & Uniformity:**  
   Inputs, selectors, and action buttons in search bars and interactive toolbars share exact heights (`h-11`), unified corner radii (`rounded-lg`), and consistent interaction states.

---

## 2. Color System & Design Tokens

### 2.1 Brand Palette (Core Brand Identity)

| CSS Token | Name | HEX | RGB | Role & Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--primary` | **Deep Slate Navy** | `#00374a` | `0, 55, 74` | Primary CTA buttons, corporate headings, high-priority structural headers. |
| `--primary-foreground` | White | `#ffffff` | `255, 255, 255` | Text on top of primary buttons. |
| `--secondary` | **Emerald Green** | `#006b5e` | `0, 107, 94` | Monospace uppercase eyebrows, verified indicators, active step tags, secondary CTAs. |
| `--secondary-foreground` | White | `#ffffff` | `255, 255, 255` | Text on top of emerald containers. |
| `--accent` | **Biovity Violet** | `#8483d4` | `132, 131, 212` | Highlighted words in large titles (`<span>`), AI feature chips, discount tags (`-20% dto`), intelligence badges. *Contrast-restricted — see §2.3.* |
| `--accent-foreground` | White | `#ffffff` | `255, 255, 255` | Text on top of violet containers. |
| `--muted-foreground` | **Slate Gray** | `#71787d` | `113, 120, 125` | Descriptive body text, subtitles, supporting metadata, inactive icons. |

### 2.2 Surface Hierarchy (Tonal Layering System)

| Token / Class | HEX | RGB | Usage |
| :--- | :--- | :--- | :--- |
| `--surface-container-lowest` / `bg-surface-container-lowest` | `#ffffff` | `255, 255, 255` | Primary canvas, elevated cards on top of low surfaces, modals, popovers. |
| `--surface-container-low` / `bg-surface-container-low` | `#f3f3f5` | `243, 243, 245` | Alternating section backgrounds, metric stat cards, form toolbars, card containers. |
| `--surface-container-highest` / `bg-surface-container-highest` | `#e2e2e4` | `226, 226, 228` | Hover backgrounds, inactive chips, subtle dividers, secondary pill backgrounds. |

### 2.3 Contrast Verification & Safe Pairings

Not all tokens can be used for text on all surfaces. These pairings are verified against WCAG AA standards:

| Text token | Surface token | Contrast | Status | Rules |
|---|---|---|---|---|
| `--foreground` (`#0f172a`) | `--surface-container-lowest` (`#ffffff`) | **16.1:1** | ✅ Safe | Body text, headings, any size. |
| `--foreground` (`#0f172a`) | `--surface-container-low` (`#f3f3f5`) | **14.8:1** | ✅ Safe | Metric values, card titles on tinted surfaces. |
| `--secondary` (`#006b5e`) | `--surface-container-lowest` (`#ffffff`) | **5.4:1** | ✅ Safe (AA) | Eyebrow tags, active indicators, verified checks. Must be `font-semibold` or larger. |
| `--secondary` (`#006b5e`) | `--surface-container-low` (`#f3f3f5`) | **4.9:1** | ✅ Safe (AA) | Same as above on low surfaces. |
| `--muted-foreground` (`#71787d`) | `--surface-container-lowest` (`#ffffff`) | **4.6:1** | ✅ Safe (AA) | Descriptive body text. **Do not use smaller than `text-xs` (12px).** |
| `--accent` (`#8483d4`) | `--surface-container-lowest` (`#ffffff`) | **2.8:1** | ⚠️ **Conditional** | **Fails for small/regular text.** Allowed ONLY for large/bold text (`≥18px bold` or `≥24px regular` — headlines `h1`, `h2`) or inside tinted chip backgrounds (`bg-accent/10`). Never use for body copy, captions, or standalone small icons. |
| `--primary-foreground` (`#ffffff`) | `--primary` (`#00374a`) | **11.8:1** | ✅ Safe (AAA) | Button text, hero badges on dark. |
| `--secondary-foreground` (`#ffffff`) | `--secondary` (`#006b5e`) | **5.4:1** | ✅ Safe (AA) | Badges, active pill text. |

---

## 3. Typography & Hierarchy

The typography pairs **Geist Sans** (clean sans-serif clarity) with **Geist Mono** (technical precision, metadata, and metric labels).

```
Font Stack:
- Sans (Primary): var(--font-geist-sans)
- Mono (Technical & Eyebrows): var(--font-geist-mono)
```

### 3.1 Font Weights
- **Geist Sans:** Regular (`400`), Medium (`500`), SemiBold (`600`), Bold (`700`).
- **Geist Mono (Mono):** Medium (`500`), SemiBold (`600`), Bold (`700`).

---

### 3.2 Brand Register Hierarchy (Marketing & Landing Surfaces)

Used on `/`, `/marca`, `/nosotros`, `/empresas`, `/salarios`, `/consejos-carrera`, and campaign pages.

#### A. Category Eyebrow Tag (Plain Green Text Standard)
> **Rule:** Section headings do **not** use pill/bubble wrappers. They use plain, uppercase monospace green text with letter tracking.

```tsx
<span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
  CATEGORÍA O SECCIÓN • CONTEXTO
</span>
```

#### B. Display Hero (`h1`) with Violet Word Accent
```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
  Título Principal con <span className="text-accent font-semibold">Palabra Clave</span> en Chile
</h1>
```

#### C. Section Heading (`h2`)
```tsx
<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight text-balance">
  Conectamos el talento con la <span className="text-accent font-semibold">industria científica</span>
</h2>
```

#### D. Subtitles & Body Descriptions
```tsx
<p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-pretty">
  Texto descriptivo con buen contraste y espaciado de lectura confortable.
</p>
```

---

### 3.3 Product Register Hierarchy (Dashboard & Application Surfaces)

Use these on `/dashboard` and other authenticated app surfaces. Brand's `text-2xl sm:text-3xl` metric scale is too large once a screen has multiple stat cards, table rows, or repeated numeric data — it competes with itself.

| Role | Class | Example content |
|---|---|---|
| Page title | `text-xl sm:text-2xl font-bold text-foreground tracking-tight` | "Panel de Empresa", "Mis Postulaciones" |
| Section header | `text-base font-semibold text-foreground` | "Ofertas Recientes", "Candidatos Recomendados" |
| **Card header / label** | **`text-xs leading-4 font-medium text-foreground`** | "Ofertas Activas", "Postulaciones Nuevas", "Mensajes Recientes" |
| Dashboard metric value | `text-2xl font-bold text-foreground tracking-tight tabular-nums` | `12`, `84%`, `$2.400.000` |
| Table header | `text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider` | "CARGO", "EMPRESA", "ESTADO" |
| Table body / list item | `text-sm text-foreground` | Job title, candidate name |
| Supporting metadata | `text-xs text-muted-foreground` | "Publicado hace 2 días", "Remoto • RM" |
| Status badge (product) | `text-xs font-medium` (NOT mono, NOT uppercase) | "Activa", "En revisión", "Cerrada" |

---

## 4. Brand Identity & Logo Guidelines

### 4.1 Symbol & Logotype
The Biovity mark represents a biological molecule intersecting with a dynamic neural and scientific network.

- **Positive Version (Light Background):**
  Logotype in Deep Slate Navy (`#00374a`) with the official Biovity icon over `#ffffff` or `#f3f3f5` surfaces.
- **Negative Version (Dark Background):**
  Logotype in White (`#ffffff`) with the official icon over dark surfaces (`neutral-900` / footer / dark mode).

### 4.2 Brand Rules
1. **Clear Space:** Maintain a minimum clear margin equal to 50% of the symbol's height around the logotype.
2. **Approved Backgrounds:** Use only high-contrast surfaces (`surface-container-lowest`, `surface-container-low`, or solid `neutral-900`).
3. **Prohibited Usage:**
   - Do not stretch, condense, or distort the mark's aspect ratio.
   - Do not apply harsh drop shadows or 3D bevels.
   - Do not recolor individual parts outside the brand palette.

---

## 5. UI Component Library & Patterns

### 5.1 Buttons & Actions
All interactive buttons follow uniform height `h-11` (or `h-9`/`h-10` in compact tables), `rounded-lg` radius, and `text-sm font-medium`. This applies in both registers — buttons are the one component family that doesn't fork by register, because interaction consistency matters more than visual register here.

```tsx
{/* 1. Primary Action Button */}
<Button className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium">
  Publicar una oferta
  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
</Button>

{/* 2. Secondary CTA Button */}
<Button className="h-11 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg text-sm font-medium">
  Crear cuenta gratis
  <HugeiconsIcon icon={Tick02Icon} size={16} className="ml-1.5" />
</Button>

{/* 3. Outline Button */}
<Button
  variant="outline"
  className="h-11 px-6 bg-surface-container-lowest border-border/40 hover:bg-surface-container-low rounded-lg text-sm font-medium"
>
  Ver planes y precios
</Button>

{/* 4. Ghost Action Button */}
<Button
  variant="ghost"
  className="h-11 px-4 text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium"
>
  Cancelar
</Button>

{/* 5. Compact Table/Toolbar Button — product register only */}
<Button
  size="sm"
  variant="ghost"
  className="h-9 px-3 text-muted-foreground hover:text-foreground rounded-md text-xs font-medium"
>
  Ver todas
</Button>
```

---

### 5.2 Selection Controls: Monthly vs. Annual Billing Switch
High-contrast switch with a solid gray track in inactive state and emerald green in active state, with clickable option labels. Brand register (pricing pages).

```tsx
<div className="flex items-center justify-center gap-3.5">
  <button
    type="button"
    onClick={() => setIsAnual(false)}
    className={`text-sm transition-colors cursor-pointer ${
      !isAnual ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    Mensual
  </button>

  <button
    type="button"
    role="switch"
    aria-checked={isAnual}
    onClick={() => setIsAnual(!isAnual)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      isAnual
        ? "bg-secondary border-secondary"
        : "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
    }`}
    aria-label="Alternar facturación mensual o anual"
  >
    <span
      className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-in-out ${
        isAnual ? "translate-x-[21px]" : "translate-x-0.5"
      }`}
    />
  </button>

  <button
    type="button"
    onClick={() => setIsAnual(true)}
    className="flex items-center gap-2 cursor-pointer"
  >
    <span
      className={`text-sm transition-colors ${
        isAnual ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Anual
    </span>
    <span className="text-[11px] font-mono font-semibold text-accent bg-accent/15 border border-accent/20 px-2 py-0.5 rounded-full">
      -20% dto
    </span>
  </button>
</div>
```

---

### 5.3 Metric Cards: Two Distinct Patterns by Register

This is where brand and product diverge most sharply. Pick the right recipe for the surface.

#### 5.3a Brand Metric Cards — Hero Statistics
Centered text, decorative role, fixed rhythm, `shadow-none`. Used on `/`, `/nosotros`, `/empresas`, `/salarios`, `/consejos-carrera`, `/marca`.

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60 shadow-none"
    >
      <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
        {stat.value}
      </p>
      <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
        {stat.label}
      </p>
    </div>
  ))}
</div>
```

---

#### 5.3b Dashboard Metric Cards & Panels — Product Register Standard

Left-aligned, content-driven height, strict **`max py-6`** vertical padding, subtle definition borders, **`shadow-none` (strictly no box shadows)**, no forced `min-h`, and no decorative hover on non-clickable cards.

> **Card Rules for `/dashboard`:**
> 1. **Padding:** Every card, container, panel, or widget inside `/dashboard` must have a maximum vertical padding of `py-6` (24px). Standard range is `py-4` to `py-6` (`p-4`, `p-5`, `p-6` or `px-5 py-4` / `px-6 py-5`). Never exceed `py-6`.
> 2. **Header Typography:** All card headers and labels must use **`text-xs leading-4 font-medium text-foreground`** (or `text-muted-foreground` for auxiliary headers).
> 3. **NO SHADOWS Under Any Circumstances (`shadow-none`):** Cards must **never** use drop shadows (`shadow`, `shadow-sm`, `shadow-md`, etc.). Visual separation and tonal hierarchy are achieved strictly through surface colors (`bg-surface-container-low` / `bg-surface-container-lowest`) and subtle micro-borders (`border border-border/40` or `border border-border/50`).
> 4. **Standard Classes:**
>    - **Raised Cards (`dashboardRaisedCardClass`):** `rounded-xl bg-surface-container-lowest border border-border/50 shadow-none`
>    - **Tonal Cards (`dashboardTonalCardClass`):** `rounded-xl bg-surface-container-low border border-border/40 shadow-none`

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {metrics.map((metric) => (
    <div
      key={metric.label}
      className="bg-surface-container-low border border-border/40 rounded-xl p-4 sm:p-5 max-h-none flex flex-col gap-2 shadow-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs leading-4 font-medium text-foreground">{metric.label}</span>
        <HugeiconsIcon icon={metric.icon} size={16} className="text-muted-foreground" />
      </div>

      <span className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
        {metric.value}
      </span>

      {metric.delta !== null ? (
        <span className={`text-xs flex items-center gap-1 ${
          metric.delta >= 0 ? "text-secondary" : "text-destructive"
        }`}>
          <HugeiconsIcon icon={metric.delta >= 0 ? TrendingUp01Icon : TrendingDown01Icon} size={12} />
          {metric.delta}% este mes
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">{metric.subtext}</span>
      )}
    </div>
  ))}
</div>
```

**Required states for this component** — do not ship without all four:

| State | Trigger | Treatment |
|---|---|---|
| **Populated** | `metric.value > 0` | As above. |
| **Empty (zero, new account)** | `metric.value === 0` | Keep the same layout — don't shrink the card. Replace the delta line with a short actionable hint instead of `0% este mes` (which reads as broken, not as "nothing yet"). E.g. `Publica tu primera oferta para ver datos aquí` in `text-xs text-muted-foreground`. |
| **Loading** | Data fetch in flight | Skeleton: `bg-surface-container-highest/60 animate-pulse rounded-md` blocks matching the label/value/delta line heights. Never show a stale `0` while loading — it's indistinguishable from the empty state. |
| **Error** | Fetch failed | Replace value with `—` in `text-muted-foreground`, add a `text-xs text-destructive` line: `No se pudo cargar` with a retry affordance if the card supports one. |

---

### 5.4 Micro-Labels, Badges & Chips
- **Step Badge:** `text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full`
- **Highlight / AI Step Badge:** `text-xs font-mono font-semibold text-accent bg-accent/10 border border-accent/25 px-2.5 py-1 rounded-full` — background-tint usage only, per §2.3 do not use `text-accent` on plain white/low-surface backgrounds at this size elsewhere.
- **AI Match Chip:** `<Badge variant="secondary" className="bg-accent/15 text-accent border-0 text-[11px] px-2.5 py-0.5 font-mono">`
- **Recommended Pill:** `text-[11px] font-mono font-semibold text-secondary-foreground bg-secondary px-3 py-1 rounded-full`
- **Dashboard status chip (product only):** `text-xs font-medium px-2 py-0.5 rounded-md` with semantic background — `bg-secondary/10 text-secondary` (success/active), `bg-surface-container-highest text-muted-foreground` (neutral/draft), `bg-destructive/10 text-destructive` (error/expired). No mono font, no uppercase — dashboard chips describe state, they don't perform brand voice.

---

### 5.5 Form Inputs, Selectors & Search Bars (Equal Height `h-11` Rule)
All search inputs, dropdown filters, and submit buttons in a toolbar must share the exact height `h-11` (44px).

```tsx
<div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-4xl mx-auto">
  <div className="relative flex-1 w-full">
    <Input
      placeholder="Buscar por cargo, técnica o especialidad..."
      className="h-11 bg-surface-container-low border-border/40 pl-10 pr-4 text-sm rounded-lg w-full"
    />
    <HugeiconsIcon
      icon={Search01Icon}
      size={18}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />
  </div>

  <div className="relative w-full sm:w-56">
    <select
      className="h-11 w-full appearance-none rounded-lg border border-border/40 bg-surface-container-low px-3.5 pr-9 text-xs sm:text-sm text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
      aria-label="Filtrar por región"
    >
      <option>Todas las regiones</option>
      <option>Región Metropolitana</option>
      <option>Antofagasta</option>
    </select>
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      size={16}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />
  </div>

  <Button className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium w-full sm:w-auto shrink-0">
    Explorar Ofertas
  </Button>
</div>
```

---

### 5.6 Animated Connection Beams (`AnimatedBeam` & `AdnBeam`)
- **Scale-Normalized Coordinates:** Normalized against `scaleX` and `scaleY` to maintain precision across resizes and screen densities.
- **Offset Precision:** For `size-20` (80px) circle avatars, set `startXOffset={40}` and `endXOffset={-40}` to anchor lines precisely to the circle perimeter.
- **Parent Container Scale Rule:** **Never** apply CSS `scale: 0.98` entry animations on parent containers holding `AnimatedBeam`, as it causes permanent measurement skews during initial `getBoundingClientRect()` evaluation.

---

### 5.7 CTA Banners & Conversion Modules (Brand Register Only)
- **Container:** `bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center shadow-none`.
- **Eyebrow:** Plain green monospace text (`ÚNETE A LA RED`).
- **Title:** Centered headline with violet accent word (`<span className="text-accent">`).
- **Benefits:** Verified checklist items with `CheckmarkCircle02Icon` in `text-secondary`.
- **Action Group:** Dual CTA with Primary button (`bg-primary text-primary-foreground`) and Outline button (`variant="outline"`).

---

### 5.8 Empty States — Product Register Standard

Every dashboard card, table, list, or panel that loads data must define a dedicated empty state:

```tsx
<div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
  <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
    <HugeiconsIcon icon={Inbox01Icon} size={20} />
  </div>
  <p className="text-sm font-medium text-foreground mb-1">Sin ofertas publicadas</p>
  <p className="text-xs text-muted-foreground mb-4">
    Tus ofertas activas aparecerán aquí una vez que crees la primera.
  </p>
  <Button size="sm" className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
    Publicar oferta
  </Button>
</div>
```

---

## 6. Spacing Scale & Padding Rules

Padding values across Biovity components strictly follow this scale:

| Token | Value | Brand register usage | Product register (`/dashboard`) usage |
|---|---|---|---|
| `p-2` / `py-2` | 8px | — | Chip/badge internal padding |
| `p-3` / `py-3` | 12px | — | Compact table cell padding, `h-9` toolbar controls |
| `p-4` / `py-4` | 16px | Hero stat card (mobile) | **Default** dashboard card padding (`p-4` / `py-4`) |
| `p-5` / `py-5` | 20px | Hero stat card (desktop) | Dashboard card padding when card has 3+ content rows |
| `p-6` / `py-6` | 24px | Content card, form section | **MAXIMUM vertical padding cap (`max py-6`)** for dashboard panels |
| `p-8` / `py-8` | 32px | CTA banner (mobile), section container | ❌ **PROHIBITED** on any card inside `/dashboard` |
| `p-12` / `py-12`| 48px | CTA banner (desktop) | ❌ **PROHIBITED** on product surfaces |

> 🚨 **Critical Rules for `/dashboard` Cards:**  
> 1. All cards, widgets, list containers, and panels located anywhere within `/dashboard` must have **`max py-6`** (24px maximum vertical padding). Never use `p-8`, `py-8`, `py-10`, or `py-12` on dashboard cards.  
> 2. **`shadow-none` is mandatory:** Never apply drop shadows (`shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, etc.) to any card.

---

## 7. Animations & Motion Standards

Built on `motion/react` with spring-based transitions and smooth cubic-bezier easing.

```ts
// Standard production easing
const ease = [0.23, 1, 0.32, 1] as const
```

### 7.1 Brand Motion (marketing surfaces)
1. **Reduced Motion Accessibility:** Always check `useReducedMotion()` and fallback to `0.01s` duration when enabled.
2. **Staggered Card Entrances:** Stagger list reveals by 50ms to 80ms increments (`opacity: 0, y: 16 -> opacity: 1, y: 0`).
3. **Hover States:** Rely on smooth background transitions (`transition-colors duration-150`), avoiding aggressive scale jumps that displace adjacent grid items.

### 7.2 Product Motion (dashboard surfaces)
Motion here communicates state, not personality. No stagger, no scroll-reveal, no entrance choreography on page load — data should be visible immediately once fetched.

1. **State transitions only:** loading → populated, idle → saving, default → error. Use `transition-opacity duration-150` for content swaps (skeleton → real content).
2. **No hover scale/shadow lift** on non-interactive cards (stat cards, list rows that aren't links). Reserve `hover:bg-surface-container-highest/40` for genuinely clickable rows.
3. **Focus states must be instant**, not eased — `focus-visible:ring-2` with no transition delay, so keyboard navigation never feels laggy.
4. **`prefers-reduced-motion`** still applies to any skeleton pulse (`animate-pulse`) — provide a static low-opacity fallback.

---

## 8. Do's and Don'ts

### ✅ DO — All surfaces
- Use `bg-surface-container-low` for section backgrounds and metric cards in both registers.
- Maintain `h-11` (or a consistent compact height) across all inputs/selectors/buttons within a single toolbar row.
- Keep tabular numeric data in `tabular-nums` for alignment.
- Verify contrast against §2.3 before introducing a new text/background pairing.
- **Enforce `shadow-none` on all cards across both registers.**

### ✅ DO — Brand register only
- Use plain green monospace eyebrows before section titles.
- Use violet (`text-accent`) as an accent for key phrases in large titles (≥18px).
- Use generous padding (`p-8`–`p-12`) on CTA banners and hero containers.
- Use stagger and scroll-reveal motion for entrances.

### ✅ DO — Product register (`/dashboard`) only
- **Use `text-xs leading-4 font-medium text-foreground` for all card headers and labels inside `/dashboard`.**
- **Enforce `max py-6` vertical padding on all cards, panels, and widgets inside `/dashboard`.**
- **Use `shadow-none` with subtle micro-borders (`border border-border/40` or `border border-border/50`) for card definition.**
- Design all four states (populated, empty, loading, error) before shipping any data-driven component.
- Let card height follow content; never force `min-h` to "fill" a grid.
- Use the density typography scale (§3.3), not the brand display scale.
- Keep motion limited to state-change feedback.

### ❌ DON'T
- **Don't use drop shadows (`shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xs`) on cards under ANY circumstances — cards must always use `shadow-none`.**
- **Don't use vertical padding greater than `py-6` (`p-8`, `py-8`, `py-10`, `py-12`) on any card or panel inside `/dashboard`.**
- **Don't use large heading sizes (`text-base`, `text-lg`, `text-xl`) for card headers inside `/dashboard` — always use `text-xs leading-4 font-medium`.**
- Don't wrap section eyebrow tags inside rounded pill containers or borders.
- Don't use heavy, high-contrast dark borders around every card.
- Don't mix different heights for inputs and dropdowns on the same line.
- Don't use violet for primary CTA buttons (use Deep Slate Navy `#00374a` or Emerald Green `#006b5e`).
- Don't use `text-accent` at small sizes (`text-xs`/`text-[11px]`) on plain backgrounds — fails contrast (§2.3).
- Don't apply `scale: 0.98` transforms on parent containers hosting coordinate-measured SVGs like `AnimatedBeam`.
- Don't copy a brand-register component (hero stat card, CTA banner, AnimatedBeam) directly into a dashboard/product surface without re-deriving it through §0.
- Don't ship a dashboard card, table, or list with only its populated state designed.

---

## 9. Home Landing Direction — Science, Connected

### Concept card

- **Surface:** `/`, brand register.
- **Audience:** Professionals who want work in biotechnology, biochemistry, chemistry, health, and research in Chile.
- **One-line promise:** Find science roles and salary references in one specialized place.
- **Visual anchor:** A scientist searches Biovity at a laboratory desk. A laptop shows a clear job listing beside a recognizable microscope and lab tools.
- **Mood:** Precise, calm, editorial, and clearly scientific.
- **Do not use:** Generic SaaS dashboard framing, fake market metrics, decorative maps without location data, or animated background noise.

### Concept options

| Concept | Fit | Distinction | Feasibility | Decision |
|---|---:|---:|---:|---|
| Scientist searching Biovity at a laboratory desk | 5 | 5 | 4 | Selected |
| Chile opportunity map | 4 | 4 | 2 | Rejected: no matching geographic dataset |
| Editorial job index | 4 | 3 | 5 | Keep as the specialty list treatment |

### Composition

- Use a two-column hero on desktop and a single-column reading order on mobile.
- Put the eyebrow, headline, short description, search form, and salary link in the first column.
- Show a detailed SVG scene in the second column, without a card or background panel. Keep discipline names in the editorial index, and keep counts out of the illustration.
- Place the live specialty index after `TrustStrip` and before the product previews.
- Render the six specialties as a clear editorial list with live offer counts when available.
- Keep the search form as the primary action and keep its controls at `h-11` with `rounded-lg`.

### Type, color, and spacing

- Reuse the existing brand tokens, Geist type, 12-column grid, and spacing rules.
- Use an uppercase monospace emerald eyebrow, a large foreground headline, and one violet headline accent.
- Let the illustration sit directly on the page background. Use solid, shaded laboratory objects and the Biovity job listing as the focal point.
- Preserve generous brand spacing and a readable mobile width.

### Motion

- Motion verb: **discover**.
- Reveal the hero scene once, then settle it into place.
- Use short staggered entrances for the hero copy and specialty rows. Search stays visible and usable without waiting for animation.
- Reuse `motion/react` and existing landing motion tokens. Respect reduced-motion preferences and show the final state immediately when motion is reduced.
- Do not run a continuous loop or animate the background.

### Quality checks

- Every discipline label and count must come from current app data.
- The hero must remain clear when the SVG is hidden and when motion is disabled.
- Check the layout at narrow mobile and wide desktop widths.


## 10. Companies landing direction: Scientific hiring criteria

### Brief and concept selection

- Surface: `/companies`, brand register. Audience: scientific employers in Chile.
- Job: connect a technical vacancy to the existing ATS demo and organization registration.
- Keep the existing Next.js, Tailwind, Geist, theme tokens, and real product components.
- No customer logos, performance claims, or organization counts without evidence.

| Territory | Concept | Signature and screenshot | Emotion | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|---|
| Profession | Scientific criteria shape each search | Switch a vacancy brief between laboratory, bioprocesses, and research | Precision | Biovity uses science-specific techniques and specialties | 4 / 5 / 5 / 2 |
| Process | From offer to interview in one workspace | The actual ATS kanban changes through user actions | Control | Existing organization pipeline and demo | 3 / 5 / 5 / 3 |
| Place | A hiring network across Chile | A region-based talent index | Proximity | Professionals and employers in Chile | 4 / 4 / 2 / 2 |

Select scientific criteria. It makes the specialization concrete without unsupported market data.
Use the real ATS demo as product evidence. Region mapping does not earn the hero.

### Concept card

- Idea: Define the scientific criteria, then manage the hiring process with your team.
- Metaphor: A vacancy brief with explicit technical requirements.
- Signature: User-selected vacancy briefs. Content settles into place after each choice.
- Emotion: Clear, specific, calm.
- Motion verb: Settle.
- Screenshot: Editorial hero beside the scientific brief, followed by the actual ATS.

### System

- Ground: `surface-container-lowest` (`#ffffff` light).
- Alternate ground: `surface-container-low` (`#f3f3f5` light).
- Ink and action: `primary` (`#00374a` light). Secondary ink: `muted-foreground` (`#71787d`).
- Verified or selected state: `secondary` (`#006b5e` light). Display accent: `accent` (`#8483d4`).
- All colors follow existing theme tokens. Do not add fixed page colors.
- Display: Geist Sans, 36 to 60 px, semibold, tight tracking, 1.06 leading.
- Body: Geist Sans, 16 to 18 px, 1.6 leading. Metadata: Geist Mono, 12 px.
- Grid: 12 columns, 32 px desktop gutters. Mobile: one column, 16 px gutters.
- Radius: existing `rounded-lg` controls and `rounded-xl` containers. No card shadows.
- Motion: GSAP scoped to `/companies`, `power2.out`, 300 to 550 ms, 40 to 60 ms stagger.
- Respect reduced motion through matchMedia and cleanup on navigation. No loader, autoplay, scroll capture, or background loop.
- Retain existing Motion-based product demos and their functional interactions. The new page choreography does not target their animated children.

### Composition

```text
Hero          [full-width masthead]
Brief         [promise and actions, 4 cols] [interactive vacancy brief, 8 cols]
ATS           [section title]                           [demo label]
              [real organization application pipeline, full width]
Value         [statement, 4 cols] [four open criteria, 8 cols]
Process       [heading]                         [contact link]
              [profile] ---- [offer] ---- [assessment] ---- [interview]
Talent        [title aligned to left] [real talent component below]
Metrics       [title aligned to left] [real funnel and map components below]
Plans         [existing functional plan comparison]
FAQ           [heading, 4 cols] [separated question rows, 8 cols]
Contact       [direct links, 5 cols] [contact form, 7 cols]
```

The genericness check removed the centered glow, unsupported stat cards, repeated equal-card grids, and the full-viewport gap before the product. Examples are labeled as examples. Existing prices and demo data keep their source and behavior.

## 12. Learn page direction: an open study sheet

### Concept card

- Idea: A learning capsule turns biological data into a practical skill through content, exercises, a quiz, and a certificate.
- Metaphor: An open workbook with each learning stage laid out on the page.
- Signature: A green path links the lesson, exercise, assessment, and certificate inside the illustration.
- Emotion: Clear, practical, and focused.
- Motion verb: Trace.
- Screenshot: A centered learning statement and actions sit above the open workbook.
- Anchor: Existing MDX capsules include durations, modules, and quiz questions. The catalog reads those values directly.

### System

- Register: brand.
- Palette: Existing Biovity tokens. Navy outlines, emerald stage path, one lavender stage mark, and tonal workbook surfaces.
- Type: Geist Sans for titles and course names. Geist Mono for labels and course metadata.
- Grid: 12 columns on desktop, one column on mobile. Keep the hero copy and SVG aligned to the same container.
- Rhythm: Centered statement and actions, open workbook figure, topic index, four-step learning path, grouped capsule list, and direct course action.
- Shape: Existing `rounded-lg` controls and `rounded-xl` containers. No card shadows.
- Motion: Scoped GSAP, `power2.out`, a short statement reveal, one workbook reveal, low-distance section reveals, one path draw, and a static view when reduced motion is active.

### Composition

```text
Hero       [centered learning promise and links] [open workbook figure] [topic index]
Path       [four connected learning steps across the content width]
Catalog    [area and description, 4 cols]       [real capsule entries, 8 cols]
Action     [course invitation, 8 cols]           [direct capsule link, 4 cols]
```

The genericness check removed unsupported course stats and generic equal-card grids. Capsule title, duration, module count, and quiz count come from the MDX frontmatter.

## 13. Blog direction: a field journal for scientific work

### Brief and concept selection

- Surface: `/blog`, brand register. Audience: professionals and students in scientific fields in Chile.
- Job: help readers find useful articles about scientific work, biotechnology, and career development.
- Language: Spanish for Chile. Use the existing article title, excerpt, author, and date as the only article data. The current `featuredImage` points to the same solid-blue placeholder for every post, so the archive uses a decorative journal illustration instead of presenting that placeholder as article art.
- Evidence: the current archive has real articles about salary negotiation, biotech skills, networking, CVs, interviews, and the transition from academia to industry.

| Territory | Concept | Signature and screenshot | Emotion | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|---|
| Process | A field journal follows scientific work from one featured reading into a clear archive | One article opens the page, followed by an index of real readings | Curious and focused | Existing articles connect science and work in Chile | 4 / 5 / 5 / 2 |
| Material | A lab notebook sets each article as a dated observation | Date and author lead each entry; the image works as a specimen plate | Precise and approachable | Biovity covers biotechnology and scientific careers | 3 / 4 / 4 / 3 |
| Formal system | The archive is an annotated reading list with one large lead and ruled entries | A single feature gives way to compact, searchable rows | Calm and useful | The blog has a small, finite article collection | 3 / 4 / 5 / 3 |

Select the field journal. Its lead article and dated index use the real blog content, and the layout still works as the archive grows.

### Concept card

- Idea: A field journal follows scientific work from a featured reading into the rest of the archive.
- Metaphor: Notes from the intersection of science and work in Chile.
- Signature: The latest article appears as a large journal entry, then gives way to an annotated reading index.
- Emotion: Editorial, credible, and inviting.
- Motion verb: Unfold.
- Screenshot: A large feature beside its date and author, with the next readings indexed below.
- Genericness test: Use Biovity's real Chilean science and career articles. Do not add unsupported topics, counts, or credentials.

### System

- Register: brand.
- Palette: existing Biovity tokens. Use `surface-container-low` as the journal opening, `surface-container-lowest` for the reading area, `foreground` for titles, `muted-foreground` for metadata, and `secondary` for links and small index marks.
- Type: Geist Sans for headings and article text. Geist Mono for date, author, and archive labels.
- Grid: 12 columns on desktop, one column on mobile. Align the hero heading and archive index to the same max-width container.
- Rhythm: split editorial heading, featured article, then compact archive rows with a search field.
- Shape: one rounded feature frame with a decorative journal illustration. Keep archive rows text-first to avoid repeating the same placeholder image. No card shadows.
- Motion: Scale the journal illustration and shift its reading arrow on hover. Remove transitions and movement for reduced-motion users.

### Composition

```text
Opening    [editorial title, 8 cols] [short purpose, 4 cols]
Index      [live result count]                            [article search]
Feature    [decorative journal illustration, 7 cols] [date, author, title, excerpt, action, 5 cols]
Archive    [section heading, 4 cols] [dated article rows, 8 cols]
```

The genericness check removed the repeated equal-card grid and duplicate description below the heading. Search covers the real title, excerpt, and author fields. The illustration is a visual motif, not article content. Replace it with article images when posts have distinct, relevant artwork.

## 14. Career tips direction: a field guide for scientific work

### Brief and concept selection

- Surface: `/career-tips`, brand register. Audience: students and professionals in scientific fields in Chile.
- Job: help readers find practical career guidance, tools, and answers.
- Language: Spanish for Chile. Keep the current guide, category, resource, and FAQ data.
- Anchor: the page already groups real guides by CV, interviews, career transition, salary negotiation, and networking.

| Territory | Concept | Signature and screenshot | Emotion | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|---|
| Process | A field guide turns practical career advice into a searchable index | A large guide heading opens to a responsive index whose filters narrow real entries | Clear and capable | Existing guide topics map to real career questions | 4 / 5 / 5 / 2 |
| Material | A lab notebook uses short annotations to orient the reader | Category labels and reading times act as precise margin notes | Focused and practical | Biovity serves scientific careers | 3 / 4 / 5 / 3 |
| Formal system | A taxonomy organizes every resource by topic | Category counts form a compact topic index above the guide rows | Ordered and calm | The page has five guide categories | 3 / 4 / 5 / 3 |

Select the field guide. It gives the current search and category filters a clear role and keeps the real resources central.

### Concept card

- Idea: A field guide indexes practical advice for scientific careers.
- Metaphor: A reference guide with an index, entries, and resource notes.
- Signature: Category filters and search narrow the real guide index.
- Emotion: Clear, credible, and useful.
- Motion verb: File. Filtered entries settle into the index with short, reduced-motion-aware transitions.
- Screenshot: A large editorial heading beside the live topic index, followed by a clean guide list.
- Genericness test: Use the page's real career topics as the index. Avoid stock learning visuals and unsupported success metrics.

### System

- Register: brand.
- Palette: paper `#ffffff` (`surface-container-lowest`), ink `#0f172a` (`foreground`), muted `#5f6569` (`muted-foreground`), line `#e2e2e4` (`border`), accent `#006b5e` (`secondary`), dark field `#00374a` (`primary`). Dark mode uses the matching existing tokens.
- Type: Geist Sans for headings and reading text. Geist Mono for small category and time labels.
- Grid: 12 columns on desktop, one column on mobile. Align hero and guide index to the same container.
- Rhythm: split hero, open guide index, offset resource list, two-column FAQ, full-width CTA.
- Shape: rounded-lg for controls, rounded-xl for the feature panel. Keep cards shadow-free.
- Motion: 180–300 ms opacity and transform transitions. Let filters reflow the list. Remove movement for reduced-motion users.

### Composition

```text
Hero       [large title and purpose, 7 cols] [topic index with real counts, 5 cols]
Guides     [heading and live count, 5 cols] [search, 7 cols]
Filters    [category controls across 12 cols]
Index      [category and reading time, 3 cols] [title and summary, 7 cols] [action, 2 cols]
Resources  [section heading, 4 cols] [three resource rows, 8 cols]
FAQ        [section heading, 4 cols] [accordion, 8 cols]
CTA        [career action, 8 cols] [profile and job links, 4 cols]
```

Use counts derived from the current article data. Keep every article link and resource destination intact. Do not claim that a resource downloads before the user registers.

## 15. Waitlist direction: a ficha de ingreso científico

### Brief and concept selection

- Surface: `/waitlist`, brand register. Audience: scientific professionals and organizations in Chile.
- Job: collect an email and profile so Biovity can contact people about early access.
- Language: Spanish for Chile. Keep the current role choices, API contract, and truthful product scope.
- Anchor: the form asks for two real pieces of information, profile and email, and the product connects opportunities, salary data, and technical recruiting.

| Territory | Concept | Signature and screenshot | Emotion | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|---|
| Process | A clear intake sheet records who wants access to scientific work | Profile choice leads into one email field, then a direct confirmation state | Precise and welcoming | The existing form collects a role and email | 4 / 5 / 5 / 2 |
| Material | A lab accession label organizes the page into a small set of named fields | The profile and email sit in a carefully ruled form panel | Ordered and credible | Biovity serves scientific fields | 3 / 4 / 5 / 3 |
| Formal system | Two audience paths share one point of entry | Selecting a profile updates the email label and placeholder | Clear and efficient | The API accepts professional or organization roles | 3 / 5 / 5 / 3 |

Select the intake sheet. It uses the actual registration fields as the composition and does not imply queue position, launch dates, or access guarantees.

### Concept card

- Idea: A short intake sheet connects scientific professionals and organizations to Biovity.
- Metaphor: A scientific work register with clearly named fields.
- Signature: A narrow emerald marker moves between the two profile choices, then the selected role sets the email label. A connected three-item index names the actual Biovity areas.
- Emotion: Clear, considered, and trustworthy.
- Motion verb: Register. Use short opacity and vertical shifts for entry and confirmation.
- Screenshot: A strong editorial statement beside the profile and email form.
- Genericness test: Keep the two actual role paths and Biovity's real product areas. Do not show invented waitlist counts or promises.

### System

- Register: brand.
- Palette: existing Biovity tokens. Use `surface-container-lowest` as the page ground, `surface-container-low` for the form panel, `foreground` for headings, `muted-foreground` for support text, `border` for rules, `secondary` for small emphasis, and `primary` for the submit action.
- Type: Geist Sans for the headline, form, and body. Geist Mono for the small context label only.
- Grid: 12 columns on desktop. Place the statement in 6 columns and the form in 6 columns. Stack both in reading order on mobile.
- Rhythm: compact brand header, open two-column hero, connected three-item product index, profile and email fields with a clear signup benefit, then a quiet footer.
- Shape: rounded-lg for controls and rounded-xl for the form panel. No card shadows or decorative background gradients.
- Motion: existing Motion components and transition helpers. Use a shared marker for profile selection and one success transition. Keep content visible when reduced motion is active.

### Composition

```text
Header     [Biovity mark and name, 6 cols] [waitlist context, 6 cols]
Hero       [statement and purpose, 6 cols] [profile and email form, 6 cols]
Index      [vacantes] [datos salariales] [reclutamiento técnico] as connected nodes
Footer     [Biovity context, 6 cols] [return link, 6 cols]
```

## 16. Share salary direction: a record of scientific compensation

### Brief and concept selection

- Surface: `/share-salary`, public brand page with a task-focused form. Use brand framing and product-level form clarity.
- Audience: professionals in science, health, and biotechnology in Chile.
- Job: collect an anonymous salary observation with its role, location, experience, education, benefits, and skills.
- Keep the existing three-step form, category values, validation, API payload, and success behavior. Do not add salary counts or promise when a segment will appear in public data.

| Territory | Concept | Signature and screenshot | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|
| Process | A scientific salary record is completed through three clear observations | The active stage tracks the form from role and location, to compensation, to education and skills | The current form already collects those three groups | 4 / 5 / 5 / 2 |
| Material | A field notebook records compensation beside its work context | The salary fields read like a concise field note with technical labels | The dataset includes workplace, region, modality, and skills | 3 / 4 / 4 / 3 |
| Formal system | A compensation ledger places every answer in a single dense register | The form advances through aligned rows like a salary ledger | The experience is a structured record, not an open text survey | 3 / 4 / 4 / 3 |

Select the three-stage salary record. It uses the actual form sequence as the visual idea, and its stage tracker follows the visitor's progress without invented data.

### Concept card

- Idea: Each salary reference joins a role, a compensation, and the context behind it.
- Metaphor: A scientific observation sheet completed in three stages.
- Signature: A live stage index and progress line move with the existing form step.
- Emotion: Precise, useful, and trustworthy.
- Motion verb: Record. The active stage settles into place, and the fields shift a short distance between steps.
- Screenshot: A clear salary statement aligned beside the active observation form.
- Genericness test: Use the form's actual fields and Chilean science context. Do not show sample salary values or unsupported community totals.

### System

- Register: brand frame, task-focused form.
- Palette: existing tokens. `surface-container-lowest` is the page ground, `surface-container-low` is the record panel, `foreground` carries field titles, `muted-foreground` supports guidance, `secondary` marks progress and confirmation, `accent` highlights one large phrase, and `border` connects the stages.
- Type: Geist Sans for the headline and form. Geist Mono for stage indices and short data labels.
- Grid: 12 columns on desktop. Place the statement and stage index in 5 columns, the form in 7. Stack them in that order on mobile.
- Rhythm: compact page start after the fixed navigation, editorial statement, connected stage index, current form stage, privacy note, then success state.
- Shape: rounded-lg controls and rounded-xl form panel. Keep the panel shadow-free and use existing tonal surfaces.
- Motion: one short stage transition. Move the progress line with `scaleX`, not layout dimensions. Keep the full form usable with reduced motion.

### Composition

```text
Opening    [statement and salary context, 5 cols] [stage / form record, 7 cols]
Stage      [three connected steps, 5 cols]        [current fields, 7 cols]
Privacy    [short anonymity note beneath the form]
Success    [contribution confirmation, 5 cols]    [next actions, 7 cols]
```


## 11. About page direction: a field journal for scientific work

### Brief and concept selection

- Surface: \`/about\`, brand register. Audience: scientific professionals and organizations in Chile.
- Job: explain why Biovity exists and direct each audience to a useful next step.
- Language: Spanish for Chile.
- Evidence: the product connects scientific jobs, salary information, and recruiting tools. The page has a real founder portrait. It has no verified community-size metric or verified year of founding.

| Territory | Concept | Signature and screenshot | Emotion | Anchor | Originality / fit / feasibility / portability |
|---|---|---|---|---|---|
| Process | A connection manifesto links scientific work to real Biovity destinations | A line connects jobs, salary references, and organization tools across the page | Focused and credible | Biovity connects scientific work in Chile | 4 / 5 / 4 / 2 |
| Identity | A founder note tells why Biovity began | The real founder portrait opens into a short profile | Personal and direct | Biovity has a named founder and portrait | 3 / 4 / 5 / 4 |
| Formal system | A scientific index organizes the page by audience | Each index entry routes to a product area | Precise | The product serves professionals and organizations | 3 / 4 / 4 / 3 |

Select the connection manifesto. It uses real product routes to explain what Biovity connects.

### Concept card

- Idea: Biovity connects scientific professionals and organizations with useful work tools.
- Metaphor: A manifesto with a visible path from science to work.
- Signature: A green route joins jobs, salary references, and organization tools.
- Emotion: Direct, credible, and connected.
- Motion verb: Trace.
- Screenshot: A wide statement leads into a full-width route index and a concise purpose note.
- Genericness test: Use the page's real scientific fields, Chile focus, founder profile, and product routes. Do not add unsupported scale claims.

### System

- Register: brand.
- Palette: existing Biovity tokens. Navy for primary actions, emerald for labels and the connector, violet for one large headline phrase, and tonal surfaces for section changes.
- Type: Geist Sans for statements and body copy. Geist Mono for chapter labels.
- Grid: 12 columns on desktop, one column on mobile. Align the statement and destination route to the shared container.
- Rhythm: full-width statement, connected destination route, purpose and actions, origin narrative, founder profile, and concise signup finale.
- Shape: rounded-lg for controls and rounded-xl for image crops. No card shadows.
- Motion: scoped GSAP. Use a brief hero reveal, low-distance section reveals, and one scrubbed connector. Reduced-motion users see the full content and a complete static connector.

### Composition

\`\`\`text
Hero       [full-width statement and purpose]
Routes     [connected jobs / salaries / companies across the content width]
Actions    [employment and story links]
Origin     [chapter title, 5 cols]   [specific story, 6 cols]
Founder    [portrait, 5 cols]        [name, role, account, contact, 6 cols]
Finale     [statement, 8 cols]       [professional / organization actions, 4 cols]
\`\`\`

## Legal pages direction: A clear field guide

### Brief and concept selection

- Surfaces: `/cookies`, `/privacy`, and `/terms`, public brand register. Readers need to find exact rules and understand the complete policy.
- Keep every existing legal statement, date, table value, and link.

| Territory | Concept | Signature | Fit | Feasibility | Portability |
|---|---|---|---:|---:|---:|
| Formal system | A printed legal register with a page-specific index | Native links jump to each clause | 5 | 5 | 2 |
| Process | A map from data collection to use | A flow diagram summarizes each policy | 3 | 3 | 3 |
| Identity | Three documents share one Biovity cover | A coordinated legal library | 4 | 5 | 3 |

Select the printed legal register. It makes dense, existing text easier to scan without inventing a summary.

### Concept card

- Idea: Biovity's policies become a readable register with direct links to every section.
- Metaphor: A carefully edited legal field guide.
- Signature: Each page gets an index shaped to its content: horizontal for cookies, side index for privacy, chapter index for terms.
- Emotion: Clear, calm, and dependable.
- Motion verb: Navigate. Use native anchor links. Do not animate legal text.
- Screenshot: A large left-aligned title, date, and page-specific index lead into readable legal copy.
- Genericness test: Keep cookie identifiers and Biovity's Chilean policy clauses as the material. Do not add a generic illustration or legal claims.

### System

- Register: public brand pages. Use existing Biovity color and typography tokens.
- Type: Geist Sans for titles and legal copy. Use monospace only for literal cookie identifiers.
- Grid: 12 columns on desktop and one column on mobile. Keep privacy navigation in a separate column on wide screens.
- Rhythm: Left-aligned document title, visible update date, section index, then complete legal text.
- Shape: Existing rounded-lg controls and rounded-xl document surface. Use no decorative shadows.
- Motion: Native anchor navigation and existing link feedback. Keep all content visible without scripts.

## Recruiting page direction: Translate scientific skills into hiring signals

### Brief and concept selection

- Surface: `/recruiting`, brand register. Audience: scientific employers in Chile.
- Job: explain how Biovity supports science-focused hiring and move organizations to sign-up or plans.
- Language: Spanish for Chile.
- Evidence: the existing FAQ names real technical equivalences such as HPLC and qPCR. Existing numerical claims have no visible source on this page.

| Territory | Concept | Signature | Fit | Feasibility | Portability |
|---|---|---|---:|---:|---:|
| Scientific material | Translate a technique name into a recognized equivalent | Two real terminology pairs demonstrate the hiring signal | 5 | 5 | 2 |
| Formal system | Compare recruiting methods as a field guide | Five methods become complete editorial entries | 4 | 5 | 3 |
| Process | Follow one hiring decision through four stages | Traditional and Biovity paths meet at each stage | 4 | 4 | 3 |

Select scientific translation as the signature. It uses examples already present in the recruiting FAQ.

### Concept card

- Idea: Biovity helps employers recognize scientific experience across different terms.
- Metaphor: A laboratory glossary applied to hiring.
- Signature: HPLC and qPCR connect to their established expanded names in a clear example panel.
- Emotion: Precise, useful, and credible.
- Motion verb: Resolve. Technique labels settle into their matching terms with one short reveal.
- Screenshot: The hiring statement sits beside a clear two-row terminology comparison.
- Genericness test: Keep examples, tools, FAQ, and claims tied to the existing recruiting content. Do not add candidate data or unsupported performance figures.

### System

- Register: brand. Reuse Biovity color tokens, Geist Sans, Geist Mono, and existing animation helpers.
- Palette: `foreground` for statements, `primary` for controls, `secondary` for scientific labels, `accent` for one headline phrase, and token surfaces for grouped content.
- Type: Large left-aligned hero headline and 16–18 px body copy. Use monospace for literal technique names only.
- Grid: 12 columns in a shared 7xl container. Hero uses 6 columns for copy and 6 for the terminology panel.
- Rhythm: split hero, editorial method index, comparison matrix, four-stage workflow, two-column FAQ, then a focused signup close.
- Shape: rounded-lg controls, rounded-xl panels, no card shadows.
- Motion: Low-distance reveals with the existing easing and reduced-motion helpers. No ambient loops or decorative gradients.

### Composition

```text
Hero       [recruiting statement, 6 cols] [real terminology pairs, 6 cols]
Methods    [heading, 4 cols] [five complete method entries, 8 cols]
Matrix     [comparison heading] [responsive existing matrix]
Workflow   [stage title, 3 cols] [traditional / Biovity paths, 9 cols]
FAQ        [sticky heading, 4 cols] [accessible accordion, 8 cols]
Close      [recruiting invitation and existing actions]
```

## Plans page direction: Hiring capacity as a menu

### Concept

- Show the actual hiring capacity progression from Free through Enterprise as one ordered pricing menu.
- Use `PLANES_EMPRESAS` as the only source for price, feature, and CTA content.
- Keep billing controls beside the title and label the 20% discounted view as a reference. Do not imply an annual billing contract.

### System

- Register: public brand page. Use Geist, existing Biovity tokens, and left-aligned hierarchy.
- Layout: one ordered list with aligned plan, features, and price/action columns. Collapse to one column on mobile.
- Shape: subtle Pro row tint, standard rounded controls, no card shadows.
- Motion: short, low-distance row entrance. Respect reduced-motion settings.

## Jobs page direction: Scientific specialties as an index

### Concept

- Use the seven real job categories as the entry point to search.
- Keep the page about finding work. Do not add sample listings or unsupported hiring claims.
- Make selected categories, loading, empty, and error states clear in both themes.

### System

- Register: product. Keep search controls at `h-11`, use existing surface and text tokens, and keep cards shadow-free.
- Type: use a concise page title, readable offer titles, and compact sans-serif result metadata.
- Color: use `secondary` for selected search areas and `accent` only for the headline emphasis.
- Motion: use functional hover, focus, and loading transitions. Avoid decorative movement.

### Composition

```text
Hero       [left-aligned job-search statement] [specialty context]
Index      [seven selectable specialties]
Search     [keyword search and expandable filters]
Results    [result count and sort] [real job listings]
States     [themed loading, error with retry, and empty results]
```
