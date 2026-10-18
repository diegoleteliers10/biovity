import { Result } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import { parseChatResponse } from "@/lib/api/chats"
import { auth } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const InputSchema = z.object({
  professionalId: z.string().uuid(),
  organizationId: z.string().uuid(),
})

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  if (session.user.type !== "organization") {
    return NextResponse.json(
      { error: "Solo una organización puede iniciar el chat" },
      { status: 403 }
    )
  }
  const organizationId = (session.user as { organizationId?: string }).organizationId
  if (!organizationId) {
    return NextResponse.json({ error: "Organización no válida" }, { status: 403 })
  }
  const body = await Result.tryPromise({
    try: () => request.json(),
    catch: () => new Error("Invalid chat JSON"),
  })
  const parsed = InputSchema.safeParse(body.isOk() ? body.value : null)
  if (!parsed.success) return NextResponse.json({ error: "Candidato inválido" }, { status: 400 })
  if (parsed.data.organizationId !== organizationId) {
    return NextResponse.json({ error: "Organización no autorizada" }, { status: 403 })
  }
  const created = await fetchJsonWithSession<unknown>(`${API_BASE}/api/v1/chats`, requestHeaders, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recruiterId: session.user.id,
      professionalId: parsed.data.professionalId,
      organizationId,
    }),
    cache: "no-store",
  })
  if (created.isErr()) {
    const status = created.error._tag === "ApiError" ? created.error.status : 502
    return NextResponse.json({ error: "No se pudo crear el chat" }, { status })
  }
  const result = parseChatResponse(created.value)
  if (!result) return NextResponse.json({ error: "Respuesta de chat inválida" }, { status: 502 })
  return NextResponse.json(result, { status: 201 })
}
