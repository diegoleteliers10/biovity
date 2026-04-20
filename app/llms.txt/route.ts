import { NextResponse } from "next/server"

const content = `# Biovity

> Biovity es la plataforma de empleo especializada en biotecnología, bioquímica, química, ingeniería química y salud en Chile. Conectamos profesionales y estudiantes con oportunidades científicas significativas.

## Secciones Principales

- [Inicio](https://biovity.cl): Portal principal con ofertas de empleo en ciencias
- [Trabajos](https://biovity.cl/trabajos): Bolsa de empleo científica con filtros por área, ubicación y salario
- [Salarios](https://biovity.cl/salarios): Estudio de sueldos en biociencias (datos 2024-2025)
- [Para Empresas](https://biovity.cl/empresas): ATS especializado para reclutar talento científico
- [Nosotros](https://biovity.cl/nosotros): Misión y equipo detrás de Biovity
- [Planes](https://biovity.cl/planes): Precios para empresas y organizaciones
- [Lista de Espera](https://biovity.cl/lista-espera): Únete a la comunidad científica

## Recursos para Agentes AI

Biovity ofrece versiones en Markdown de sus páginas principales para facilitar el procesamiento por agentes AI:

- [Inicio (Markdown)](https://biovity.cl/index-md)
- [Empresas (Markdown)](https://biovity.cl/empresas-md)
- [Trabajos (Markdown)](https://biovity.cl/trabajos-md)
- [Salarios (Markdown)](https://biovity.cl/salarios-md)
- [Nosotros (Markdown)](https://biovity.cl/nosotros-md)
- [Planes (Markdown)](https://biovity.cl/planes-md)

## Datos Estructurales

- **Industria**: Empleo científico / Biotech
- **Ubicación**: Chile
- **Audiencia**: Profesionales, estudiantes y empresas del sector biocientífico
- **Idioma**: Español (Chile)

## Términos de Búsqueda Relacionados

empleo biotecnología Chile, trabajo bioquímica, ofertas química, ingeniería química Chile, salario científico, contratar científicos Chile, ATS biotecnología, portal empleo científico`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
