import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"
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

function platformDefault(): ResolvedModel {
  const model = createOpenAI({
    baseURL: ZAI_BASE_URL,
    apiKey: process.env.ZAI_API_KEY,
  }).chat(PLATFORM_MODEL_ID)
  return {
    model,
    provider: PLATFORM_PROVIDER,
    modelId: PLATFORM_MODEL_ID,
    source: "platform",
  }
}

export async function resolveModel(
  organizationId: string | undefined,
): Promise<ResolvedModel> {
  if (!organizationId) return platformDefault()

  const result = await getActiveCredentialDecrypted(organizationId)
  if (result.isErr()) return platformDefault()

  const { provider, modelId, apiKey } = result.value
  if (!findProviderModel(provider, modelId)) return platformDefault()

  try {
    return {
      model: buildModel(provider, modelId, apiKey),
      provider,
      modelId,
      source: "byok",
    }
  } catch {
    return platformDefault()
  }
}
