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
  try {
    const identifier = getClientIdentifier(request)
    const { allowed, retryAfter } = checkRateLimit(identifier)
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta más tarde." },
        { status: 429, headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined }
      )
    }

    const body = await request.json()

    // Validate with Zod schema
    const result = waitlistSchema.safeParse(body)

    if (!result.success) {
      const error = result.error.issues[0]
      return NextResponse.json({ error: error?.message || "Datos inválidos" }, { status: 400 })
    }

    const { email, role } = result.data

    await insertWaitlistEntry(email, role)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[waitlist] Error:", err)

    // PostgreSQL unique constraint violation (duplicate email)
    const isDuplicateEmail =
      err instanceof Error && "code" in err && (err as { code?: string }).code === "23505"

    if (isDuplicateEmail) {
      return NextResponse.json(
        { error: "Ya estás registrado. Pronto te contactaremos." },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: "Error al guardar. Intenta de nuevo." }, { status: 500 })
  }
}
