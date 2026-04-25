import { NextResponse } from "next/server"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path || !path.startsWith("cv/")) {
    return NextResponse.json({ error: "Path inválido" }, { status: 400 })
  }

  if (!SUPABASE_URL) {
    return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL no configurado" }, { status: 500 })
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${normalizedPath}`
  const upstream = await fetch(publicUrl)
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "No se pudo abrir el CV" },
      { status: upstream.status || 500 }
    )
  }

  const headers = new Headers()
  const contentType = upstream.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  const contentDisposition = upstream.headers.get("content-disposition")
  if (contentDisposition) headers.set("content-disposition", contentDisposition)
  const cacheControl = upstream.headers.get("cache-control")
  if (cacheControl) headers.set("cache-control", cacheControl)

  return new Response(upstream.body, {
    status: 200,
    headers,
  })
}
