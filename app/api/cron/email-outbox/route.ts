import { timingSafeEqual } from "node:crypto"
import { processEmailOutbox } from "@/lib/email-outbox-worker"

export const maxDuration = 60

function isAuthorized(request: Request): boolean {
  const secret = process.env.EMAIL_OUTBOX_SECRET
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !token) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: "No autorizado" }, { status: 401 })

  const result = await processEmailOutbox()
  if (result.status === "unavailable") {
    console.error("[email-outbox] RESEND_API_KEY is not configured")
    return Response.json({ error: "Email provider no disponible" }, { status: 503 })
  }

  const dead = result.deliveries.filter((item) => item.status === "dead").length
  if (dead > 0) console.error("[email-outbox] deliveries moved to dead letter", { dead })
  return Response.json(result, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  })
}
