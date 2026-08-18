import { Result as R, type Result } from "better-result"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

const CODE_LENGTH = 8
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function randomCode(length: number): string {
  let code = ""
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

export function buildShortLinkUrl(code: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"
  return `${siteUrl}/v/${code}`
}

export async function createShortLink(url: string): Promise<Result<string, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        for (let attempt = 0; attempt < 3; attempt++) {
          const code = randomCode(CODE_LENGTH)
          const result = await client.query(
            "INSERT INTO short_link (code, url) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING",
            [code, url]
          )
          if (result.rowCount === 1) return code
        }
        throw new Error("Could not generate a unique short link code")
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "create_short_link", cause }),
  })
}

export async function consumeShortLink(code: string): Promise<Result<string | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        const result = await client.query<{ url: string }>(
          "DELETE FROM short_link WHERE code = $1 RETURNING url",
          [code]
        )
        return result.rows[0]?.url ?? null
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "consume_short_link", cause }),
  })
}
