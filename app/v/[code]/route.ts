import { NextResponse } from "next/server"
import { consumeShortLink } from "@/lib/db/short-links"

export async function GET(_request: Request, props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params
  if (!/^[a-zA-Z0-9]{8}$/.test(code)) {
    return new NextResponse("Link no encontrado", { status: 404 })
  }

  const result = await consumeShortLink(code)
  if (result.isErr()) {
    console.error("[v] Error resolving short link:", result.error)
    return new NextResponse("Error al abrir el enlace", { status: 500 })
  }
  if (!result.value) {
    return new NextResponse("Link no encontrado", { status: 404 })
  }

  return NextResponse.redirect(result.value, 307)
}
