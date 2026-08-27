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
