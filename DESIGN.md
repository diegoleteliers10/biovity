# Design System Specification: The Curated Organism

## 1. Overview & Creative North Star

This design system is built upon the **"Curated Organism"** Creative North Star. In the world of biotech, precision meets biology; in high-end editorial design, structure meets soul. This system rejects the rigid, "boxed-in" layout of standard SaaS templates in favor of an expansive, breathing environment that feels like a premium digital monograph.

We break the "template" look through:
*   **Intentional Asymmetry:** Using the Spacing Scale to create unexpected margins that lead the eye.
*   **Tonal Depth:** Replacing harsh lines with overlapping surfaces that mimic laboratory glassware.
*   **Typographic Gravity:** Leveraging extreme scale contrast (Display-lg vs. Label-sm) to establish an authoritative, expert voice.

---

## 2. Colors

The palette is a sophisticated interplay of deep aquatic teals and vibrant biological greens, punctuated by a scholarly violet accent.

### Color Tokens
*   **Primary (Teal):** `#00374a` — Use for core brand moments and high-authority headers.
*   **Secondary (Emerald):** `#006b5e` — Use for success states, growth indicators, and primary CTAs.
*   **Tertiary (Dark Gray):** `#111827` — Use for footer, dark sections, and high-contrast areas.
*   **Accent (Violet):** `#8483d4` — Reserved for deep-level insights, accents, and high-end interactive elements.
*   **Surface Hierarchy:** From `surface-container-lowest` (`#ffffff`) to `surface-container-highest` (`#e2e2e4`).

### Core Color Rules
*   **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a main content area using `surface` (`#f9f9fb`) should be separated from a sidebar using `surface-container-low` (`#f3f3f5`). 
*   **Surface Nesting:** Treat the UI as a series of physical layers. An inner card should use `surface-container-lowest` when sitting atop a `surface-container-low` section to create a soft, natural lift.
*   **The Glass & Gradient Rule:** For hero sections or floating navigation, use Glassmorphism. Apply a semi-transparent `surface` color with a 20px backdrop-blur. 
*   **Signature Textures:** For primary action areas, use a subtle linear gradient transitioning from `primary` (`#00374a`) to `primary_container` (`#1d4e63`) at a 135-degree angle. This provides a "visual soul" that flat hex codes cannot achieve.

---

## 3. Typography

The system utilizes **Satoshi** across all scales to bridge the gap between technical precision and human approachability.

*   **Display (lg/md/sm):** Set in SemiBold. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines to create a bold, editorial impact.
*   **Headline & Title:** Use for section starts. `headline-lg` (2rem) provides a clear entry point for the user's eye.
*   **Body (lg/md/sm):** Set in Regular. `body-md` (0.875rem) is the workhorse for all data and descriptive text, ensuring high legibility in dense biotech contexts.
*   **Labels:** Use `label-md` (0.75rem) in All-Caps with +0.05em letter-spacing for category tags and metadata to maintain the "scientific journal" aesthetic.

---

## 4. Elevation & Depth

We move away from the "floating shadow" look of the early 2010s toward **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. 
    *   Base: `surface`
    *   Content Block: `surface-container-low`
    *   Interactive Element: `surface-container-lowest`
*   **Ambient Shadows:** When a floating effect is required (e.g., Modals), shadows must be extra-diffused. 
    *   *Formula:* `0px 24px 48px rgba(26, 28, 29, 0.06)`. Note the use of the `on-surface` color for the shadow tint rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (`#c1c7cc`) at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** Use for floating headers. Combine `surface` at 80% opacity with a `backdrop-filter: blur(12px)`. This integrates the UI into the background, preventing a "pasted on" appearance.

---

## 5. Components

### Buttons
*   **Primary:** Background: `secondary` (`#006b5e`), Text: `on_secondary` (`#ffffff`). Roundedness: `full`.
*   **Tertiary (Ghost):** No background. Text: `primary`. 1px Ghost Border (15% opacity) only on hover.
*   **Sizing:** Use Spacing `3` (vertical) and `6` (horizontal).

### Cards & Lists
*   **Card Style:** Use `roundedness-xl` (0.75rem). No dividers. Separate content using Spacing `8` (2.75rem) gaps.
*   **List Items:** Instead of lines, use a subtle background hover state of `surface-container-high`.

### Input Fields
*   **State:** Use `outline` (`#71787d`) for idle and `secondary` (Emerald) for active focus.
*   **Shape:** `roundedness-md` (0.375rem) for a precise, tech-forward feel.

### Chips
*   **Selection:** Use `tertiary_fixed` (`#e2dfff`) backgrounds with `on_tertiary_fixed` (`#161545`) text. This introduces the soft violet accent as a functional tool for categorization.

---

## 6. Do's and Don'ts

### Do
*   **Do** use generous whitespace (Spacing `16` and `20`) between major sections to let the "Editorial" feel emerge.
*   **Do** use the Emerald Green (`secondary`) to draw attention to "Growth" or "Success" metrics.
*   **Do** align text-heavy sections to a 12-column grid but allow imagery and data visualizations to "break out" of the grid for an asymmetric look.

### Don't
*   **Don't** use 1px solid black or grey borders. They clutter the biotech-inspired "clean room" aesthetic.
*   **Don't** use standard "Drop Shadows." Stick to the Ambient Shadow formula or Tonal Layering.
*   **Don't** crowd the interface. If a layout feels busy, increase the spacing by one tier in the Spacing Scale.
*   **Don't** use the Violet accent for primary actions; it is a "discovery" color, meant for secondary insights and metadata.