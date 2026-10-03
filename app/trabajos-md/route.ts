import { NextResponse } from "next/server"

export function GET() {
  const content = `# Empleos en biotecnología y ciencias en Chile\n\nConsulta las ofertas vigentes en el portal. Usa sus filtros para comparar área, ubicación, modalidad y remuneración publicada por cada empresa.\n\n[Ver ofertas actuales](https://biovity.cl/jobs)\n\n[Consejos para preparar tu CV y entrevista](https://biovity.cl/career-tips)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
