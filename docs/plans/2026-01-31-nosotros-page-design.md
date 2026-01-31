# Nosotros Page Design

## Overview
Create a "/nosotros" page for BioVity that combines company information with the core team, following the existing design patterns from /empresas and /salarios pages.

## Page Structure

### 1. Shared Header
- Use existing Header component with "Nosotros" as active navigation item
- Navigation: Trabajos, Empresas, **Nosotros**, Blog

### 2. Hero Section
**Layout:**
- Standard landing page hero with subtle background (light blue-green gradient)
- Similar structure to /empresas and /salarios

**Content:**
- Title (h1): "Conectando el Talento Científico de Chile"
- Subtitle: "Nuestra misión es crear la plataforma líder que conecta profesionales en biotecnología, química, farmacia y ciencias de la salud con las mejores oportunidades del mercado."
- Highlighted stat: "+500 profesionales activos" or "Fundado en 2024"

**Styling:**
- Background: `bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50`
- Title: `text-4xl md:text-6xl font-bold text-gray-900 font-rubik`
- Subtitle: `text-lg md:text-xl text-gray-600`
- Stats: `text-2xl font-bold text-gray-900`

**Animations (GSAP):**
- Fade-in and slide-up on scroll
- Staggered animations for subtitle and stats

### 3. Nuestra Historia y Misión Section
**Layout:**
- Section: `py-24 bg-white`
- Grid structure with narrative history + mission/vision/values cards

**Content - Historia:**
- Title: "Nuestra Historia"
- Icon: Timeline/History icon
- Text: "BioVity nació en 2024 con una misión clara: resolver el problema de dispersión en el mercado laboral de ciencias. Vimos que profesionales altamente capacitados luchaban por encontrar oportunidades, mientras empresas en biotecnología, química y farmacia enfrentaban dificultades para encontrar talento especializado."

**Content - Misión, Visión, Valores:**
Grid of 3 cards:

1. **Misión**
   - Icon: Target/Mission icon
   - Text: "Conectar talento científico con oportunidades significativas en el sector de biociencias."

2. **Visión**
   - Icon: Eye/Vision icon
   - Text: "Ser la comunidad líder de unificación de recursos para profesionales de ciencias en Latinoamérica."

3. **Valores**
   - Icon: Heart/Values icon
   - Text: "Transparencia, calidad, innovación y comunidad científica."

**Styling:**
- Cards: `bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300`
- Icons: `w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600`
- Icon text: `text-white`
- Title: `text-xl font-bold text-gray-900 mb-2`
- Description: `text-gray-600 leading-relaxed`

**Animations (GSAP):**
- Header items fade-in with y: 40 → 0, stagger: 0.1
- Cards fade-in with scale: 0.95 → 1, stagger: 0.12

### 4. El Problema y La Solución Section
**Layout:**
- Section: `py-24 bg-gray-50`
- Two horizontal cards (side by side on desktop)

**Content - El Problema:**
- Title: "El Problema que Resolvemos"
- Icon: Alert/Warning icon
- Text: "El mercado laboral de ciencias en Chile está fragmentado, con poca transparencia y omisión de información crítica. Profesionales enfrentan pocas ofertas dispersas en múltiples plataformas, mientras empresas no solo tienen dificultades para encontrar talento especializado, sino que además carecen de un seguimiento de inicio a fin centralizado de sus procesos de selección."

**Content - La Solución (BioVity):**
- Title: "Nuestra Solución"
- Icon: Checkmark/Solution icon
- Text: "Creamos BioVity como un espacio centralizado donde profesionales pueden encontrar empleos, comparar salarios del sector, acceder a consejos de carrera y conectar con una comunidad activa. Para empresas, ofrecemos herramientas ATS simplificadas y acceso directo a talento verificado."

**Styling:**
- Cards: `bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow`
- Icons: `w-14 h-14 rounded-xl flex items-center justify-center`
- Title: `text-2xl font-bold text-gray-900 mb-4 font-rubik`
- Description: `text-lg text-gray-700 leading-relaxed`

**Animations (GSAP):**
- Cards fade-in from opposite sides (x: -40 and x: 40)
- Stagger: 0.15

### 5. Equipo Section
**Layout:**
- Section: `py-24 bg-white`
- Grid with single centered card
- Title: "Nuestro Equipo"
- Subtitle: "El equipo detrás de BioVity"

**Content - Single Team Card:**
- Name: "Diego Letelier"
- Role: "CEO & CTO"
- Photo/Avatar: Circular or rounded square
- Brief description: Placeholder to be updated by Diego
- LinkedIn icon (optional, link to profile)

