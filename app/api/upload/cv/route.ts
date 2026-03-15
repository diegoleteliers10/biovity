import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const CV_PATH_PREFIX = "cv"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id
  const formData = await request.formData()
  const file = formData.get("file") as File | null
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf"
  if (ext !== "pdf") {
    return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80)
  const path = `${CV_PATH_PREFIX}/${safeName}_${userId}.${ext}`

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const refreshUrl = `/api/cv/signed-url?path=${encodeURIComponent(data.path)}`

  return NextResponse.json({
    url: refreshUrl,
    path: data.path,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  })
}
