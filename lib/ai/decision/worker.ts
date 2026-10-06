import { createHash } from "node:crypto"
import { Result as R } from "better-result"
import { aiAuditService } from "@/lib/ai/audit"
import {
  claimCandidateAssessments,
  failCandidateAssessment,
  finishCandidateAssessment,
  purgeExpiredCandidateSnapshots,
} from "@/lib/db/application-ai-score"
import {
  JEV_MAX_ASSESSMENTS_PER_INVOCATION,
  JEV_MODEL_VERSION,
  JEV_SCORE_CONCURRENCY,
} from "./constants"
import { assessWithJev } from "./jev"
import { hasSufficientData } from "./mapping"
import type { ClaimedAssessment, JevAuditOutcome } from "./types"

export async function processJevQueue(
  maxAssessments = JEV_MAX_ASSESSMENTS_PER_INVOCATION
): Promise<void> {
  const purgeResult = await purgeExpiredCandidateSnapshots()
  if (purgeResult.isErr()) {
    console.error("[Jev] Could not purge expired candidate snapshots")
  }
  let processed = 0

  while (processed < maxAssessments) {
    const claimResult = await claimCandidateAssessments(
      Math.min(JEV_SCORE_CONCURRENCY, maxAssessments - processed)
    )
    if (claimResult.isErr() || claimResult.value.length === 0) return

    const batch = claimResult.value
    processed += batch.length
    await Promise.all(batch.map(processOneAssessment))
  }
}

async function processOneAssessment(assessment: ClaimedAssessment): Promise<void> {
  const startedAt = Date.now()
  const result = await assessWithJev({
    job: assessment.jobSnapshot,
    candidate: assessment.candidateSnapshot,
  })

  if (result.isErr()) {
    await failCandidateAssessment(assessment, "provider_error")
    await logAssessment(assessment, startedAt, { status: "failed", errorCode: "provider_error" })
    return
  }

  const saved = await finishCandidateAssessment(assessment, result.value)
  if (saved.isErr()) {
    await logAssessment(assessment, startedAt, {
      status: "failed",
      errorCode: "persistence_error",
      result: result.value,
    })
    return
  }
  if (!saved.value) {
    await logAssessment(assessment, startedAt, {
      status: "aborted",
      errorCode: "lease_lost",
      result: result.value,
    })
    return
  }
  await logAssessment(assessment, startedAt, {
    status: hasSufficientData(result.value.sufficiency) ? "ready" : "insufficient",
    result: result.value,
  })
}

async function logAssessment(
  assessment: ClaimedAssessment,
  startedAt: number,
  outcome: JevAuditOutcome
): Promise<void> {
  const auditResult = await R.tryPromise({
    try: () =>
      aiAuditService.log({
        userId: assessment.requestedBy,
        endpoint: "/api/ai/score-candidates",
        inputHash: assessment.fingerprint,
        outputSummary: `Jev assessment: ${outcome.status}`,
        toolsCalled: [],
        flagged: false,
        durationMs: Math.max(0, Date.now() - startedAt),
        metadata: {
          organizationId: assessment.organizationId,
          jobId: assessment.jobId,
          applicationId: assessment.applicationId,
          auditVersion: 2,
          provider: "typesafe",
          modelId: outcome.result?.model ?? JEV_MODEL_VERSION,
          engine: outcome.result?.model ?? JEV_MODEL_VERSION,
          inputTokens: outcome.result?.inputTokens,
          outputTokens: outcome.result?.outputTokens,
          status: outcome.status,
          durationScope: "complete",
          toolsScope: "executed",
          candidateId: assessment.candidateId,
          revisionId: assessment.revisionId,
          attempt: assessment.attempts,
          ...("errorCode" in outcome ? { errorCode: outcome.errorCode } : {}),
        },
      }),
    catch: (cause) => (cause instanceof Error ? cause : new Error("AI audit write failed")),
  })
  if (auditResult.isErr()) {
    console.error("[Jev] Assessment audit write failed", {
      revisionId: assessment.revisionId,
      cause: createHash("sha256").update(auditResult.error.message).digest("hex").slice(0, 12),
    })
  }
}
