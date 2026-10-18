import { NextResponse } from "next/server"
import { salariesMarkdown } from "@/lib/seo/landing-markdown"

export function GET() {
  const content = `# Sueldos en biotecnología y ciencias en Chile\n\nEstas referencias provienen de MiFuturo.cl y de fuentes de mercado identificadas en cada carrera. Los datos de MiFuturo son ingresos brutos mensuales en pesos de septiembre de 2025. Las cohortes, percentiles y límites se describen en la página de metodología. Las referencias de mercado y de comunidad tienen sus propias etiquetas de base.\n\n${salariesMarkdown()}\n\n[Fuentes y metodología](https://biovity.cl/salaries)\n\n[Compartir tu sueldo](https://biovity.cl/share-salary)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
