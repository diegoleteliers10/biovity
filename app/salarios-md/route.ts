import { NextResponse } from "next/server"
import { salariesMarkdown } from "@/lib/seo/landing-markdown"

export function GET() {
  const content = `# Sueldos en biotecnología y ciencias en Chile\n\nEstos valores son rangos orientativos de la página actual. No representan una encuesta salarial verificada ni garantizan una remuneración. Los montos están en pesos chilenos (CLP). Confirma si una oferta corresponde a sueldo bruto o líquido.\n\n${salariesMarkdown()}\n\n[Comparar rangos y experiencia](https://biovity.cl/salaries)\n\n[Compartir tu salario](https://biovity.cl/share-salary)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
