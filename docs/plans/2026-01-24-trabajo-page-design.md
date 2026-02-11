# Diseño: Página `/trabajo` - Portal Público de Trabajos

**Fecha:** 24 de enero, 2026  
**Estado:** Diseño validado, listo para implementación

## Resumen Ejecutivo

Página pública `/trabajo` para mostrar trabajos con vacantes abiertas. Es el avistamiento principal para todas las personas (público general), diferenciándose del avistamiento especializado para usuarios autenticados en `/dashboard/employee/trabajos`.

## Objetivos

- Proporcionar una experiencia de búsqueda y exploración de trabajos para usuarios no autenticados
- Mostrar información completa de cada vacante
- Facilitar la búsqueda con filtros avanzados
- Mantener consistencia visual con el resto del sitio

## Arquitectura General

### Estructura de Archivos

```
app/trabajo/
  ├── page.tsx (página principal con listado)
  └── [id]/
      └── page.tsx (página de detalle del trabajo)

components/LandingComponents/Trabajos/
  ├── TrabajosHero.tsx
  ├── TrabajosSearchFilters.tsx
  └── TrabajosList.tsx
```

### Layout

- Usa `LandingLayout` (consistente con `/salarios`, `/empresas`)
- Paleta de colores: gradientes (blue, indigo, green, purple) y fondos suaves
- Animaciones GSAP para entrada de elementos

## Componentes

### 1. TrabajosHero

**Propósito:** Hero section con título y descripción, similar a otras landing pages.

**Contenido:**
- Título: "Encuentra tu Próximo Trabajo en Ciencias"
- Subtítulo: "Explora oportunidades en biotecnología, bioquímica, química e ingeniería química"
- Fondo: Gradientes suaves (blue-50, indigo-50, green-50) con blur circles decorativos

**Animaciones GSAP:**
- Título: fade in desde abajo con scale (opacity: 0→1, y: 50→0, scale: 0.95→1, duration: 1s, ease: "power3.out")
- Subtítulo: fade in con delay 0.2s (opacity: 0→1, y: 30→0, duration: 0.8s, ease: "power2.out")

**Layout:**
- Centrado, max-width 7xl
- Padding vertical: py-32
- Responsive: ajustes para mobile

### 2. TrabajosSearchFilters

**Propósito:** Sección centrada con búsqueda y filtros avanzados, ubicada antes del listado.

**Estructura:**

**Barra de búsqueda principal:**
- Input con icono de búsqueda (hugeicons `Search01Icon`)
- Placeholder: "Buscar por título, empresa o palabras clave"
- Estilo: Input de shadcn con padding izquierdo para el icono

**Filtros en grid responsive:**
- Grid: 2-3 columnas en desktop, 1 columna en mobile
- Filtros:
  1. **Ubicación**: Input con icono `MapPin` (hugeicons)
  2. **Modalidad**: Select (Remoto, Híbrido, Presencial, Todas)
  3. **Formato**: Select (Full Time, Part Time, Contrato, Todas)
  4. **Rango salarial mínimo**: Input numérico
  5. **Rango salarial máximo**: Input numérico
  6. **Experiencia**: Select (Junior, Semi Senior, Senior, Todas) - opcional
  7. **Categoría**: Select (Biotecnología, Bioquímica, Química, Ingeniería Química, etc.) - opcional

**Botones de acción:**
- "Buscar" (botón primario, destacado)
- "Limpiar filtros" (botón secundario)

**Diseño:**
- Card con fondo blanco, sombra suave, padding generoso
- Inputs y selects con estilos consistentes del proyecto
- Layout centrado, max-width 6xl
- Espaciado adecuado entre elementos

**Comportamiento:**
- Filtrado en tiempo real o al hacer clic en "Buscar" (a definir en implementación)
- Los filtros se mantienen en la URL como query params para compartir enlaces filtrados

### 3. TrabajosList

**Propósito:** Lista vertical de tarjetas de trabajo, una debajo de otra.

**Estructura de cada tarjeta:**

**Header:**
- Título de la vacante (h2, bold, tamaño grande)
- Nombre de la empresa (texto secundario, más pequeño)

**Información principal** (con iconos de hugeicons):
- **Ubicación**: Icono `Location05Icon` + texto
- **Modalidad**: Badge con color (Remoto/Híbrido/Presencial)
- **Formato**: Badge con color (Full Time/Part Time/Contrato)
- **Fecha de publicación**: Icono `Clock01Icon` + texto formateado
- **Rango salarial**: Icono `Cash02Icon` + texto (ej: "$2.500.000 - $3.500.000")

**Beneficios** (opcional):
- Iconos pequeños en fila horizontal
- Iconos: seguro de salud, vacaciones, formación, equipo, etc.
- Solo se muestran si el trabajo tiene beneficios

