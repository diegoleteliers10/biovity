# Biovity Design System Specification: "The Curated Organism"

> **Official Brand & UI Design System for Biovity**  
> Based on the production guidelines and interactive components showcased at [`/marca`](file:///Users/dleteliers/Dev/biovity/app/marca/page.tsx).

---

## 1. Overview & Creative North Star

Biovity is a high-precision ecosystem connecting scientific talent with biotechnology companies, laboratories, and R&D organizations in Chile. The design system follows the **"Curated Organism"** philosophy: where scientific rigor meets refined, modern digital product design.

### 1.1 The 4 Core Principles

1. **The Curated Organism (Biological Rigor & Sophistication):**
   We reject rigid, cluttered SaaS templates in favor of an expansive, breathing environment. Every section has intentional whitespace and balance, emulating the precision of a laboratory and the clarity of a premium digital publication.
2. **Tonal Depth over Heavy Borders:**
   Depth and separation are established by stacking subtle tonal surfaces (`surface-container-low`, `surface-container-lowest`, `surface-container-highest`) rather than harsh 1px black or dark gray borders around every box.
3. **Strategic & Purposeful Color (*"Si todo tiene color, nada destaca"*):**
   A clean, neutral foundation allows Emerald Green (`secondary`) and Biovity Violet (`accent`) to draw immediate focus to key actions, verifications, keywords, and AI intelligence features.
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
| `--accent` | **Biovity Violet** | `#8483d4` | `132, 131, 212` | Highlighted words in titles (`<span>`), AI feature chips, discount tags (`-20% dto`), intelligence badges. |
| `--accent-foreground` | White | `#ffffff` | `255, 255, 255` | Text on top of violet containers. |
| `--muted-foreground` | **Slate Gray** | `#71787d` | `113, 120, 125` | Descriptive body text, subtitles, supporting metadata, inactive icons. |

### 2.2 Surface Hierarchy (Tonal Layering System)

| Token / Class | HEX | RGB | Usage |
| :--- | :--- | :--- | :--- |
| `--surface-container-lowest` / `bg-surface-container-lowest` | `#ffffff` | `255, 255, 255` | Primary canvas, elevated cards on top of low surfaces, modals, popovers. |
| `--surface-container-low` / `bg-surface-container-low` | `#f3f3f5` | `243, 243, 245` | Alternating section backgrounds, metric stat cards, form toolbars, card containers. |
| `--surface-container-highest` / `bg-surface-container-highest` | `#e2e2e4` | `226, 226, 228` | Hover backgrounds, inactive chips, subtle dividers, secondary pill backgrounds. |

---

## 3. Typography & Hierarchy

The typography pairs **Satoshi Variable** (clean sans-serif clarity) with **Geist Mono** (technical precision, metadata, and metric labels).

```
Font Stack:
- Sans (Primary): "Satoshi", "Inter", -apple-system, sans-serif
- Mono (Technical & Eyebrows): "Geist Mono", "Courier New", monospace
```

### 3.1 Font Weights
- **Satoshi Variable (Sans):** Regular (`400`), Medium (`500`), SemiBold (`600`), Bold (`700`).
- **Geist Mono (Mono):** Medium (`500`), SemiBold (`600`), Bold (`700`).

### 3.2 Production Hierarchy Scale

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

#### E. Metric Values
```tsx
<p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
  {stat.value}
</p>
<p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
  {stat.label}
</p>
```

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
All interactive buttons follow uniform height `h-11` (or `h-9`/`h-10` in compact tables), `rounded-lg` radius, and `text-sm font-medium` typography.

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
```

---

### 5.2 Selection Controls: Monthly vs. Annual Billing Switch
High-contrast switch with a solid gray track in inactive state and emerald green in active state, with clickable option labels.

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

### 5.3 Metric Cards & Hero Statistics
Consistent centered alignment and borderless tonal containers across all pages (`/nosotros`, `/empresas`, `/salarios`, `/consejos-carrera`, `/marca`):

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60"
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

### 5.4 Micro-Labels, Badges & Chips
- **Step Badge:** `text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full`
- **Highlight / AI Step Badge:** `text-xs font-mono font-semibold text-accent bg-accent/10 border border-accent/25 px-2.5 py-1 rounded-full`
- **AI Match Chip:** `<Badge variant="secondary" className="bg-accent/15 text-accent border-0 text-[11px] px-2.5 py-0.5 font-mono">`
- **Recommended Pill:** `text-[11px] font-mono font-semibold text-secondary-foreground bg-secondary px-3 py-1 rounded-full`

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

### 5.7 CTA Banners & Conversion Modules
- **Container:** `bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center`.
- **Eyebrow:** Plain green monospace text (`ÚNETE A LA RED`).
- **Title:** Centered headline with violet accent word (`<span className="text-accent">`).
- **Benefits:** Verified checklist items with `CheckmarkCircle02Icon` in `text-secondary`.
- **Action Group:** Dual CTA with Primary button (`bg-primary text-primary-foreground`) and Outline button (`variant="outline"`).

---

## 6. Animations & Motion Standards

Built on `motion/react` with spring-based transitions and smooth cubic-bezier easing.

```ts
// Standard production easing
const ease = [0.23, 1, 0.32, 1] as const
```

### Motion Guidelines:
1. **Reduced Motion Accessibility:** Always check `useReducedMotion()` and fallback to `0.01s` duration when enabled.
2. **Staggered Card Entrances:** Stagger list reveals by 50ms to 80ms increments (`opacity: 0, y: 16 -> opacity: 1, y: 0`).
3. **Hover States:** Rely on smooth background transitions (`transition-colors duration-150`), avoiding aggressive scale jumps that displace adjacent grid items.

---

## 7. Do's and Don'ts

### ✅ DO:
- Use plain green monospace text (`text-secondary font-mono text-xs uppercase tracking-wider`) for category eyebrows before titles.
- Use violet (`text-accent`) strictly as an accent for key phrases in titles and AI/special badges.
- Maintain `h-11` height consistency for all inputs, selectors, and buttons inside search/filter toolbars.
- Use `bg-surface-container-low` for page section backgrounds and metric cards.
- Keep numbers centered with `text-2xl sm:text-3xl font-bold tracking-tight` across all stat modules.
- Use solid gray background (`bg-neutral-200`) for the inactive state of switch toggles.

### ❌ DON'T:
- Don't wrap section eyebrow tags inside rounded pill containers or borders.
- Don't use heavy, high-contrast dark borders around every card.
- Don't mix different heights for inputs and dropdowns on the same line.
- Don't use violet for primary CTA buttons (use Deep Slate Navy `#00374a` or Emerald Green `#006b5e`).
- Don't apply `scale: 0.98` transforms on parent containers hosting coordinate-measured SVGs like `AnimatedBeam`.
