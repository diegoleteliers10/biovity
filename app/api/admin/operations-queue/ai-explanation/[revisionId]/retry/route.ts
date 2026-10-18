import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const uuidSchema = z.string().uuid()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ revisionId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { revisionId } = await params
  if (!uuidSchema.safeParse(revisionId).success) {
    return NextResponse.json({ error: "El ID de la evaluación no es válido" }, { status: 400 })
  }

  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/operations-queue/ai-explanation/${revisionId}/retry`,
    request.headers,
    { method: "POST" }
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
