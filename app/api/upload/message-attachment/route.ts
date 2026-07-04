import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const ALLOWED_FILE_EXT = ["pdf", "doc", "docx", "txt", "zip", "rar"]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const chatId = formData.get("chatId") as string | null

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
  }
  if (!chatId) {
    return NextResponse.json({ error: "chatId requerido" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo supera los 10 MB" }, { status: 413 })
  }

  const isImage = file.type.startsWith("image/")
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (!isImage && !ALLOWED_FILE_EXT.includes(ext)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80)
  const path = `messages/${chatId}/${session.user.id}_${Date.now()}_${safeName}`

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    url: `/api/messages/attachment?path=${encodeURIComponent(data.path)}`,
    path: data.path,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  })
}
