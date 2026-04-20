import { NextResponse } from "next/server"

const content = `# Trabajos en Ciencias - Biovity Chile

Portal de empleo especializado en biotecnología, bioquímica, química, ingeniería química y salud. Encuentra tu próxima oportunidad en el sector científico chileno.

## Ofertas de Empleo

### Áreas Principales

- **Biotecnología**: Investigación, desarrollo, producción biotecnológica
- **Bioquímica**: Análisis, control de calidad, I+D
- **Química**: Síntesis, caracterización, producción química
- **Ingeniería Química**: Procesos, optimización, scale-up
- **Salud**: Farmacéutica, dispositivos médicos, ensayos clínicos
- **Alimentos**: Seguridad alimentaria, I+D, producción
- **Medioambiente**: Gestión ambiental, remediación, sostenibilidad

### Tipos de Contrato

- Tiempo completo
- Medio tiempo
- Pasantías
- Prácticas profesionales
- Freelance / proyecto

### Modalidades

- Presencial
- Híbrido
- Remoto (pocas opciones)

### Experiencia Requerida

- Sin experiencia (entry level)
- 1-3 años
- 3-5 años
- 5+ años (senior)

### Rangos Salariales

- $500.000 - $800.000 CLP
- $800.000 - $1.200.000 CLP
- $1.200.000 - $2.000.000 CLP
- $2.000.000+ CLP

## Beneficios Comunes

- Seguro de salud
- Aguinaldo
- Día libre cumpleaños
- Work-life balance
- Oportunidades de formación
- Ambiente científico

## Cómo Postular

1. **Crea tu cuenta** en Biovity como profesional
2. **Completa tu perfil** con experiencia y formación
3. **Busca ofertas** usando filtros (área, ubicación, salario)
4. **Aplica directamente** con un clic
5. **Recibe alertas** de nuevas ofertas matching

## Consejos para Postulantes

- Usa palabras clave científicas en tu CV
- Destaca experiencia de laboratorio
- Incluye publicaciones si aplica
- Mantén tu perfil actualizado
- Configura alertas de búsqueda

## Preguntas Frecuentes

**Es Biovity gratis para profesionales?**

Sí, Biovity es completamente gratuito para profesionales y estudiantes. Puedes buscar empleos, aplicar a ofertas, guardar favoritos y recibir alertas sin costo.

**Qué tipos de trabajos encuentro en Biovity?**

Ofertas en biotecnología, bioquímica, química, ingeniería química, salud, alimentos y áreas relacionadas. Incluye posiciones de investigación, desarrollo, control de calidad, producción y más.

**Cómo funciona el matching por IA?**

Nuestro algoritmo analiza tu perfil, experiencia y preferencias para sugerirte las ofertas más relevantes, ahorrándote tiempo en la búsqueda.

**Puedo filtrar por ubicación o modalidad?**

Sí, puedes filtrar por ciudad o región, modalidad (presencial/híbrido/remoto), nivel de experiencia, área científica y rango salarial.

## Empresas que Contratan

- Laboratorios farmacéuticos
- Empresas de biotecnología
- Centros de investigación
- Universidades
- Empresas químicas
- Industria alimentaria
- Startups científico-tech

## Estadísticas del Portal

- Miles de ofertas activas
- Cientos de empresas buscando
- Miles de profesionales registrados

## Recursos

- Estudio de Salarios: Conoce rangos salariales por área
- Para Empresas: Si buscas talento científico

## Búsquedas Populares

empleo biotecnología Chile, trabajo bioquímica, ofertas empleo química, trabajo ingeniería química, empleo laboratorio, trabajo investigación científica, portal empleo científico Chile, buscar trabajo ciencias, trabajo remoto Chile ciencia

## Contacto

- Sitio web: https://biovity.cl/trabajos
- Región: Chile
- Sector: Empleo científico`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
