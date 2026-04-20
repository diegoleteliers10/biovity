import { NextResponse } from "next/server"

const content = `# Biovity para Empresas - Recluta Talento Científico

Biovity ofrece a las empresas del sector científico herramientas especializadas para encontrar y reclutar talento cualificado en biotecnología, bioquímica, química e ingeniería química.

## Problema que Resolvemos

Las empresas científicas enfrentan dificultades para encontrar profesionales cualificados. Los portales de empleo genéricos no proporcionan el filtrado específico que necesita el sector biocientífico.

## Solución ATS Especializada

Nuestro ATS (Applicant Tracking System) está diseñado específicamente para empresas del sector científico:

- **Filtrado Avanzado**: Filtra por especialidad científica, nivel de experiencia y formación
- **Matching con IA**: Algoritmo que conecta tu oferta con candidatos cualificados
- **Gestión de Candidaturas**: Dashboard completo para seguir el proceso de selección
- **Portal del Candidato**: Los profesionales pueden aplicar directamente

## Planes Disponibles

### Plan Gratuito

Para empresas que inician en el reclutamiento científico.

- Hasta 3 ofertas activas
- Acceso básico a candidatos
- Dashboard de postulaciones

### Plan Profesional

Para empresas en crecimiento.

- Ofertas ilimitadas
- Posición destacada en resultados de búsqueda
- Acceso completo a base de candidatos
- Analytics avanzado
- Soporte prioritario

### Plan Enterprise

Para organizaciones que requieren soluciones de reclutamiento a medida.

- Todo lo incluye Profesional
- Integraciones API personalizadas
- Onboarding dedicado
- SLA garantizado

## Características Principales

- Dashboard de métricas en tiempo real
- Calendario de entrevistas integrado
- Mensajería con candidatos
- Acceso a base de datos de profesionales
- Employer branding personalizado

## Proceso de Contratación

1. **Publica tu oferta**: Define requisitos, ubicación, salario
2. **Recibe postulaciones**: Candidato aplica o el sistema hace match
3. **Gestiona entrevistas**: Agenda desde el calendario integrado
4. **Cierra la posición**: Marca ofertas como completadas

## Sectores que Atendemos

- Biotecnología y farma
- Química industrial
- Alimentos y bebidas
- Energías renovables
- Laboratorios de análisis
- Centros de investigación

## Ventajas frente a portales genéricos

- Audiencia especializada en ciencias
- Filtrado específico por disciplina
- Datos de salarios actualizados
- Comunidad de profesionales cualificados

## Estadísticas

- 50 por ciento reducción en tiempo de contratación
- 35 por ciento mejora en calidad de candidatos
- 40 por ciento reducción en costo por hire vs portales genéricos

## ROI Esperado

Empresas que usan Biovity reportan mejor retorno de inversión comparado con portales genéricos de empleo.

## Testimonios

Before Biovity, reclutamos un científico tomaba 4 meses promedio. Ahora tenemos candidatos qualificados en semanas.

El matching por IA nos ayuda a filtrar candidatos cualificados sin perder tiempo en aplicaciones no relevantes.

## Cómo Empezar

1. Crea tu cuenta de empresa en Biovity
2. Selecciona tu plan según tus necesidades
3. Publica tu primera oferta y comienza a recibir postulaciones
4. Convierte candidatos en empleados

## Contacto

- Sitio web: https://biovity.cl/empresas
- Región: Chile
- Sector: Reclutamiento científico / Biotech

## Términos de Búsqueda

reclutar científicos Chile, ATS biotecnología, contratar bioquímicos, reclutamiento químicos, portal empleo empresas científicas, talento científico Chile, contratar ingenieros químicos, software reclutamiento ciencias, pricing ATS Chile`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
