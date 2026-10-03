import { NextResponse } from "next/server"

export function GET() {
  const content = `# Sobre Biovity\n\nBiovity conecta profesionales y estudiantes de biotecnología, bioquímica, química, ingeniería y salud con oportunidades de empleo científico en Chile.\n\n[Sobre Biovity](https://biovity.cl/about)\n\n[Ofertas de empleo](https://biovity.cl/jobs)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
