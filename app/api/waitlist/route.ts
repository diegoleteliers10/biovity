import { type NextRequest, NextResponse } from "next/server"
import { insertWaitlistEntry } from "@/lib/db/waitlist"
import { checkRateLimit } from "@/lib/rate-limit"
import { waitlistSchema } from "@/lib/validations"

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown"
}

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const { allowed, retryAfter } = checkRateLimit(identifier)
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta más tarde." },
      { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
    )
  }

  const body = await request.json()

  const parsed = waitlistSchema.safeParse(body)

  if (!parsed.success) {
    const error = parsed.error.issues[0]
    return NextResponse.json({ error: error?.message || "Datos inválidos" }, { status: 400 })
  }

  const { email, role } = parsed.data

  const result = await insertWaitlistEntry(email, role)

  if (result.isErr()) {
    const error = result.error
    if (
      error._tag === "DbError" &&
      error.cause &&
      typeof error.cause === "object" &&
      "code" in error.cause &&
      (error.cause as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Ya estás registrado. Pronto te contactaremos." },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Error al guardar. Intenta de nuevo." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
