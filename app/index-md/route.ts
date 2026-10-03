import { NextResponse } from "next/server"

export function GET() {
  const content = `# Biovity: empleo científico en Chile\n\nPortal de empleo especializado en biotecnología, bioquímica, química, ingeniería y salud.\n\n- [Ofertas de empleo](https://biovity.cl/jobs)\n- [Reclutamiento para empresas](https://biovity.cl/companies)\n- [Planes y precios](https://biovity.cl/plans)\n- [Rangos salariales orientativos](https://biovity.cl/salaries)\n- [Consejos de carrera](https://biovity.cl/career-tips)\n- [Aprende bioinformática e IA](https://biovity.cl/learn)\n- [Blog](https://biovity.cl/blog)\n- [Sobre Biovity](https://biovity.cl/about)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
