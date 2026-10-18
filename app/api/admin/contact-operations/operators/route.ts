import { type NextRequest, NextResponse } from "next/server"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session))
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/contact-inquiries/operators`,
    request.headers
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
