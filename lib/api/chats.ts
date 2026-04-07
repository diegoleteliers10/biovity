import { Result, Result as R } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { getErrorMessage } from "@/lib/result"

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
): Promise<Result<Chat[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/recruiter/${recruiterId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener los chats"),
      })
    )
  }

  const chats = extractChats(data)
  return R.ok(chats)
}

export async function getChatsByProfessional(
  professionalId: string
): Promise<Result<Chat[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/professional/${professionalId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener los chats"),
      })
    )
  }

  const chats = extractChats(data)
  return R.ok(chats)
}

export async function createOrFindChat(
  professionalId: string
): Promise<Result<Chat, ApiError | NetworkError>> {
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
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const errorMsg = (data as { error?: string })?.error ?? (data as { message?: string })?.message
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: typeof errorMsg === "string" ? errorMsg : "Error al crear el chat",
      })
    )
  }

  const chat = (data as { data?: Chat })?.data ?? (data as Chat)
  if (!chat?.id) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
  }

  return R.ok(chat as Chat)
}

export async function getChatById(
  chatId: string
): Promise<Result<Chat, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/${chatId}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener el chat"),
      })
    )
  }

  return R.ok(data as Chat)
}
