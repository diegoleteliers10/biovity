# Rediseño de Página de Salarios - Biovity

**Fecha:** 24 de enero de 2026  
**Estado:** Diseño validado - Listo para implementación

## Resumen

Rediseño completo de la página `/salarios` para mejorar la organización del contenido y las visualizaciones de datos, siguiendo el formato y paleta de colores del proyecto Biovity.

## Objetivos

- Mejorar la organización del contenido con mejor flujo visual entre secciones
- Implementar gráficos modernos estilo evilcharts con efectos visuales (duotone bars con patrones y gráficos rounded/soft)
- Combinar narrativa textual con visualizaciones de datos
- Mantener coherencia con el diseño existente del proyecto

## Decisiones de Diseño

### Estructura General

1. **Secciones separadas con mejor flujo visual**
   - Cada sección en contenedor con fondo alternado (blanco/gris-50)
   - Separadores visuales distintivos: líneas de gradiente sutiles o formas geométricas
   - Espaciado generoso entre secciones (py-20 md:py-24)
   - Títulos de sección con tipografía serif y gradiente de color

2. **Hero mejorado**
   - Mantener animaciones GSAP existentes
   - Agregar estadísticas destacadas (3-4 números clave) con iconos
   - Ejemplos: "Sueldo promedio: $2.0M", "5 carreras analizadas", "7 industrias", "3 regiones"
   - Similar al estilo de HeroEmpresas

3. **Combinación texto + gráficos**
   - Cada sección incluye:
     - Introducción narrativa (2-3 párrafos) antes del gráfico
     - Gráfico principal con estilo duotone/rounded
     - Insights en texto debajo o al lado del gráfico (2-3 puntos clave con iconos)
     - Datos complementarios en cards pequeñas

### Gráficos y Visualizaciones

#### Estilo Visual
- **Duotone bars con patrones**: Gradientes duotone (50% opacidad, 50% sólido) con patrones de puntos en el fondo
- **Gráficos rounded/soft**: Bordes redondeados (radius 8-12px) en todos los gráficos
- **Efectos**: Patrones de puntos en fondos, animaciones suaves al scroll, hover effects en cards

#### Secciones Específicas

**1. Sueldos por Carrera**
- Gráfico de barras duotone con patrones de puntos en el fondo
- Layout: gráfico grande a la izquierda (2/3), cards informativas pequeñas a la derecha (1/3)
- Separador visual: línea de gradiente horizontal antes de la sección

**2. Sueldos por Industria**
- Gráfico de barras múltiples (mínimo, promedio, máximo) con estilo duotone
- Cada rango con su propio color y patrón
- Cards debajo del gráfico en grid 3 columnas
- Fondo alternado (gris-50)

**3. Sueldos por Región**
- Gráfico de barras horizontales con estilo rounded/soft
- Barras más gruesas y redondeadas, efecto de profundidad sutil
- Layout: gráfico a la izquierda, cards informativas a la derecha

**4. Impacto del Nivel Educativo**
- Pie chart rounded con bordes suaves y padding entre segmentos
- Efecto duotone en cada segmento del pie
- Cards informativas con barras de progreso redondeadas

**5. Conclusiones**
- Transformar en narrativa guiada con gráficos pequeños inline
- Cada conclusión con su mini-gráfico o visualización que la respalda
- Flujo: texto → insight → visualización → siguiente insight

### Paleta de Colores

- Usar `var(--chart-1)` a `var(--chart-5)` del sistema de diseño
- Gradientes sutiles en fondos de secciones
- Mantener coherencia con HeroEmpresas y otras landing pages

### Componentes a Crear/Mejorar

1. `SalariosHero` - Agregar stats cards con animaciones
2. `SalariosPorCarrera` - Texto intro + gráfico duotone + insights + cards
3. `SalariosPorIndustria` - Mismo patrón, gráfico múltiple duotone
4. `SalariosPorRegion` - Gráfico horizontal rounded + comparativas
5. `SalariosPorEducacion` - Pie chart rounded con duotone + análisis
6. `SalariosConclusiones` - Narrativa con mini-gráficos inline
7. `SectionDivider` - Componente reutilizable para separadores con gradiente

### Responsive Design

- Gráficos adaptativos con ChartContainer
- Layout de 2 columnas → 1 columna en móvil
- Texto legible en todos los tamaños

## Datos a Visualizar

### Tabla 1: Sueldos por Carrera y Nivel
- Bioinformática: Junior $1.5M, Senior $3.2M
- Ing. Civil Química: Junior $1.6M, Senior $3.05M
- Ing. Alimentos: Junior $1.0M, Senior $1.9M
- Ing. Biotecnología: Junior $1.075M, Senior $2.0M
- Química y Farmacia: Junior $1.7M, Senior $2.4M

### Tabla 2: Sueldos por Industria
- Minería: Min $1.8M, Max $3.5M, Promedio $2.65M
- Tech/Pharma: Min $1.5M, Max $3.2M, Promedio $2.35M
- Retail/Pharma: Min $1.7M, Max $2.4M, Promedio $2.05M
- Química/Procesos: Min $1.4M, Max $2.6M, Promedio $2.0M
- Farmacéutica: Min $1.2M, Max $2.2M, Promedio $1.7M
- Agroindustrial: Min $1.0M, Max $1.9M, Promedio $1.45M
- Academia/I+D: Min $0.95M, Max $1.8M, Promedio $1.375M

### Tabla 3: Comparativa por Región
- Antofagasta (Norte Minero): $2.65M
- Metropolitana (Servicios, Pharma, Tech): $1.895M
- O'Higgins/Maule (Agroindustrial): $1.45M

### Tabla 4: Impacto del Nivel Educativo
- Magíster: $2.55M
- Doctorado: $2.5M
- Sin Postgrado: $1.493M

## Referencias Técnicas

- Componentes base: `components/ui/chart.tsx`, `components/ui/duotone-bar-chart.tsx`
- Estilo de hero: `components/LandingComponents/Empresas/HeroEmpresas.tsx`
- Layout: `components/Layouts/LandingLayout.tsx`
- Paleta: `app/globals.css` (variables --chart-1 a --chart-5)

## Próximos Pasos

1. Implementar componentes mejorados
2. Integrar gráficos estilo evilcharts
3. Agregar animaciones y efectos visuales
4. Testing responsive
5. Validación final con usuario
