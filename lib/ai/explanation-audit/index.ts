import { Result } from "better-result"
import { AIAuditService, aiAuditService } from "../audit"
import type {
  ExplanationAuditContext,
  ExplanationAuditModel,
  ExplanationAuditOutcome,
} from "./types"

function tokenCount(value: number | undefined): number | undefined {
  return value !== undefined && Number.isInteger(value) && value >= 0 ? value : undefined
}

export async function logExplanationAudit(
  context: ExplanationAuditContext,
  outcome: ExplanationAuditOutcome,
  model?: ExplanationAuditModel
): Promise<void> {
  const inputTokens = tokenCount(outcome.usage?.inputTokens)
  const outputTokens = tokenCount(outcome.usage?.outputTokens)
  const logged = await Result.tryPromise(() =>
    aiAuditService.log({
      userId: context.userId,
      endpoint: "/api/ai/score-explain",
      inputHash: AIAuditService.hashInput(
        JSON.stringify({ jobId: context.jobId, revisionId: context.revisionId })
      ),
      outputSummary: `Explanation request ${outcome.status}`,
      toolsCalled: [],
      flagged: false,
      durationMs: Math.max(0, Date.now() - context.startTime),
      metadata: {
        auditVersion: 2,
        status: outcome.status,
        durationScope: "complete",
        toolsScope: "executed",
        organizationId: context.organizationId,
        jobId: context.jobId,
        revisionId: context.revisionId,
        ...(model
          ? { provider: model.provider, modelId: model.modelId, source: model.source }
          : {}),
        ...(outcome.status === "ready" ? {} : { errorCode: outcome.errorCode }),
        ...(inputTokens === undefined ? {} : { inputTokens }),
        ...(outputTokens === undefined ? {} : { outputTokens }),
      },
    })
  )
  if (logged.isErr())
    console.error("Explanation audit write failed", { endpoint: "/api/ai/score-explain" })
}
