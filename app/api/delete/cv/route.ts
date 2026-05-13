import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { updateResume } from "@/lib/api/resumes"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"

export async function DELETE(_request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(_request.url)
  const resumeId = searchParams.get("resumeId")
  const cvPath = searchParams.get("path")

  if (!cvPath) {
    return NextResponse.json({ error: "Path requerido" }, { status: 400 })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const { error } = await supabase.storage.from(BUCKET).remove([cvPath])

  if (error && error.message !== "The resource was not found") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (resumeId) {
    const result = await updateResume(resumeId, { cvFile: undefined })
    if (result.isErr()) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
