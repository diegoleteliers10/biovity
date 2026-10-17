import { type NextRequest, NextResponse } from "next/server"
import { ADMIN_API_BASE, apiErrorResponse, responsePayload } from "@/lib/admin/contact-inquiries"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session))
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const query = new URL(request.url).searchParams
  const backendQuery = new URLSearchParams()
  for (const key of ["page", "limit", "search", "status", "assigneeId", "unassigned", "overdue"]) {
    const value = query.get(key)
    if (value) backendQuery.set(key, value)
  }
  const result = await fetchJsonWithSession<unknown>(
    `${ADMIN_API_BASE}/api/v1/admin/contact-inquiries?${backendQuery}`,
    request.headers
  )
  if (result.isErr()) return apiErrorResponse(result.error)
  return NextResponse.json(responsePayload(result.value))
}
