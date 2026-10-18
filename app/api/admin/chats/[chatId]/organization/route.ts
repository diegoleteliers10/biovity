import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import type {
  AdminLegacyChatDetail,
  AssignAdminChatOrganizationResult,
} from "@/lib/api/admin-chats"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isParticipant(value: unknown): value is AdminLegacyChatDetail["recruiter"] {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function isChatDetail(value: unknown): value is AdminLegacyChatDetail {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    (typeof value.updatedAt === "string" || value.updatedAt === null) &&
    isParticipant(value.recruiter) &&
    isParticipant(value.professional) &&
    Array.isArray(value.messages) &&
    value.messages.every(
      (message) =>
        isRecord(message) &&
        typeof message.id === "string" &&
        typeof message.senderId === "string" &&
        typeof message.senderName === "string" &&
        typeof message.content === "string" &&
        typeof message.createdAt === "string"
    )
  )
}

function isAssignment(value: unknown): value is AssignAdminChatOrganizationResult {
  return (
    isRecord(value) &&
    typeof value.chatId === "string" &&
    typeof value.organizationId === "string" &&
    typeof value.assignedById === "string" &&
    typeof value.assignedAt === "string"
  )
}

function findPayload<T>(raw: unknown, isPayload: (value: unknown) => value is T): T | null {
  let candidate = raw
  for (let depth = 0; depth < 4; depth += 1) {
    if (isPayload(candidate)) return candidate
    if (!isRecord(candidate) || !("data" in candidate)) return null
    candidate = candidate.data
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const { chatId } = await params
  const result = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/admin/legacy-chats/${encodeURIComponent(chatId)}`,
    request.headers
  )
  if (result.isErr()) {
    const status = result.error._tag === "ApiError" ? result.error.status : 502
    return NextResponse.json({ error: result.error.message }, { status })
  }
  const payload = findPayload(result.value, isChatDetail)
  if (!payload) {
    return NextResponse.json({ error: "Formato de respuesta inválido" }, { status: 502 })
  }
  return NextResponse.json(payload)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const parsedBody = await Result.tryPromise(() => request.json())
  if (parsedBody.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }
  const parsedInput = z
    .object({ organizationId: z.string().uuid() })
    .strict()
    .safeParse(parsedBody.value)
  if (!parsedInput.success) {
    return NextResponse.json({ error: "La organización debe tener un ID válido" }, { status: 400 })
  }

  const { chatId } = await params
  const result = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/admin/legacy-chats/${encodeURIComponent(chatId)}/organization`,
    request.headers,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedInput.data),
    }
  )
  if (result.isErr()) {
    const status = result.error._tag === "ApiError" ? result.error.status : 502
    return NextResponse.json({ error: result.error.message }, { status })
  }
  const payload = findPayload(result.value, isAssignment)
  if (!payload) {
    return NextResponse.json({ error: "Formato de respuesta inválido" }, { status: 502 })
  }
  return NextResponse.json(payload)
}
