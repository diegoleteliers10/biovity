import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const broadcastSchema = z.object({
  organizationId: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(2000),
  requestId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const rawBody = await request.text()
  const jsonBody = Result.try((): unknown => JSON.parse(rawBody))
  if (jsonBody.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }

  const input = broadcastSchema.safeParse(jsonBody.value)
  if (!input.success) {
    return NextResponse.json({ error: "Los datos del aviso no son válidos" }, { status: 400 })
  }

  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/notifications/system/broadcast`,
    request.headers,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.data),
    }
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
