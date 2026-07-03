import { type NextRequest, NextResponse } from "next/server"
import { insertContactMessage } from "@/lib/db/contact"
import { checkRateLimit } from "@/lib/rate-limit"
import { organizationContactSchema } from "@/lib/validations"

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown"
}

/**
 * POST /api/contact
 *
 * Persists "Contacta con ventas" submissions from the /empresas landing page
 * (components/landing/empresas/CTAContacto.tsx) into the contact_messages table.
 *
 * - Rate limited per IP (5 req/min via @/lib/rate-limit)
 * - Validated with organizationContactSchema
 * - Stores the message in Postgres; can be extended later to email via Resend/SendGrid
 */
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

  const parsed = organizationContactSchema.safeParse(body)

  if (!parsed.success) {
    const error = parsed.error.issues[0]
    return NextResponse.json({ error: error?.message || "Datos inválidos" }, { status: 400 })
  }

  const { nombre, apellido, email, telefono, empresa, mensaje } = parsed.data

  const result = await insertContactMessage({
    nombre,
    apellido,
    email,
    telefono: telefono ?? null,
    empresa,
    mensaje,
  })

  if (result.isErr()) {
    console.error("[api/contact] DB error:", result.error)
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Intenta de nuevo." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
