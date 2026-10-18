import { type NextRequest, NextResponse } from "next/server"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session))
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { id } = await params
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  const body = await request.json()
  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/contact-inquiries/${id}`,
    request.headers,
    { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
