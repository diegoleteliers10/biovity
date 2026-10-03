import { NextResponse } from "next/server"
import { pricingMarkdown } from "@/lib/seo/landing-markdown"

export function GET() {
  const content = `# Planes y precios de reclutamiento científico\n\nPrecios mensuales en pesos chilenos. La página ofrece un descuento de 20 % al seleccionar facturación anual.\n\n${pricingMarkdown()}\n\n[Planes vigentes](https://biovity.cl/plans)`
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  })
}