**Styling:**
- Card: `bg-white rounded-2xl p-8 shadow-lg border border-gray-100`
- Photo: `w-32 h-32 rounded-full mx-auto mb-6`
- Name: `text-2xl font-bold text-gray-900 mb-2 font-rubik`
- Role: `text-lg text-blue-600 mb-4`
- Description: `text-gray-600 leading-relaxed`

**Animations (GSAP):**
- Fade-in and scale-up effect
- scale: 0.95 → 1, opacity: 0 → 1

### 6. CTA (Call to Action) Section
**Layout:**
- Section: `py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`
- Centered content

**Content:**
- Title (h2): "¿Listo para unirte a BioVity?"
- Subtitle: "Ya seas un profesional buscando oportunidades o una empresa buscando talento, BioVity está aquí para conectar."
- Two buttons:
  1. "Buscar Empleos" → Link to `/trabajos` (outline variant)
  2. "Publicar Oferta" → Link to `/register/organization` (primary variant)

**Styling:**
- Title: `text-4xl md:text-5xl font-bold text-white mb-6 font-rubik`
- Subtitle: `text-xl text-gray-400 mb-8 max-w-3xl mx-auto`
- Buttons: Standard Button component from `/components/ui/button`
  - First: `variant="outline" size="lg" h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg`
  - Second: `size="lg" h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 text-lg`

**Animations (GSAP):**
- Fade-in from bottom
- y: 40 → 0, stagger: 0.1

### 7. Shared Footer
- Use existing Footer component
- "Salarios" link added to "Para Profesionales" section

## Components to Create

1. **app/nosotros/page.tsx** - Main page file
2. **components/LandingComponents/Nosotros/NosotrosHero.tsx** - Hero section
3. **components/LandingComponents/Nosotros/HistoriaMision.tsx** - History and mission section
4. **components/LandingComponents/Nosotros/ProblemaSolucion.tsx** - Problem and solution section
5. **components/LandingComponents/Nosotros/Equipo.tsx** - Team section
6. **components/LandingComponents/Nosotros/CTANosotros.tsx** - Final CTA section

## Design Patterns to Follow

1. **Typography:**
   - Headings: `font-rubik`
   - Body text: `font-sans`
   - Consistent with all other pages

2. **Color Palette:**
   - Primary: Blue-600 to green-500 gradients
   - Background: White and gray-50 alternating
   - Text: Gray-900 (headings), Gray-700 (body), Gray-500 (secondary)
   - Same as /empresas and /salarios

3. **Animation Style:**
   - GSAP animations with ScrollTrigger
   - Fade-in from y: 40-50
   - Scale effects for cards
   - Staggered delays for multiple elements
   - Consistent easing: "power3.out" for main, "power2.out" for secondary

4. **Spacing:**
   - Sections: `py-24` (96px vertical padding)
   - Card padding: `p-6` to `p-8`
   - Grid gaps: `gap-8`

5. **Responsive Design:**
   - Mobile-first approach
   - Desktop: `md:` and `lg:` breakpoints
   - Single column on mobile, multi-column on desktop

## File Structure

```
app/
  nosotros/
    page.tsx

components/LandingComponents/Nosotros/
  NosotrosHero.tsx
  HistoriaMision.tsx
  ProblemaSolucion.tsx
  Equipo.tsx
  CTANosotros.tsx
```

## Implementation Notes

1. **GSAP Setup:**
   - Use `useGSAP` hook from `@gsap/react`
   - Register `ScrollTrigger` only on client side
   - Wrap animations in `useEffect` with proper cleanup

2. **Icons:**
   - Use Lucide React icons (consistent with codebase)
   - Import from `lucide-react`
   - Examples: `TrendingUp`, `Target`, `Heart`, `AlertCircle`, `CheckCircle`, `User`

3. **Images:**
   - Use placeholder for team photo initially
   - Update to real photo when available
   - Image path: `/images/team/diego.jpg`

4. **Accessibility:**
   - All headings have proper hierarchy
   - Buttons have `aria-label` where needed
   - Links have meaningful text
   - Color contrast ratios met

## Testing Checklist

- [ ] Hero section renders correctly
- [ ] All GSAP animations trigger on scroll
- [ ] Mobile responsive (single column layout)
- [ ] Desktop responsive (multi-column grid)
- [ ] Navigation "Nosotros" is active
- [ ] Footer includes "Salarios" link
- [ ] All buttons navigate correctly
- [ ] Images load properly
- [ ] No console errors
- [ ] Performance acceptable (Lighthouse score >90)

## Future Enhancements

1. Add LinkedIn profile links for team members
2. Include team photos when available
3. Add company timeline/roadmap
4. Include testimonials from early users
5. Add metrics dashboard (active users, jobs posted, etc.)
