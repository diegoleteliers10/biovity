import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"
import { Result } from "better-result"
import { buildModel, findProviderModel, type ProviderId } from "@/lib/ai/byok/registry"
import { getActiveCredentialDecrypted } from "@/lib/api/ai-credentials"

const ZAI_BASE_URL = "https://api.z.ai/api/coding/paas/v4"
const PLATFORM_PROVIDER: ProviderId = "zai"
const PLATFORM_MODEL_ID = "glm-5.2"

export type ResolvedModel = {
  model: LanguageModel
  provider: ProviderId
  modelId: string
  source: "byok" | "platform"
}

function platformDefault(purpose: "chat" | "explanation"): ResolvedModel {
  const modelId = purpose === "explanation" ? "glm-5.3-flash" : PLATFORM_MODEL_ID
  const model = createOpenAI({
    baseURL: ZAI_BASE_URL,
    apiKey: process.env.ZAI_API_KEY,
  }).chat(modelId)
  return {
    model,
    provider: PLATFORM_PROVIDER,
    modelId,
    source: "platform",
  }
}

export async function resolveModel(
  organizationId: string | undefined,
  purpose: "chat" | "explanation" = "chat"
): Promise<ResolvedModel> {
  if (!organizationId) return platformDefault(purpose)

  const result = await getActiveCredentialDecrypted(organizationId)
  if (result.isErr()) return platformDefault(purpose)

  const { provider, modelId, apiKey } = result.value
  if (!findProviderModel(provider, modelId)) return platformDefault(purpose)

  const built = Result.try(() =>
    purpose === "explanation" && provider === "zai"
      ? createOpenAI({ apiKey, baseURL: ZAI_BASE_URL }).chat("glm-5.3-flash")
      : buildModel(provider, modelId, apiKey)
  )
  if (built.isErr()) return platformDefault(purpose)
  return {
    model: built.value,
    provider,
    modelId: purpose === "explanation" && provider === "zai" ? "glm-5.3-flash" : modelId,
    source: "byok",
  }
}
