import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const assignmentSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("claim"),
      nextAction: z.string().trim().min(1).max(160),
      targetDate: z.iso.date(),
    })
    .strict(),
  z
    .object({
      action: z.literal("schedule_follow_up"),
      nextAction: z.string().trim().min(1).max(160),
      targetDate: z.iso.date(),
    })
    .strict(),
  z.object({ action: z.literal("release") }).strict(),
])
const uuidSchema = z.string().uuid()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const parsedBody = await Result.tryPromise(() => request.json())
  if (parsedBody.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }
  const parsedAction = assignmentSchema.safeParse(parsedBody.value)
  if (!parsedAction.success) {
    return NextResponse.json(
      { error: "Completa la acción y la fecha de seguimiento" },
      { status: 400 }
    )
  }
  const { organizationId } = await params
  if (!uuidSchema.safeParse(organizationId).success) {
    return NextResponse.json({ error: "La organización debe tener un ID válido" }, { status: 400 })
  }

  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/operations-queue/${organizationId}/assignment`,
    request.headers,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedAction.data),
    }
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
