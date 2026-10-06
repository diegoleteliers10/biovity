import type { LanguageModelUsage } from "ai"
import type { ResolvedModel } from "../byok/resolver"

export type ExplanationAuditContext = {
  userId: string
  organizationId: string
  jobId: string
  revisionId: string
  startTime: number
}
export type ExplanationAuditOutcome =
  | { status: "ready"; usage: LanguageModelUsage }
  | { status: "failed" | "aborted"; errorCode: string; usage?: LanguageModelUsage }
export type ExplanationAuditModel = Pick<ResolvedModel, "provider" | "modelId" | "source">
