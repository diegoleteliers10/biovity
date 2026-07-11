import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export type AILogEntry = {
  id: string
  userId: string
  endpoint: string
  inputHash: string
  outputSummary: string | null
  toolsCalled: unknown[]
  flagged: boolean
  durationMs: number | null
  timestamp: string
  metadata: unknown | null
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10)))
  const search = searchParams.get("search")?.trim()
  const flaggedFilter = searchParams.get("flagged")
  const endpointFilter = searchParams.get("endpoint")?.trim()
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  if (flaggedFilter === "true" || flaggedFilter === "false") {
    conditions.push(`flagged = $${paramIndex}`)
    params.push(flaggedFilter === "true")
    paramIndex++
  }

  if (endpointFilter) {
    conditions.push(`endpoint ILIKE $${paramIndex}`)
    params.push(`%${endpointFilter}%`)
    paramIndex++
  }

  if (search) {
    conditions.push(`(user_id ILIKE $${paramIndex} OR endpoint ILIKE $${paramIndex})`)
    params.push(`%${search}%`)
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "TRUE"

  const countResult = await R.tryPromise({
    try: () =>
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM ai_interaction_logs WHERE ${whereClause}`,
        params
      ),
    catch: (cause) => new DbError({ operation: "count_ai_logs", cause }),
  })

  if (countResult.isErr()) {
    console.error("[admin/ai-logs] Error:", countResult.error)
    return NextResponse.json({ error: "Error al obtener logs de AI" }, { status: 500 })
  }

  const total = Number.parseInt(countResult.value.rows[0]?.count ?? "0", 10)

  const result = await R.tryPromise({
    try: () =>
      pool.query<{
        id: string
        user_id: string
        endpoint: string
        input_hash: string
        output_summary: string | null
        tools_called: unknown
        flagged: boolean
        duration_ms: number | null
        timestamp: Date
        metadata: unknown
      }>(
        `SELECT id, user_id, endpoint, input_hash, output_summary, tools_called, flagged, duration_ms, timestamp, metadata
         FROM ai_interaction_logs WHERE ${whereClause}
         ORDER BY timestamp DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
    catch: (cause) => new DbError({ operation: "list_ai_logs", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/ai-logs] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener logs de AI" }, { status: 500 })
  }

  const logs: AILogEntry[] = result.value.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    endpoint: row.endpoint,
    inputHash: row.input_hash,
    outputSummary: row.output_summary,
    toolsCalled: Array.isArray(row.tools_called) ? row.tools_called : [],
    flagged: row.flagged,
    durationMs: row.duration_ms,
    timestamp: row.timestamp?.toISOString() ?? new Date().toISOString(),
    metadata: row.metadata,
  }))

  return NextResponse.json({
    data: logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
