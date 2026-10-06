import type { z } from "zod"
import type { aiLogSchema } from "./ai-logs-schema"
export type AILogEntry = z.infer<typeof aiLogSchema>
export type AILogRow = {
  id: string
  user_id: string
  user_name: string | null
  user_email: string | null
  user_type: string | null
  endpoint: string
  tools_called: unknown
  flagged: boolean
  duration_ms: number | null
  timestamp: Date
  metadata: unknown
}
