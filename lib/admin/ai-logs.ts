import { aiLogMetadataSchema } from "./ai-logs-schema"
import type { AILogEntry, AILogRow } from "./ai-logs-types"

export function normalizeAILog(row: AILogRow): AILogEntry {
  const parsed = aiLogMetadataSchema.safeParse(row.metadata)
  const metadata = parsed.success ? parsed.data : null
  const complete = metadata?.auditVersion === 2 && metadata.durationScope === "complete"
  const executed = metadata?.auditVersion === 2 && metadata.toolsScope === "executed"
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    userType: row.user_type,
    endpoint: row.endpoint,
    flagged: row.flagged,
    status: metadata?.status ?? null,
    errorCode: metadata?.errorCode ?? null,
    provider: metadata?.provider ?? null,
    modelId: metadata?.modelId ?? metadata?.model ?? metadata?.engine ?? null,
    inputTokens: metadata?.inputTokens ?? null,
    outputTokens: metadata?.outputTokens ?? null,
    durationMs:
      complete &&
      row.duration_ms !== null &&
      Number.isFinite(row.duration_ms) &&
      row.duration_ms >= 0
        ? row.duration_ms
        : null,
    toolsCalled:
      executed &&
      Array.isArray(row.tools_called) &&
      row.tools_called.every((tool) => typeof tool === "string")
        ? row.tools_called
        : null,
    timestamp: row.timestamp.toISOString(),
  }
}
