import { NextResponse } from "next/server"

const content = `# Biovity - Portal de Empleo Científico en Chile

Biovity es la plataforma de empleo especializada en biotecnología, bioquímica, química, ingeniería química y salud en Chile.

## Misión

Conectar talento científico con oportunidades significativas, facilitando el reclutamiento y la búsqueda de empleo en el sector de biociencias chileno.

## Características Principales

- **Bolsa de Empleo**: Miles de ofertas en ciencias, biotecnología, química e ingeniería química
- **Matching por IA**: Algoritmo que conecta perfiles con ofertas relevantes
- **Estudio de Salarios**: Datos actualizados de remuneraciones en biociencias
- **ATS Especializado**: Herramientas de reclutamiento para empresas científicas

## Estadísticas

- Más de 500 profesionales registrados
- Más de 100 empresas en la plataforma
- Miles de ofertas publicadas

## Categorías de Empleo

- Biotecnología
- Bioquímica
- Química
- Ingeniería Química
- Salud y Farmacéutica
- Alimentos y Nutrición
- Medioambiente

## Tecnologías Utilizadas

- React, Next.js, TypeScript
- TailwindCSS para estilos
- PostgreSQL con Supabase
- Better Auth para autenticación

## Estadísticas del Portal

El portal conecta a profesionales del sector científico con empresas que buscan talento especializado en biociencias.

## Tipos de Búsqueda

empleo biotecnología Chile, trabajo bioquímica, ofertas empleo química, trabajo ingeniería química, empleo laboratorio, trabajo investigación científica, portal empleo científico Chile, buscar trabajo ciencias, salarios biociencias Chile

## Empresas que Contratan

- Laboratorios farmacéuticos
- Empresas de biotecnología
- Centros de investigación
- Universidades
- Empresas químicas
- Industria alimentaria
- Startups científico-tech

## Beneficios Ofrecidos

- Seguro de salud
- Aguinaldo
- Día libre cumpleaños
- Work-life balance
- Oportunidades de formación
- Ambiente científico

## Modalidades de Trabajo

- Presencial
- Híbrido
- Remoto

## Contacto

- Sitio web: https://biovity.cl
- Región: Chile
- Sector: Empleo científico / Biotech`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
