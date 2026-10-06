import { Result } from "better-result"
import type {
  AgentAuditContext,
  AgentAuditModel,
  AgentAuditRecord,
  AgentAuditStatus,
  AgentAuditUsage,
} from "./types"

function tokenCount(value: number | undefined): number | undefined {
  return value !== undefined && Number.isInteger(value) && value >= 0 ? value : undefined
}

export function createAgentAudit(
  context: AgentAuditContext,
  log: (record: AgentAuditRecord) => Promise<string>,
  now: () => number = Date.now
) {
  let model: AgentAuditModel | undefined
  let failed = false
  let completion: Promise<void> | undefined
  const tools = new Set<string>()

  function finish(status: AgentAuditStatus, usage?: AgentAuditUsage): Promise<void> {
    if (completion) return completion
    const finalStatus = status === "ready" && failed ? "failed" : status
    const inputTokens = finalStatus === "ready" ? tokenCount(usage?.inputTokens) : undefined
    const outputTokens = finalStatus === "ready" ? tokenCount(usage?.outputTokens) : undefined
    const record: AgentAuditRecord = {
      userId: context.userId,
      endpoint: "/api/ai/agent",
      inputHash: context.inputHash,
      outputSummary: `Agent request ${finalStatus}`,
      toolsCalled: [...tools],
      flagged: finalStatus === "blocked",
      durationMs: Math.max(0, now() - context.startTime),
      metadata: {
        auditVersion: 2,
        status: finalStatus,
        durationScope: "complete",
        toolsScope: "executed",
        organizationId: context.organizationId,
        jobOfferId: context.jobOfferId,
        ...model,
        ...(inputTokens === undefined ? {} : { inputTokens }),
        ...(outputTokens === undefined ? {} : { outputTokens }),
      },
    }
    completion = Result.tryPromise(() => log(record)).then((result) => {
      if (result.isErr()) console.error("Agent audit write failed", { endpoint: record.endpoint })
    })
    return completion
  }

  return {
    setModel(value: AgentAuditModel) {
      model = { provider: value.provider, modelId: value.modelId, source: value.source }
    },
    recordTool(name: string) {
      tools.add(name)
    },
    recordError() {
      failed = true
    },
    finish,
  }
}
