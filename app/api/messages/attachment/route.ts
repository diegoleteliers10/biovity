import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "path requerido" }, { status: 400 })
  }
  if (!path.startsWith("messages/")) {
    return NextResponse.json({ error: "Path no permitido" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.from(BUCKET).download(path)

  if (error || !data) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  })
}
