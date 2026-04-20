# Design System Specification: The Curated Organism

## 1. Overview & Creative North Star

This design system is built upon the **"Curated Organism"** Creative North Star. In the world of biotech, precision meets biology; in high-end editorial design, structure meets soul. This system rejects the rigid, "boxed-in" layout of standard SaaS templates in favor of an expansive, breathing environment that feels like a premium digital monograph.

We break the "template" look through:

- **Intentional Asymmetry:** Using the Spacing Scale to create unexpected margins that lead the eye.
- **Tonal Depth:** Replacing harsh lines with overlapping surfaces that mimic laboratory glassware.
- **Typographic Gravity:** Leveraging extreme scale contrast (Display-lg vs. Label-sm) to establish an authoritative, expert voice.

---

## 2. Color System

### Brand Colors

The palette uses three brand colors plus a neutral foundation. **Rule: "Si todo tiene color, nada destaca"** — use color intentionally, not decoratively.


| Role          | Color         | Hex                             | Usage                                                |
| ------------- | ------------- | ------------------------------- | ---------------------------------------------------- |
| **Primary**   | Verde         | `#006b5e`                       | CTAs, acciones principales, estados activos          |
| **Secondary** | Azul oscuro   | `#00374a`                       | Footer, elementos estructurales, texto de peso       |
| **Accent**    | Violeta       | `#8483d4`                       | Badges especiales, AI, cosas premium/diferenciadoras |
| **Neutral**   | Grises + Azul | `#f3f3f5`, `#e2e2e4`, `#00374a` | Fondos, texto, estructura                            |


### Surface Hierarchy (Tonal Depth)

- `surface-container-lowest`: `#ffffff` — Cards sobre fondos claros
- `surface-container-low`: `#f3f3f5` — Secciones, fondos de cards
- `surface-container-highest`: `#e2e2e4` — Hover states, acentos

### Core Color Rules

- **"Si todo tiene color, nada destaca"**: Reducir color general para que lo importante resalte. Verde solo para CTAs, violeta para lo especial/premium, neutro para el resto.
- **The "No-Line" Rule**: No usar 1px solid borders para sectioning. Usar shifts de background color.
- **Surface Nesting**: Capas de surface para crear profundidad natural. Card sobre section = `surface-container-lowest` sobre `surface-container-low`.
- **Ghost Border Fallback**: Si un borde es necesario, usar `outline_variant` al 15% opacity. Nunca bordes 100% opacos.
- **Glassmorphism (Hero)**: Para hero o headers flotantes, blobs de color brand con blur 2xl-3xl a 20-30% opacity.

---

## 3. Typography

The system utilizes **Satoshi** across all scales.

- **Display (lg/md/sm):** SemiBold. `display-lg` (3.5rem) con letter-spacing -0.02em para headlines hero.
- **Headline & Title:** Section headers. `headline-lg` (2rem).
- **Body (lg/md/sm):** Regular. `body-md` (0.875rem) para datos y texto descriptivo.
- **Labels:** `label-md` (0.75rem) All-Caps con +0.05em letter-spacing para tags y metadata.

---

## 4. Elevation & Depth

### Layering Principle

Depth achieved through surface tier stacking:

- Base: `surface`
- Content Block: `surface-container-low` (`#f3f3f5`)
- Interactive Element: `surface-container-lowest` (`#ffffff`)

### Shadows

- **Ambient Shadow** (modals, floating elements):
`box-shadow: 0px 24px 48px rgba(26, 28, 29, 0.06)`
- **Circle Component** (hero beam):
`box-shadow: 0 0 20px -12px rgba(0,0,0,0.8)`

### Glassmorphism

Headers flotantes: `surface` 80% opacity + `backdrop-filter: blur(12px)`.

---

## 5. Components

### Buttons


