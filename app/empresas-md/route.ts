import { NextResponse } from "next/server"
import { pricingMarkdown } from "@/lib/seo/landing-markdown"

export function GET() {
  const content = `# Reclutamiento científico y ATS para empresas\n\nBiovity ofrece publicación de vacantes y gestión de candidatos para biotecnología, bioquímica, química, ingeniería y salud en Chile.\n\n${pricingMarkdown()}\n\n[Funciones y preguntas frecuentes](https://biovity.cl/companies)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
