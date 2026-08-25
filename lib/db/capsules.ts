import { Result as R, type Result } from "better-result"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"
import type { CapsuleProgress, Certificate } from "@/lib/types/capsulas"

export async function getCapsuleProgress(
  userId: string,
  capsuleSlug: string
): Promise<Result<CapsuleProgress | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        const { rows } = await client.query(
          "SELECT * FROM capsule_progress WHERE user_id = $1 AND capsule_slug = $2",
          [userId, capsuleSlug]
        )
        return (rows[0] as CapsuleProgress) ?? null
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "get_capsule_progress", cause }),
  })
}

export async function upsertCapsuleProgress(
  userId: string,
  capsuleSlug: string,
  data: { completed?: boolean; quiz_passed?: boolean; quiz_score?: number }
): Promise<Result<CapsuleProgress, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        const { rows } = await client.query(
          `INSERT INTO capsule_progress (user_id, capsule_slug, completed, quiz_passed, quiz_score, updated_at)
           VALUES ($1, $2, $3, $4, $5, now())
           ON CONFLICT (user_id, capsule_slug) DO UPDATE SET
             completed = COALESCE($3, capsule_progress.completed),
             quiz_passed = COALESCE($4, capsule_progress.quiz_passed),
             quiz_score = COALESCE($5, capsule_progress.quiz_score),
             updated_at = now()
           RETURNING *`,
          [
            userId,
            capsuleSlug,
            data.completed ?? false,
            data.quiz_passed ?? false,
            data.quiz_score ?? null,
          ]
        )
        return rows[0] as CapsuleProgress
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "upsert_capsule_progress", cause }),
  })
}

export async function createCertificate(
  userId: string,
  capsuleSlug: string,
  capsuleTitle: string
): Promise<Result<Certificate, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        const { rows } = await client.query(
          `INSERT INTO certificates (user_id, capsule_slug, capsule_title)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING
           RETURNING *`,
          [userId, capsuleSlug, capsuleTitle]
        )
        return rows[0] as Certificate
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "create_certificate", cause }),
  })
}

export async function getCertificate(
  userId: string,
  capsuleSlug: string
): Promise<Result<Certificate | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        const { rows } = await client.query(
          "SELECT * FROM certificates WHERE user_id = $1 AND capsule_slug = $2",
          [userId, capsuleSlug]
        )
        return (rows[0] as Certificate) ?? null
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "get_certificate", cause }),
  })
}
