import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

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
  console.log("POST /api/chats/create called")
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const professionalId = body?.professionalId as string | undefined

  if (!professionalId || typeof professionalId !== "string" || !professionalId.trim()) {
    return NextResponse.json({ error: "professionalId es requerido" }, { status: 400 })
  }

  const recruiterId = session.user.id

  try {
    // Fetch existing chats for this recruiter
    const existingRes = await fetch(`${API_BASE}/api/v1/chats/recruiter/${recruiterId}`)
    const existingData = await existingRes.json().catch(() => null)

    if (!existingRes.ok) {
      console.error("Error fetching existing chats:", existingData)
      return NextResponse.json(
        { error: getErrorMessage(existingData, "Error al obtener chats existentes") },
        { status: 500 }
      )
    }

    // Handle both array and object response formats
    const chatsData = existingData
    let chats: { professionalId?: string }[] = []

    if (Array.isArray(chatsData)) {
      chats = chatsData as { professionalId?: string }[]
    } else if (chatsData && typeof chatsData === "object") {
      const obj = chatsData as Record<string, unknown>
      if (Array.isArray(obj.data)) {
        chats = obj.data as { professionalId?: string }[]
      }
    }

    const existing = chats.find(
      (c) => c.professionalId === professionalId
    )

    if (existing) {
      return NextResponse.json(existing)
    }

    // Create new chat
    const createRes = await fetch(`${API_BASE}/api/v1/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recruiterId, professionalId }),
    })

    const createData = await createRes.json().catch(() => null)

    if (!createRes.ok) {
      console.error("Error creating chat:", createRes.status, createData)
      return NextResponse.json(
        { error: getErrorMessage(createData, "Error al crear el chat") },
        { status: createRes.status >= 500 ? 500 : 400 }
      )
    }

    const chatWrapper = createData as Record<string, unknown> | null
    let chat: Record<string, unknown> | null = null

    if (chatWrapper && typeof chatWrapper === "object") {
      const wrapperData = chatWrapper.data
      if (wrapperData && typeof wrapperData === "object") {
        const innerWrapper = wrapperData as Record<string, unknown>
        const actualChat = innerWrapper.data
        if (actualChat && typeof actualChat === "object") {
          chat = actualChat as Record<string, unknown>
        }
      }
    }

    console.log("Chat wrapper:", chatWrapper)
    console.log("Chat extracted:", chat)

    if (!chat || typeof chat !== "object") {
      console.error("Chat response invalid (not object):", chat)
      return NextResponse.json({ error: "Respuesta inválida del servidor" }, { status: 500 })
    }

    const chatObj = chat as Record<string, unknown>
    if (!chatObj.id) {
      console.error("Chat response invalid (no id):", chat)
      return NextResponse.json({ error: "Respuesta inválida del servidor" }, { status: 500 })
    }

    return NextResponse.json(chat)
  } catch (err) {
    console.error("Catch error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al crear el chat" },
      { status: 500 }
    )
  }
}
