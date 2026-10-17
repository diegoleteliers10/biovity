import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getResumeByUserId } from "@/lib/api/resumes"
import { fetchJsonWithSession } from "@/lib/result"
import { auth } from "@/lib/auth"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function DELETE(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const resumeId = searchParams.get("resumeId")
  const requestedPath = searchParams.get("path")
  if (!resumeId || !requestedPath) {
    return NextResponse.json({ error: "Currículum y ruta requeridos" }, { status: 400 })
  }

  const resumeResult = await getResumeByUserId(session.user.id, requestHeaders)
  if (resumeResult.isErr()) {
    const status = resumeResult.error._tag === "ApiError" ? resumeResult.error.status : 502
    return NextResponse.json({ error: "No se pudo cargar el currículum" }, { status })
  }
  const resume = resumeResult.value
  const path = resume?.cvFile?.path
  if (!resume || resume.id !== resumeId || path !== requestedPath) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const deleted = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/resumes/${resumeId}/cv`,
    requestHeaders,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedPath: path, expectedVersion: resume.cvVersion ?? 0 }),
    }
  )
  if (deleted.isErr()) {
    const status = deleted.error._tag === "ApiError" ? deleted.error.status : 502
    return NextResponse.json({ error: "No se pudo quitar el CV del perfil" }, { status })
  }

  return NextResponse.json({ success: true })
}
