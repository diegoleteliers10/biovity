import { createHash, randomUUID } from "node:crypto"
import { Result as R } from "better-result"
import type { Pool, PoolClient } from "pg"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export type EmailType =
  | "verification"
  | "password_reset"
  | "welcome"
  | "waitlist"
  | "waitlist_invite"
  | "organization_invite"
  | "offer_letter"
  | "offer_response"
  | "organization_verification"
  | "organization_weekly_digest"

export type OfferResponseEmailInput = {
  eventKey: string
  recipientId: string
  to: string
  subject: string
  html: string
}

export type OrganizationVerificationEmailInput = {
  eventKey: string
  requestId: string
  to: string
  subject: string
  html: string
}

export type OfferResponseEmailEnqueueResult =
  | { kind: "inserted" }
  | { kind: "replayed" }
  | { kind: "conflict" }
  | { kind: "missing" }

export type OrganizationVerificationEmailEnqueueResult =
  | { kind: "inserted" }
  | { kind: "replayed" }
  | { kind: "conflict" }
  | { kind: "missing" }

type EnqueueEmailInput = {
  type: EmailType
  to: string
  recipientUserId?: string
  subject: string
  html: string
  attachments?: { filename: string; content: string }[]
  idempotencyKey?: string
  source?: { type: "waitlist"; id: string }
  expiresAt?: Date
}

export async function enqueueEmail(
  input: EnqueueEmailInput,
  queryable: Pool | PoolClient = pool
): Promise<boolean> {
  const id = randomUUID()
  const result = await R.tryPromise({
    try: () =>
      queryable.query(
        `INSERT INTO email_outbox
           (id, email_type, idempotency_key, source_type, source_id,
            recipient_user_id, recipient_email, from_email, subject, html, attachments, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb,
            COALESCE($12, now() + interval '24 hours'))
         ON CONFLICT (idempotency_key) DO NOTHING`,
        [
          id,
          input.type,
          input.idempotencyKey ?? null,
          input.source?.type ?? null,
          input.source?.id ?? null,
          input.recipientUserId ?? null,
          input.to,
          process.env.EMAIL_FROM || "Biovity <no-reply@biovity.cl>",
          input.subject,
          input.html,
          JSON.stringify(input.attachments ?? []),
          input.expiresAt ?? null,
        ]
      ),
    catch: (cause) => new DbError({ operation: "enqueue_email", cause }),
  })
  if (result.isErr()) return Promise.reject(result.error)
  return result.value.rowCount === 1
}

export async function enqueueOfferResponseEmail(
  input: OfferResponseEmailInput,
  queryable: Pool | PoolClient = pool
): Promise<OfferResponseEmailEnqueueResult> {
  const payloadHash = offerResponsePayloadHash(input)
  const inserted = await R.tryPromise({
    try: () =>
      queryable.query(
        `INSERT INTO email_outbox
           (id, email_type, idempotency_key, source_type, source_id, recipient_user_id,
            recipient_email, from_email, subject, html, attachments, expires_at)
         VALUES ($1, 'offer_response', $2, 'offer_response_payload_hash',
            $3::uuid, $4::uuid, $5, $6, $7, $8, '[]'::jsonb,
            now() + interval '30 days')
         ON CONFLICT (idempotency_key) DO NOTHING`,
        [
          randomUUID(),
          input.eventKey,
          payloadHash,
          input.recipientId,
          input.to,
          process.env.EMAIL_FROM || "Biovity <no-reply@biovity.cl>",
          input.subject,
          input.html,
        ]
      ),
    catch: (cause) => new DbError({ operation: "enqueue_offer_response_email", cause }),
  })
  if (inserted.isErr()) return Promise.reject(inserted.error)
  if (inserted.value.rowCount === 1) return { kind: "inserted" }

  const existing = await R.tryPromise({
    try: () =>
      queryable.query<{
        email_type: string
        source_type: string | null
        source_id: string | null
        recipient_user_id: string | null
        recipient_email: string
        subject: string
        html: string | null
      }>(
        `SELECT email_type, source_type, source_id, recipient_user_id, recipient_email, subject, html
         FROM email_outbox WHERE idempotency_key = $1 LIMIT 1`,
        [input.eventKey]
      ),
    catch: (cause) => new DbError({ operation: "read_offer_response_email", cause }),
  })
  if (existing.isErr()) return Promise.reject(existing.error)
  const row = existing.value.rows[0]
  if (!row) return { kind: "missing" }
  if (
    row.email_type !== "offer_response" ||
    row.source_type !== "offer_response_payload_hash" ||
    row.source_id !== payloadHash ||
    row.recipient_user_id !== input.recipientId ||
    row.recipient_email !== input.to ||
    row.subject !== input.subject ||
    (row.html !== null && row.html !== input.html)
  ) {
    return { kind: "conflict" }
  }
  return { kind: "replayed" }
}

export async function enqueueOrganizationVerificationEmail(
  input: OrganizationVerificationEmailInput,
  queryable: Pool | PoolClient = pool
): Promise<OrganizationVerificationEmailEnqueueResult> {
  const inserted = await R.tryPromise({
    try: () =>
      queryable.query(
        `INSERT INTO email_outbox
           (id, email_type, idempotency_key, source_type, source_id,
            recipient_email, from_email, subject, html, attachments, expires_at)
         VALUES ($1, 'organization_verification', $2, 'organization_verification',
            $3::uuid, $4, $5, $6, $7, '[]'::jsonb, now() + interval '30 days')
         ON CONFLICT (idempotency_key) DO NOTHING`,
        [
          randomUUID(),
          input.eventKey,
          input.requestId,
          input.to,
          process.env.EMAIL_FROM || "Biovity <no-reply@biovity.cl>",
          input.subject,
          input.html,
        ]
      ),
    catch: (cause) => new DbError({ operation: "enqueue_organization_verification_email", cause }),
  })
  if (inserted.isErr()) return Promise.reject(inserted.error)
  if (inserted.value.rowCount === 1) return { kind: "inserted" }

  const existing = await R.tryPromise({
    try: () =>
      queryable.query<{
        email_type: string
        source_type: string | null
        source_id: string | null
        recipient_email: string
        subject: string
        html: string | null
      }>(
        `SELECT email_type, source_type, source_id, recipient_email, subject, html
         FROM email_outbox WHERE idempotency_key = $1 LIMIT 1`,
        [input.eventKey]
      ),
    catch: (cause) => new DbError({ operation: "read_organization_verification_email", cause }),
  })
  if (existing.isErr()) return Promise.reject(existing.error)
  const row = existing.value.rows[0]
  if (!row) return { kind: "missing" }
  if (
    row.email_type !== "organization_verification" ||
    row.source_type !== "organization_verification" ||
    row.source_id !== input.requestId ||
    row.recipient_email !== input.to ||
    row.subject !== input.subject ||
    (row.html !== null && row.html !== input.html)
  ) {
    return { kind: "conflict" }
  }
  return { kind: "replayed" }
}

function offerResponsePayloadHash(input: OfferResponseEmailInput): string {
  const bytes = createHash("sha256")
    .update(`${input.recipientId}\0${input.to}\0${input.subject}\0${input.html}`)
    .digest()
    .subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString("hex")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