**Acción:**
- Botón "Ver detalles" que navega a `/trabajo/[id]`
- Estilo: botón secundario o outline

**Diseño visual:**
- Card con fondo blanco, borde sutil, sombra suave
- Hover: elevación de sombra, transición suave
- Espaciado generoso entre elementos
- Badges con colores del proyecto (verde, morado, azul)
- Layout responsive: padding adecuado en mobile

**Comportamiento:**
- Animaciones GSAP al entrar en viewport (fade in desde abajo con stagger)
- Estado vacío: mensaje cuando no hay resultados ("No se encontraron trabajos con los filtros seleccionados")
- Paginación o scroll infinito (a definir en implementación)

**Estados:**
- Loading: skeletons mientras carga
- Empty: mensaje informativo

### 4. Página de Detalle `/trabajo/[id]`

**Propósito:** Vista pública completa del trabajo, similar a `/dashboard/employee/job/[id]` pero sin funcionalidades del dashboard.

**Estructura:**

**Header:**
- Breadcrumb: Inicio > Trabajos > [Título del trabajo]
- Botón "Volver a trabajos" (opcional, puede ser parte del breadcrumb)

**Hero del trabajo:**
- Título grande (h1)
- Nombre de la empresa
- Ubicación, modalidad, formato (badges)
- Rango salarial
- Fecha de publicación

**Contenido principal** (layout de 2 columnas en desktop):
- **Columna izquierda (70%)**:
  - Descripción completa del trabajo
  - Requisitos (lista)
  - Responsabilidades (lista)
  - Beneficios (con iconos, similar a la tarjeta del listado)
- **Columna derecha (30%)**:
  - Card fija con información resumida
  - Botón CTA principal "Postular ahora"
    - Si usuario no autenticado: redirige a login con redirect a esta página
    - Si usuario autenticado: redirige a formulario de postulación o dashboard

**Footer:**
- Información de la empresa (nombre, logo si existe, link a perfil de empresa si existe)

**Diseño:**
- Layout centrado, max-width 7xl
- Mismo estilo visual que el resto del sitio
- Responsive: en mobile, columna única (stack vertical)

**SEO:**
- Metadata dinámica con título, descripción del trabajo
- Open Graph tags
- Structured data (JobPosting schema JSON-LD)

## Datos y Estado

### Estructura de Datos del Trabajo

```typescript
type Trabajo = {
  id: string
  titulo: string
  empresa: string
  ubicacion: string
  modalidad: "remoto" | "hibrido" | "presencial"
  formato: "full-time" | "part-time" | "contrato"
  fechaPublicacion: Date
  rangoSalarial: {
    min: number
    max: number
    moneda: "CLP"
  }
  beneficios?: Array<{
    tipo: "salud" | "vacaciones" | "formacion" | "equipo" | "otro"
    label: string
  }>
  descripcion: string
  requisitos: string[]
  responsabilidades: string[]
  categoria?: string
  experiencia?: "junior" | "mid" | "senior"
}
```

### Estado de Filtros

```typescript
type FiltrosTrabajos = {
  query: string // búsqueda por texto
  ubicacion: string
  modalidad: "todas" | "remoto" | "hibrido" | "presencial"
  formato: "todas" | "full-time" | "part-time" | "contrato"
  salarioMin: number | null
  salarioMax: number | null
  experiencia: "todas" | "junior" | "mid" | "senior"
  categoria: string | null
}
```

## Consideraciones Técnicas

### Performance
- Lazy loading de imágenes si las hay
- Paginación o virtualización para listas grandes
- Debounce en búsqueda en tiempo real

### Accesibilidad
- Labels apropiados en inputs
- Navegación por teclado
- ARIA labels donde sea necesario
- Contraste adecuado en badges y textos

### SEO
- URLs amigables: `/trabajo/[id]` con slug del título
- Metadata dinámica por trabajo
- Structured data (JobPosting)
- Sitemap actualizado

## Próximos Pasos

1. Crear estructura de archivos
2. Implementar `TrabajosHero` con animaciones GSAP
3. Implementar `TrabajosSearchFilters` con lógica de filtrado
4. Implementar `TrabajosList` con tarjetas y animaciones
5. Crear página de detalle `/trabajo/[id]`
6. Integrar con fuente de datos (API o mock data)
7. Agregar SEO y structured data
8. Testing y ajustes visuales

## Notas de Iteración

- El diseño puede ajustarse durante la implementación
- Se priorizará la experiencia de usuario y consistencia visual
- Los filtros opcionales (experiencia, categoría) pueden simplificarse si no hay datos suficientes
