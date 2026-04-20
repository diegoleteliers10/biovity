import { NextResponse } from "next/server"

const content = `# Nosotros - Biovity

Biovity es una plataforma chilena que conecta talento científico con oportunidades laborales significativas en el sector de biociencias.

## Nuestra Misión

Facilitar la conexión entre profesionales y estudiantes del sector científico con empresas que buscan talento cualificado en biotecnología, bioquímica, química, ingeniería química y salud.

## El Problema que Resolvemos

El mercado laboral científico chileno carece de plataformas especializadas. Los profesionales pierden tiempo aplicando a empleos genéricos, y las empresas no encuentran candidatos con las habilidades específicas que necesitan.

### Estadísticas del Problema

- 60 por ciento de científicos considera difícil encontrar empleo en su área
- 75 por ciento de empresas dice que reclutar talento científico toma más de 3 meses
- 40 por ciento de postulaciones son de candidatos no cualificados (portales genéricos)

## Nuestra Solución

Una plataforma diseñada específicamente para el sector biocientífico chileno:

- **Matching por IA**: Conectamos candidatos cualificados con ofertas relevantes
- **ATS Especializado**: Herramientas de reclutamiento diseñadas para empresas científicas
- **Datos de Mercado**: Salarios transpareny competencia para negociación justa
- **Comunidad**: Networking entre profesionales del sector

## Historia

Biovity nació en 2023 cuando un equipo de profesionales del sector científico decidió abordar los problemas de reclutamiento que habían experimentado en primera persona.

Fundadores con experiencia en:
- Biotecnología y pharma
- Investigación académica
- Startups de base científica
- Recursos humanos especializados

## Valores

### Enfoque Científico

Todo lo que hacemos está basado en datos y evidencia. Nuestras decisiones se guían por métricas, no por intuición.

### Transparencia

Precios claros, salarios públicos y proceso de selección transparente. Sin sorpresas.

### Comunidad

No somos solo una plataforma. Somos una comunidad de profesionales científicos que se apoyan mutuamente.

### Innovación

Implementamos tecnología para resolver problemas reales del mercado laboral científico.

## Equipo

Nuestro equipo combina experiencia en:
- Tecnología y desarrollo de producto
- Ciencias biológicas y químicas
- Recursos humanos y reclutamiento
- Estrategia empresarial

## Lo que nos Diferencia

1. **Enfoque sectorial**: No somos un portal genérico. Entendemos las necesidades específicas del sector biocientífico.

2. **Datos de calidad**: Nuestro estudio de salarios es el más completo del sector en Chile.

3. **Tecnología inteligente**: El matching por IA reduce tiempo de reclutamiento para empresas y aumenta precisión para candidatos.

4. **Comunidad activa**: Eventos, contenido educativo y networking para profesionales científicos.

## Cómo Ayudamos

### Para Profesionales

- Búsqueda de empleo especializada
- Alertas de nuevas ofertas matching
- Datos salariales para negociación
- Perfil profesional destacado

### Para Empresas

- Publicación de ofertas dirigida
- Candidato pre-seleccionado por IA
- Dashboard de reclutamiento
- Employer branding científico

## Estadísticas de Impacto

- Más de 500 profesionales registrados
- Más de 100 empresas usando la plataforma
- Miles de postulaciones procesadas
- Más de 50 por ciento reducción en tiempo de contratación

## Visión

Convertirnos en el referente nacional para el empleo científico chileno, facilitando que el talento de las biociencias encuentre su lugar en empresas que marquen la diferencia.

## Próximos Pasos

- Expansión a más sectores científicos
- Integración con instituciones académicas
- Programa de mentorship para entry-level
- Análisis de tendencias del mercado laboral científico

## Únete

- Crea tu cuenta profesional
- Registra tu empresa
- Únete a la lista de espera

## Contacto

- Sitio web: https://biovity.cl/nosotros
- Email: contacto@biovity.cl
- Región: Chile
- Sector: Empleo científico / Biotech

## Términos de Búsqueda

nosotros Biovity, misión Biovity, talento científico Chile, plataforma empleos ciencias, comunidad científica, sobre Biovity, equipo Biovity, historia biovity Chile`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
