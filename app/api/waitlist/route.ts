import { NextRequest, NextResponse } from "next/server"
import { insertWaitlistEntry } from "@/lib/db/waitlist"
import { checkRateLimit } from "@/lib/rate-limit"

const MAX_EMAIL_LENGTH = 254

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
    const { email, role } = body as { email?: string; role?: string }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const validRoles = ["professional", "empresa"]
    const roleVal = role && validRoles.includes(role) ? role : "professional"

    await insertWaitlistEntry(trimmedEmail, roleVal)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[waitlist] Error:", err)
    return NextResponse.json(
      { error: "Error al guardar. Intenta de nuevo." },
      { status: 500 }
    )
  }
}
