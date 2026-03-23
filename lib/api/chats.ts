const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type Chat = {
  id: string
  recruiterId: string
  professionalId: string
  lastMessage: string | null
  unreadCountRecruiter: number
  unreadCountProfessional: number
  createdAt: string
  updatedAt: string
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

function extractChats(payload: unknown): Chat[] {
  if (Array.isArray(payload)) return payload as Chat[]
  if (!payload || typeof payload !== "object") return []

  const p = payload as Record<string, unknown>
  const directData = p.data
  if (Array.isArray(directData)) return directData as Chat[]

  if (!directData || typeof directData !== "object") return []
  const nested = directData as Record<string, unknown>
  const nestedData = nested.data
  if (Array.isArray(nestedData)) return nestedData as Chat[]

  return []
}

export async function getChatsByRecruiter(
  recruiterId: string
): Promise<{ data: Chat[] } | { error: string }> {
  const url = `${API_BASE}/api/v1/chats/recruiter/${recruiterId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener los chats") }
  }

  const chats = extractChats(data)
  return { data: chats }
}

export async function getChatsByProfessional(
  professionalId: string
): Promise<{ data: Chat[] } | { error: string }> {
  const url = `${API_BASE}/api/v1/chats/professional/${professionalId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener los chats") }
  }

  const chats = extractChats(data)
  return { data: chats }
}

export async function createOrFindChat(
  professionalId: string
): Promise<{ data: Chat } | { error: string }> {
  const base =
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")

  let res: Response
  try {
    res = await fetch(`${base}/api/chats/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ professionalId }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al crear el chat") }
  }

  const chat = data?.data ?? data
  if (!chat?.id) {
    return { error: "Respuesta inválida" }
  }

  return { data: chat as Chat }
}

export async function getChatById(chatId: string): Promise<{ data: Chat } | { error: string }> {
  const url = `${API_BASE}/api/v1/chats/${chatId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener el chat") }
  }

  return { data: data as Chat }
}
