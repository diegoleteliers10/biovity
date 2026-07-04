import { Result as R } from "better-result"
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export const revalidate = 60

async function fetchCount(query: string, values: unknown[] = []): Promise<number | null> {
  const result = await R.tryPromise({
    try: () => pool.query<{ total: string }>(query, values),
    catch: () => null,
  })

  if (result.isErr() || !result.value) return null
  const total = result.value.rows[0]?.total
  const parsed = Number.parseInt(total ?? "", 10)
  return Number.isFinite(parsed) ? parsed : null
}

export async function GET() {
  const [organizations, specialties] = await Promise.all([
    fetchCount(`SELECT COUNT(*)::text AS total FROM organization`),
    fetchCount(
      `
        SELECT COUNT(DISTINCT profession)::text AS total
        FROM "user"
        WHERE type = 'professional'
          AND profession IS NOT NULL
          AND LENGTH(TRIM(profession)) > 0
      `
    ),
  ])

  return NextResponse.json({ organizations, specialties })
}

