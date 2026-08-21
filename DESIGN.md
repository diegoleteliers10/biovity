# Biovity Design System Specification: "The Curated Organism"

## 1. Overview & Creative North Star

Biovity is a high-precision ecosystem connecting scientific talent with biotechnology companies, laboratories, and R&D organizations in Chile. The design system follows the **"Curated Organism"** philosophy: where scientific rigor meets refined, modern digital product design.

### Core Principles
- **Clarity over Clutter:** Every element has a functional purpose. Minimalist, uncluttered layouts with high legibility.
- **Tonal Depth over Harsh Borders:** Structural depth is achieved by stacking subtle tonal surfaces (`surface-container-low`, `surface-container-lowest`) rather than heavy 1px borders everywhere.
- **Strategic Color Accents:** *"Si todo tiene color, nada destaca."* Neutral foundations allow our Emerald Green (`secondary`) and Violet (`accent`) to draw immediate focus to key actions and concepts.
- **Uniform Dimensionality:** Inputs, dropdowns, and CTA buttons on search/filtering bars share exact heights (`h-11`) and consistent corner radiuses.

---

## 2. Color System & Design Tokens

### 2.1 Brand Palette

| Token | Name | Hex / Value | Role & Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | Deep Slate Navy | `#00374a` | Primary CTA buttons, major structural headers, corporate emphasis |
| `--primary-foreground` | White | `#ffffff` | Text on top of primary buttons |
| `--secondary` | Emerald Green | `#006b5e` | Eyebrow section titles, active indicators, verified checks, badges |
| `--secondary-foreground` | White | `#ffffff` | Text on top of secondary elements |
| `--accent` | Biovity Violet | `#8483d4` | Highlighted words in titles (`<span>`), AI feature tags, special tags |
| `--accent-foreground` | White | `#ffffff` | Text on top of accent elements |
| `--muted-foreground` | Slate Gray | `#71787d` | Secondary descriptive text, subtitles, captions |

### 2.2 Surface Hierarchy (Tonal Layering)

To create a clean, modern aesthetic without visual noise:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `surface-container-lowest` | `#ffffff` | Default background canvas, elevated cards, interactive floating panels |
| `surface-container-low` | `#f3f3f5` | Alternating section backgrounds, card containers, input backgrounds |
| `surface-container-highest`| `#e2e2e4` | Hover states, icon pill backdrops, active filter chips, neutral borders |

---

## 3. Typography & Hierarchy

The entire interface uses **Satoshi** (Sans) for modern UI clarity, with **Geist Mono** for metadata, metrics, and eyebrow labels.

```
Font Families:
- Sans: "Satoshi", "Inter", -apple-system, sans-serif
- Mono: "Geist Mono", "Courier New", monospace
```

### 3.1 Eyebrows / Category Tags (Plain Green Text Standard)
> **Rule:** Section headings do **not** use pill/bubble wrappers. They use plain, uppercase monospace green text.

```tsx
<span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
  CATEGORÍA O SECCIÓN • CONTEXTO
</span>
```

### 3.2 Main Hero & Section Headlines (Violet Word Accent Standard)
Headlines feature balanced tracking, with key scientific or differentiator words highlighted in Violet (`text-accent`).

```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
  Título Principal con <span className="text-accent font-semibold">Palabra Clave</span> en Chile
</h1>
```

### 3.3 Subtitles & Descriptions
```tsx
<p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-pretty">
  Texto descriptivo con buen contraste y espaciado de lectura confortable.
</p>
```

---

## 4. UI Patterns & Component Guidelines

### 4.1 Metrics & Hero Stats Cards
All pages (`/nosotros`, `/empresas`, `/salarios`, `/consejos-carrera`) share identical metric card typography, sizing, and center alignment:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
  <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60">
    <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
      {stat.value}
    </p>
    <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
      {stat.label}
    </p>
  </div>
</div>
```

### 4.2 Form Inputs, Selectors & Search Bars (Equal Height Rule)
- **Standard Height:** `h-11` (44px) across search inputs, filter dropdowns, and adjacent action buttons.
- **Corner Radius:** `rounded-lg` (8px).
- **Backgrounds:** `bg-surface-container-lowest` or `bg-surface-container-low`.
- **Borders & Focus:** `border border-border/40 focus:border-secondary focus:ring-2 focus:ring-secondary/20`.

```tsx
{/* Clean Search Input & Select Group */}
<div className="flex flex-col md:flex-row gap-3">
  <Input className="h-11 rounded-lg bg-surface-container-lowest border-border/40 px-4 text-sm" />
  <Select className="h-11 rounded-lg bg-surface-container-lowest border-border/40 px-4 text-sm" />
  <Button className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
    Buscar
  </Button>
</div>
```

### 4.3 Switches & Toggles (High-Contrast Standard)
- **Active State (Anual):** Emerald track (`bg-secondary border-secondary`).
- **Inactive State (Mensual):** Solid gray track (`bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600`).
- **Thumb:** White with subtle elevation (`bg-white shadow-md ring-1 ring-black/10 size-5`).
- **Interactive Labels:** Both text options ("Mensual" and "Anual") must be clickable buttons.

### 4.4 CTA Banners & Conversion Modules
- **Container:** `bg-surface-container-low rounded-2xl p-8 sm:p-12`.
- **Eyebrow:** Emerald green uppercase tag.
- **Headline:** Includes violet accent word.
- **Benefits:** Verified items with `Tick02Icon` in `text-secondary`.
- **Buttons:** Dual CTA (`bg-primary text-primary-foreground` + `variant="outline"`).

---

## 5. Animations & Motion Standards

We use `motion/react` with spring-based or smooth cubic-bezier transitions.

```ts
// Standard easing curve
const ease = [0.23, 1, 0.32, 1] as const
```

### Motion Guidelines:
1. **Respect Reduced Motion:** Always wrap animations with `useReducedMotion()`.
2. **No Scale Transforms on Parent Containers:** Avoid `scale: 0.98` on containers that host dynamically measured canvas/SVG components (e.g. `AnimatedBeam`) to prevent coordinate skewing.
3. **Staggered Reveals:** Use 50ms - 80ms increments for sequential list/card entrances (`opacity: 0, y: 16 -> opacity: 1, y: 0`).

---

## 6. Do's and Don'ts

### ✅ DO:
- Use plain green text (`text-secondary font-mono text-xs uppercase`) for category eyebrows before titles.
- Use violet (`text-accent`) strictly as an accent for single words in titles or AI/special badges.
- Use `h-11` height consistency for all inputs, selectors, and buttons inside search/filter bars.
- Use `bg-surface-container-low` for page section alternating backgrounds.
- Keep numbers centered with `text-2xl sm:text-3xl font-bold` across all stat modules.

### ❌ DON'T:
- Don't wrap section eyebrow tags inside rounded pill containers or borders.
- Don't use heavy, high-contrast dark borders around every card.
- Don't mix different heights for inputs and dropdowns on the same line.
- Don't overuse violet for primary CTA buttons (use Deep Slate `#00374a` or Emerald `#006b5e`).
