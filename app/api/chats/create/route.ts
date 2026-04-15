import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

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

  const existingResult = await fetchJson<unknown>(
    `${API_BASE}/api/v1/chats/recruiter/${recruiterId}`
  )

  if (existingResult.isErr()) {
    console.error("Error fetching existing chats:", existingResult.error)
    return NextResponse.json({ error: "Error al obtener chats existentes" }, { status: 500 })
  }

  const existingData = existingResult.value
  let chats: { professionalId?: string }[] = []

  if (Array.isArray(existingData)) {
    chats = existingData as { professionalId?: string }[]
  } else if (existingData && typeof existingData === "object") {
    const obj = existingData as Record<string, unknown>
    if (Array.isArray(obj.data)) {
      chats = obj.data as { professionalId?: string }[]
    }
  }

  const existing = chats.find((c) => c.professionalId === professionalId)

  if (existing) {
    return NextResponse.json(existing)
  }

  const createResult = await fetchJson<unknown>(`${API_BASE}/api/v1/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recruiterId, professionalId }),
  })

  if (createResult.isErr()) {
    const err = createResult.error
    console.error("Error creating chat:", err)
    const status = err._tag === "ApiError" && err.status >= 500 ? 500 : 400
    return NextResponse.json({ error: "Error al crear el chat" }, { status })
  }

  const createData = createResult.value
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
}
