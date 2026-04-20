import { createHash } from "crypto"
import { pool } from "@/lib/db"

export interface AIInteractionLog {
  id: string
  userId: string
  endpoint: string
  inputHash: string
  outputSummary: string
  toolsCalled: string[]
  flagged: boolean
  durationMs: number
  timestamp: Date
  metadata?: Record<string, unknown>
}

export class AIAuditService {
  private static instance: AIAuditService

  private constructor() {}

  static getInstance(): AIAuditService {
    if (!AIAuditService.instance) {
      AIAuditService.instance = new AIAuditService()
    }
    return AIAuditService.instance
  }

  async log(interaction: Omit<AIInteractionLog, "id" | "timestamp">): Promise<string> {
    const id = crypto.randomUUID()
    const timestamp = new Date()

    const query = `
      INSERT INTO ai_interaction_logs (
        id, user_id, endpoint, input_hash, output_summary,
        tools_called, flagged, duration_ms, timestamp, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `

    const values = [
      id,
      interaction.userId,
      interaction.endpoint,
      interaction.inputHash,
      interaction.outputSummary.slice(0, 200),
      JSON.stringify(interaction.toolsCalled),
      interaction.flagged,
      interaction.durationMs,
      timestamp,
      interaction.metadata ? JSON.stringify(interaction.metadata) : null,
    ]

    await pool.query(query, values)
    return id
  }

  async queryByUser(userId: string, from?: Date, to?: Date): Promise<AIInteractionLog[]> {
    let query = "SELECT * FROM ai_interaction_logs WHERE user_id = $1"
    const values: unknown[] = [userId]
    let paramIndex = 2

    if (from) {
      query += ` AND timestamp >= $${paramIndex}`
      values.push(from)
      paramIndex++
    }

    if (to) {
      query += ` AND timestamp <= $${paramIndex}`
      values.push(to)
      paramIndex++
    }

    query += " ORDER BY timestamp DESC LIMIT 100"

    const result = await pool.query(query, values)
    return result.rows.map(this.mapRow)
  }

  async queryFlagged(from?: Date, to?: Date): Promise<AIInteractionLog[]> {
    let query = "SELECT * FROM ai_interaction_logs WHERE flagged = true"
    const values: unknown[] = []
    let paramIndex = 1

    if (from) {
      query += ` AND timestamp >= $${paramIndex}`
      values.push(from)
      paramIndex++
    }

    if (to) {
      query += ` AND timestamp <= $${paramIndex}`
      values.push(to)
      paramIndex++
    }

    query += " ORDER BY timestamp DESC LIMIT 100"

    const result = await pool.query(query, values)
    return result.rows.map(this.mapRow)
  }

  private mapRow(row: Record<string, unknown>): AIInteractionLog {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      endpoint: row.endpoint as string,
      inputHash: row.input_hash as string,
      outputSummary: row.output_summary as string,
      toolsCalled: JSON.parse(row.tools_called as string),
      flagged: row.flagged as boolean,
      durationMs: row.duration_ms as number,
      timestamp: row.timestamp as Date,
      metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
    }
  }

  static hashInput(input: string): string {
    return createHash("sha256").update(input).digest("hex")
  }
}

export const aiAuditService = AIAuditService.getInstance()
