import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const res = await fetch(`${API_BASE}/api/v1/organizations`, {
      next: { revalidate: 30 },
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const msg =
        data && typeof data === "object" && "message" in data
          ? String(data.message)
          : "Error al obtener organizaciones"
      return NextResponse.json({ error: msg }, { status: res.status })
    }

    const orgs = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? []
    return NextResponse.json({ data: orgs })
  } catch (err) {
    console.error("[admin/organizations] Error:", err)
    return NextResponse.json(
      { error: "Error al obtener organizaciones" },
      { status: 500 }
    )
  }
}
