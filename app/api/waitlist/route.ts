import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"
import { sendWaitlistEmail, subscribeToResendAudience } from "@/lib/mail"
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

  const connection = await R.tryPromise({
    try: () => pool.connect(),
    catch: (cause) => new DbError({ operation: "connect_waitlist", cause }),
  })
  if (connection.isErr()) {
    console.error("Failed to connect for waitlist signup:", connection.error)
    return NextResponse.json({ error: "Error al guardar. Intenta de nuevo." }, { status: 500 })
  }

  const client = connection.value
  const signup = await R.tryPromise({
    try: async () => {
      await client.query("BEGIN")
      const inserted = await client.query<{ id: string }>(
        "INSERT INTO waitlist (email, role) VALUES ($1, $2) RETURNING id",
        [email, role]
      )
      const waitlistId = inserted.rows[0].id
      await sendWaitlistEmail(email, role, waitlistId, client)
      await client.query("COMMIT")
      return waitlistId
    },
    catch: (cause) => new DbError({ operation: "create_waitlist_and_queue_email", cause }),
  })

  if (signup.isErr()) {
    await R.tryPromise({ try: () => client.query("ROLLBACK"), catch: () => undefined })
    client.release()
    const cause = signup.error.cause
    if (cause && typeof cause === "object" && "code" in cause && cause.code === "23505") {
      return NextResponse.json(
        { error: "Ya estás registrado. Pronto te contactaremos." },
        { status: 409 }
      )
    }
    console.error("Failed to save waitlist signup and email:", signup.error)
    return NextResponse.json(
      {
        error: "No pudimos guardar tu registro. Intenta de nuevo.",
      },
      { status: 500 }
    )
  }
  client.release()

  // Audience subscription is optional and does not delay the confirmed queue write.
  subscribeToResendAudience(email).catch((err) => {
    console.error("Failed to subscribe waitlist user to Resend Audience:", err)
  })

  return NextResponse.json({ success: true })
}
