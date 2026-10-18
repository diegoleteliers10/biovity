import { timingSafeEqual } from "node:crypto"
import { z } from "zod"
import { enqueueOfferResponseEmail } from "@/lib/email-outbox"

const payloadSchema = z
  .object({
    eventKey: z.string().regex(/^offer-response:[0-9a-f-]{36}$/i),
    recipientId: z.string().uuid(),
    to: z.string().email().max(320),
    subject: z.string().min(1).max(200),
    html: z.string().min(1).max(20_000),
  })
  .strict()

function isAuthorized(request: Request): boolean {
  const secret = process.env.EMAIL_OUTBOX_SECRET
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !token) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = await request.json().then(
    (value: unknown) => ({ kind: "json" as const, value }),
    () => ({ kind: "invalid_json" as const })
  )
  if (parsed.kind === "invalid_json") {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const payload = payloadSchema.safeParse(parsed.value)
  if (!payload.success) {
    return Response.json({ error: "Invalid offer response email" }, { status: 400 })
  }

  const result = await enqueueOfferResponseEmail(payload.data).then(
    (value) => ({ kind: "enqueued" as const, value }),
    () => ({ kind: "storage_error" as const })
  )
  if (result.kind === "storage_error" || result.value.kind === "missing") {
    return Response.json({ error: "Email queue unavailable" }, { status: 503 })
  }
  if (result.value.kind === "conflict") {
    return Response.json({ error: "Event key payload mismatch" }, { status: 409 })
  }
  return Response.json(
    { accepted: true, replayed: result.value.kind === "replayed" },
    { status: result.value.kind === "inserted" ? 202 : 200 }
  )
}
