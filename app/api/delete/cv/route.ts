import { Result } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getResumeByUserId, updateResume } from "@/lib/api/resumes"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_CV_BUCKET ?? "biovity_cv"

export async function DELETE(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const resumeId = searchParams.get("resumeId")
  const cvPath = searchParams.get("path")
  if (!resumeId || !cvPath) {
    return NextResponse.json({ error: "Currículum y ruta requeridos" }, { status: 400 })
  }

  const resume = await getResumeByUserId(session.user.id, requestHeaders)
  if (resume.isErr()) {
    return NextResponse.json({ error: resume.error.message }, { status: 500 })
  }
  if (
    !resume.value ||
    resume.value.id !== resumeId ||
    resume.value.cvFile?.path !== cvPath ||
    !cvPath.startsWith("cv/") ||
    !cvPath.endsWith(`_${session.user.id}.pdf`) ||
    cvPath.includes("..")
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const admin = Result.try(() => getSupabaseAdmin())
  if (admin.isErr()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }
  const cleared = await updateResume(resumeId, { cvFile: null }, requestHeaders)
  if (cleared.isErr()) {
    return NextResponse.json({ error: cleared.error.message }, { status: 500 })
  }
  const { error } = await admin.value.storage.from(BUCKET).remove([cvPath])
  if (error && error.message !== "The resource was not found") {
    await updateResume(resumeId, { cvFile: resume.value.cvFile }, requestHeaders)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
