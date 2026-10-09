import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"
import { getSupabaseAdmin } from "@/lib/supabase"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { id } = await params

  // The backend enforces participant access (candidate owner or org member).
  const result = await fetchJsonWithSession<
    { data?: { pdfPath?: string | null } } | { pdfPath?: string | null }
  >(`${API_BASE}/api/v1/offer-letters/${id}`, requestHeaders, { cache: "no-store" })
  if (result.isErr()) {
    const status = result.error._tag === "ApiError" ? result.error.status : 502
    return NextResponse.json({ error: "No autorizado" }, { status })
  }
  const value = result.value
  const offer =
    value && typeof value === "object" && "data" in value
      ? (value as { data: { pdfPath?: string | null } }).data
      : (value as { pdfPath?: string | null })
  const pdfPath = offer?.pdfPath
  if (!pdfPath) {
    return NextResponse.json({ error: "PDF no disponible" }, { status: 404 })
  }

  const supabase = getSupabaseAdmin()
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
  const { data, error } = await supabase.storage.from(bucket).download(pdfPath)
  if (error || !data) {
    return NextResponse.json({ error: "PDF no disponible" }, { status: 404 })
  }

  const bytes = await data.arrayBuffer()
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="carta-oferta-${id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