| Variant       | Background            | Text               | Border                 | Usage                |
| ------------- | --------------------- | ------------------ | ---------------------- | -------------------- |
| **default**   | `secondary` (#006b5e) | white              | none                   | CTAs principales     |
| **secondary** | transparent           | `secondary`        | `secondary` 30%        | Acciones secundarias |
| **accent**    | `accent` (#8483d4)    | white              | none                   | Acciones especiales  |
| **ghost**     | transparent           | `muted-foreground` | none (hover: accent/5) | Navegación sutil     |
| **outline**   | transparent           | `foreground`       | `border` 30%           | Secondary actions    |


- **Roundedness**: `rounded-full` para default/secondary/accent; `rounded-md` para ghost/outline
- **Sizing**: `h-10 px-6` (lg), `h-9 px-4` (default), `h-8 px-3` (sm)
- **Hover**: Solo transiciones de color, sin transformaciones bruscas

### Badges


| Variant     | Background   | Text               | Usage                         |
| ----------- | ------------ | ------------------ | ----------------------------- |
| **default** | transparent  | `muted-foreground` | Metadata neutra               |
| **accent**  | `accent` 15% | `accent` (#8483d4) | Cosas especiales, AI, premium |
| **success** | `accent` 10% | `accent` (#8483d4) | Matches, highlights suaves    |


- **Shape**: `rounded-full`
- **Padding**: `px-2 py-0.5`
- **Font**: `text-xs font-medium`

### Cards

- **Background**: `surface-container-lowest` (#ffffff)
- **Border**: `border border-border/10` (sutil, no agresivo)
- **Radius**: `rounded-xl` (0.75rem)
- **Padding**: `p-6`
- **Hover**: `bg-secondary/5` (tinte verde sutil)
- **Shadow**: Ninguno (usar tonal layering)

### Icons

- **Default**: `text-muted-foreground` (#71787d)
- **Active/Primary**: `text-secondary` (#006b5e)
- **Special/Accent**: `text-accent` (#8483d4)
- **Icon backgrounds**: Usar `secondary/10` para fondos de iconos activos

### Input Fields

- **Idle**: `outline` (#71787d)
- **Focus**: `secondary` (#006b5e) con `ring-secondary/20`
- **Shape**: `rounded-md` (0.375rem)

### Hero Background

Mesh de 6 blobs con brand colors a 20-30% opacity:

- 2 círculos Azul (#00374a) — top-left, top-right
- 2 círculos Verde (#006b5e) — bottom-left, bottom-right
- 2 círculos Violeta (#8483d4) — center-left, center-right
- Blur: `blur-2xl` a `blur-3xl`

---

## 6. Animation System

### Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| **default** | 150ms | ease-out | Micro-interactions (hover, focus) |
| **smooth** | 300ms | ease-in-out | Page transitions, reveals |
| **slow** | 500ms | ease-in-out | Hero animations, modal entrances |

### Animation Patterns

#### Enter Animation
- **Opacity**: 0 → 1
- **Transform**: translateY(8px) → translateY(0)
- **Duration**: 300ms (smooth)
- **Easing**: ease-out

#### Exit Animation
- **Opacity**: 1 → 0
- **Transform**: translateY(0) → translateY(-8px)
- **Duration**: 300ms (smooth)
- **Easing**: ease-in-out

#### Scale Animation
- **Transform**: scale(0.95) → scale(1)
- **Duration**: 150ms (default)
- **Usage**: Button hover, card hover states

### Animation Rules

- **Entrances first**: Elements should fade + slide up (translateY 8px → 0) on mount
- **Exits follow**: Elements fade + slide up slightly before disappearing
- **Micro-interactions**: Use 150ms for hover/focus states
- **Page transitions**: Use 300ms smooth for route changes
- **Hero content**: Use 500ms slow for hero sections, staggered 50-100ms between elements
- **No jarring motion**: Avoid instant state changes; always use easing

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 4 | 1rem (16px) | Tight spacing, icon gaps |
| 6 | 1.5rem (24px) | Card padding, small gaps |
| 8 | 2rem (32px) | Section gaps |
| 10 | 2.5rem (40px) | Large section gaps |
| 12 | 3rem (48px) | Page section margins |
| 16 | 4rem (64px) | Hero spacing |
| 20 | 5rem (80px) | Major section breaks |
| 24 | 6rem (96px) | Large vertical rhythm |
| 32 | 8rem (128px) | Hero height |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **none** | 0 | Sharp edges, geometric |
| **sm** | 0.125rem (2px) | Subtle rounding |
| **md** | 0.375rem (6px) | Inputs, small buttons |
| **lg** | 0.5rem (8px) | Cards, dropdowns |
| **xl** | 0.75rem (12px) | Modals, large cards |
| **2xl** | 1rem (16px) | Feature cards |
| **3xl** | 1.5rem (24px) | Hero containers |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| **sm** | 0 1px 2px rgba(26,28,29,0.05) | Subtle elevation |
| **md** | 0 4px 8px rgba(26,28,29,0.08) | Cards |
| **lg** | 0 8px 16px rgba(26,28,29,0.10) | Floating elements |
| **xl** | 0 16px 32px rgba(26,28,29,0.12) | Modals, overlays |
| **2xl** | 0 24px 48px rgba(26,28,29,0.16) | Hero elements |

---

## 7. Do's and Don'ts

### Do

- Usar whitespace generoso (Spacing 16 y 20) entre secciones
- Usar Verde (`secondary`) para CTAs y estados activos
- Usar Violeta (`accent`) para badges, AI, y cosas premium
- Usar fondos tonales (surface hierarchy) en vez de bordes
- Dejar que los iconos activos brillen con verde

### Don't

- Usar 1px solid borders. En vez de eso, usar shifts de background.
- Usar sombras duras. Usar `shadow-ambient` o tonal layering.
- Usar violeta para acciones principales — es para lo especial.
- Sobrecargar de color. Si todo tiene color, nada destaca.