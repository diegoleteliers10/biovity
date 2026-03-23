import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const SIGNED_URL_EXPIRES_IN = 60 * 60

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path || !path.startsWith("cv/")) {
    return NextResponse.json({ error: "Path inválido" }, { status: 400 })
  }

  const userId = session.user.id
  if (!path.includes(`_${userId}.`)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Error al generar URL" }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
