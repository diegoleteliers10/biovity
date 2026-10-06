import type { AIInteractionLog } from "../audit"

export type AgentAuditStatus = "ready" | "failed" | "blocked" | "aborted"
export type AgentAuditRecord = Omit<AIInteractionLog, "id" | "timestamp">
export type AgentAuditContext = {
  userId: string
  inputHash: string
  startTime: number
  organizationId?: string
  jobOfferId?: string
}
export type AgentAuditModel = { provider: string; modelId: string; source: string }
export type AgentAuditUsage = { inputTokens?: number; outputTokens?: number }
