import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { normalizeAILog } from "@/lib/admin/ai-logs"
import { aiLogsQuerySchema } from "@/lib/admin/ai-logs-schema"
import type { AILogRow } from "@/lib/admin/ai-logs-types"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = aiLogsQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: "Filtros inválidos" }, { status: 400 })
  }
  const { page, limit, search, flagged: flaggedFilter, endpoint: endpointFilter } = parsed.data
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  if (flaggedFilter === "true" || flaggedFilter === "false") {
    conditions.push(`l.flagged = $${paramIndex}`)
    params.push(flaggedFilter === "true")
    paramIndex++
  }

  if (endpointFilter) {
    conditions.push(`l.endpoint ILIKE $${paramIndex}`)
    params.push(`%${endpointFilter}%`)
    paramIndex++
  }

  if (search) {
    conditions.push(
      `(l.user_id ILIKE $${paramIndex} OR l.endpoint ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`
    )
    params.push(`%${search}%`)
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "TRUE"

  const countResult = await R.tryPromise({
    try: () =>
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM ai_interaction_logs l LEFT JOIN "user" u ON u.id::text = l.user_id WHERE ${whereClause}`,
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
      pool.query<AILogRow>(
        `SELECT l.id, l.user_id, u.name AS user_name, u.email AS user_email, u.type::text AS user_type,
                l.endpoint, l.tools_called, l.flagged, l.duration_ms, l.timestamp, l.metadata
         FROM ai_interaction_logs l LEFT JOIN "user" u ON u.id::text = l.user_id WHERE ${whereClause}
         ORDER BY l.timestamp DESC, l.id DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
    catch: (cause) => new DbError({ operation: "list_ai_logs", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/ai-logs] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener logs de AI" }, { status: 500 })
  }

  const logs = result.value.rows.map(normalizeAILog)

  return NextResponse.json({
    data: logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
