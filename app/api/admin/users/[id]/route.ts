import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { updateUser } from "@/lib/api/users"
import { auth, isAdminSession } from "@/lib/auth"
import { ApiError } from "@/lib/errors"

const updateAdminUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    type: z.enum(["professional", "organization", "admin"]).optional(),
  })
  .strict()

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const parsedBody = await Result.tryPromise(() => request.json())
  if (parsedBody.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }

  const parsedUpdates = updateAdminUserSchema.safeParse(parsedBody.value)
  if (!parsedUpdates.success) {
    return NextResponse.json({ error: "Datos de usuario inválidos" }, { status: 400 })
  }
  if (Object.keys(parsedUpdates.data).length === 0) {
    return NextResponse.json({ error: "Datos de usuario inválidos" }, { status: 400 })
  }

  const { id: userId } = await params
  const result = await updateUser(userId, parsedUpdates.data, request.headers)
  if (result.isErr()) {
    const status = result.error instanceof ApiError ? result.error.status : 502
    return NextResponse.json({ error: result.error.message }, { status })
  }

  return NextResponse.json({ success: true })
}
