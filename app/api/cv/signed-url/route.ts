import { Result } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getResumeByUserId } from "@/lib/api/resumes"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_CV_BUCKET ?? "biovity_cv"

export async function GET(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const path = new URL(request.url).searchParams.get("path")
  const ownerId = path?.match(
    /^cv\/[^/]+_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.pdf$/i
  )?.[1]
  if (!path || !ownerId || path.includes("..")) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 })
  }
  const resume = await getResumeByUserId(ownerId, requestHeaders)
  if (resume.isErr()) {
    const status = resume.error._tag === "ApiError" ? resume.error.status : 500
    return NextResponse.json({ error: "No se pudo abrir el CV" }, { status })
  }
  const storedCv = resume.value?.cvFile
  const storedPath =
    storedCv?.path ??
    (storedCv?.url ? new URLSearchParams(storedCv.url.split("?")[1]).get("path") : null)
  if (storedPath !== path) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const admin = Result.try(() => getSupabaseAdmin())
  if (admin.isErr()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }
  const { data, error } = await admin.value.storage.from(BUCKET).createSignedUrl(path, 60)
  if (error || !data) {
    return NextResponse.json({ error: "No se pudo abrir el CV" }, { status: 500 })
  }
  const response = NextResponse.redirect(data.signedUrl)
  response.headers.set("Cache-Control", "private, no-store")
  return response
}
