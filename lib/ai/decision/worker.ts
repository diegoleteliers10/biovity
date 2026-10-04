import { createHash } from "node:crypto"
import { Result as R } from "better-result"
import { aiAuditService } from "@/lib/ai/audit"
import {
  claimCandidateAssessments,
  failCandidateAssessment,
  finishCandidateAssessment,
  purgeExpiredCandidateSnapshots,
} from "@/lib/db/application-ai-score"
import { JEV_MAX_ASSESSMENTS_PER_INVOCATION, JEV_SCORE_CONCURRENCY } from "./constants"
import { assessWithJev } from "./jev"
import { hasSufficientData } from "./mapping"
import type { ClaimedAssessment } from "./types"

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
  const result = await assessWithJev({
    job: assessment.jobSnapshot,
    candidate: assessment.candidateSnapshot,
  })

  if (result.isErr()) {
    await failCandidateAssessment(assessment, "provider_error")
    return
  }

  const saved = await finishCandidateAssessment(assessment, result.value)
  if (saved.isErr() || !saved.value) return

  const auditResult = await R.tryPromise({
    try: () =>
      aiAuditService.log({
        userId: assessment.requestedBy,
        endpoint: "/api/ai/score-candidates",
        inputHash: assessment.fingerprint,
        outputSummary: `Jev compatibility assessment ${assessment.revisionId}`,
        toolsCalled: [],
        flagged: false,
        durationMs: 0,
        metadata: {
          organizationId: assessment.organizationId,
          jobId: assessment.jobId,
          applicationId: assessment.applicationId,
          engine: result.value.model,
          inputTokens: result.value.inputTokens,
          outputTokens: result.value.outputTokens,
          status: hasSufficientData(result.value.sufficiency) ? "ready" : "insufficient",
        },
      }),
    catch: (cause) => (cause instanceof Error ? cause : new Error("AI audit write failed")),
  })
  if (auditResult.isErr()) {
    console.error("[Jev] Assessment saved without audit record", {
      revisionId: assessment.revisionId,
      cause: createHash("sha256").update(auditResult.error.message).digest("hex").slice(0, 12),
    })
  }
}
