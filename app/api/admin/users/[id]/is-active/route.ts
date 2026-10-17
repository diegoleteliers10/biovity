import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getUser, updateUser } from "@/lib/api/users"
import { auth, isAdminSession } from "@/lib/auth"
import { ApiError } from "@/lib/errors"

const updateActiveSchema = z.object({ isActive: z.boolean() }).strict()

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const parsedBody = await Result.tryPromise(() => request.json())
  if (parsedBody.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }

  const parsedActive = updateActiveSchema.safeParse(parsedBody.value)
  if (!parsedActive.success) {
    return NextResponse.json({ error: "isActive debe ser un booleano" }, { status: 400 })
  }

  const { id: userId } = await params
  const currentUserResult = await getUser(userId, request.headers)
  if (currentUserResult.isErr()) {
    const status =
      currentUserResult.error instanceof ApiError ? currentUserResult.error.status : 502
    return NextResponse.json({ error: currentUserResult.error.message }, { status })
  }

  const result = await updateUser(userId, parsedActive.data, request.headers)
  if (result.isErr()) {
    const status = result.error instanceof ApiError ? result.error.status : 502
    return NextResponse.json({ error: result.error.message }, { status })
  }

  const wasActive = currentUserResult.value.isActive
  if (!parsedActive.data.isActive || !wasActive) {
    const revoked = await Result.tryPromise(() =>
      auth.$context.then((context) => context.internalAdapter.deleteUserSessions(userId))
    )
    if (revoked.isErr()) {
      console.error("[admin/users/is-active] Session revocation failed", revoked.error)
      return NextResponse.json({
        success: true,
        isActive: parsedActive.data.isActive,
        sessionRevocationPending: true,
        message: "El estado se guardó. No se pudieron revocar las sesiones.",
      })
    }
  }

  return NextResponse.json({ success: true, isActive: parsedActive.data.isActive })
}
