import type { EntryType } from "@typesafe-ai/sdk"
import { TypeSafeClient } from "@typesafe-ai/sdk"
import { Result as R, type Result } from "better-result"
import { JEV_MODEL_VERSION, JEV_TIMEOUT_MS } from "./constants"
import { toCompatibilityScore } from "./mapping"
import { JEV_QUESTIONS } from "./questions"
import type { JevAssessment } from "./types"

export async function assessWithJev(
  state: Record<string, unknown>
): Promise<Result<JevAssessment, Error>> {
  return R.tryPromise({
    try: async () => {
      const client = new TypeSafeClient({
        defaultModel: JEV_MODEL_VERSION,
        logLevel: "off",
        timeout: JEV_TIMEOUT_MS,
        retry: { maxRetries: 0 },
      })
      const result = await client.systemOne({
        model: JEV_MODEL_VERSION,
        state: JSON.stringify(state) satisfies EntryType,
        questions: JEV_QUESTIONS,
      })
      const compatibility = result.answers.compatibility
      const sufficientData = result.answers.sufficientData
      return {
        model: result.model,
        score: toCompatibilityScore(compatibility.score),
        confidence: compatibility.confidence,
        sufficiency: sufficientData.noul,
        distribution: Object.fromEntries(
          Object.entries(compatibility.probabilities).map(([level, probability]) => [
            JEV_QUESTIONS.compatibility.criteria[Number(level)] ?? level,
            probability,
          ])
        ),
        perQuestion: result.answers,
        inputTokens: result.usage.input_tokens,
        outputTokens: result.usage.output_tokens,
      }
    },
    catch: (cause) => (cause instanceof Error ? cause : new Error("Jev request failed")),
  })
}
