import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const professionalId = body?.professionalId as string | undefined

  if (!professionalId || typeof professionalId !== "string" || !professionalId.trim()) {
    return NextResponse.json(
      { error: "professionalId es requerido" },
      { status: 400 }
    )
  }

  const recruiterId = session.user.id

  try {
    const existingRes = await fetch(
      `${API_BASE}/api/v1/chats/recruiter/${recruiterId}`
    )
    const existingData = await existingRes.json().catch(() => null)
    const chats = existingRes.ok
      ? (Array.isArray(existingData) ? existingData : existingData?.data ?? [])
      : []

    const existing = chats.find(
      (c: { professionalId?: string }) => c.professionalId === professionalId
    )
    if (existing) {
      return NextResponse.json(existing)
    }

    const createRes = await fetch(`${API_BASE}/api/v1/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recruiterId, professionalId }),
    })

    const createData = await createRes.json().catch(() => null)
    if (!createRes.ok) {
      return NextResponse.json(
        { error: getErrorMessage(createData, "Error al crear el chat") },
        { status: createRes.status >= 500 ? 500 : 400 }
      )
    }

    const chat = createData?.data ?? createData
    if (!chat?.id) {
      return NextResponse.json(
        { error: "Respuesta inválida del servidor" },
        { status: 500 }
      )
    }

    return NextResponse.json(chat)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al crear el chat" },
      { status: 500 }
    )
  }
}
