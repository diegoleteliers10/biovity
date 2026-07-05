import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"

export type ProviderId = "openai" | "anthropic" | "google" | "zai" | "openrouter"

export type ModelOption = {
  id: string
  label: string
  supportsTools: boolean
}

export type ProviderConfig = {
  id: ProviderId
  label: string
  models: readonly ModelOption[]
  defaultModel: string
  docsUrl: string
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    docsUrl: "https://platform.openai.com/api-keys",
    defaultModel: "gpt-4.1-mini",
    models: [
      { id: "gpt-4.1", label: "GPT-4.1", supportsTools: true },
      { id: "gpt-4.1-mini", label: "GPT-4.1 Mini", supportsTools: true },
      { id: "o3", label: "o3", supportsTools: true },
      { id: "o4-mini", label: "o4-mini", supportsTools: true },
    ],
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    docsUrl: "https://console.anthropic.com/settings/keys",
    defaultModel: "claude-sonnet-4-6",
    models: [
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", supportsTools: true },
      { id: "claude-opus-4-8", label: "Claude Opus 4.8", supportsTools: true },
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", supportsTools: true },
    ],
  },
  google: {
    id: "google",
    label: "Google Gemini",
    docsUrl: "https://aistudio.google.com/app/apikey",
    defaultModel: "gemini-2.5-flash",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", supportsTools: true },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", supportsTools: true },
      { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash", supportsTools: true },
    ],
  },
  zai: {
    id: "zai",
    label: "Z.ai (GLM)",
    docsUrl: "https://z.ai",
    defaultModel: "glm-5.2",
    models: [
      { id: "glm-5.2", label: "GLM-5.2", supportsTools: true },
      { id: "glm-5-turbo", label: "GLM-5 Turbo", supportsTools: true },
      { id: "glm-4.7", label: "GLM-4.7", supportsTools: true },
    ],
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    docsUrl: "https://openrouter.ai/keys",
    defaultModel: "openai/gpt-4.1-mini",
    models: [
      {
        id: "openai/gpt-4.1-mini",
        label: "GPT-4.1 Mini (via OpenRouter)",
        supportsTools: true,
      },
      {
        id: "anthropic/claude-sonnet-4-6",
        label: "Claude Sonnet 4.6 (via OpenRouter)",
        supportsTools: true,
      },
      {
        id: "google/gemini-2.5-flash",
        label: "Gemini 2.5 Flash (via OpenRouter)",
        supportsTools: true,
      },
    ],
  },
}

export type ProviderModelInfo = {
  provider: ProviderId
  modelId: string
  supportsTools: boolean
}

export function findProviderModel(provider: ProviderId, modelId: string): ProviderModelInfo | null {
  const config = PROVIDERS[provider]
  const model = config?.models.find((m) => m.id === modelId)
  if (!config || !model) return null
  return { provider, modelId, supportsTools: model.supportsTools }
}

type ModelBuilder = (modelId: string, apiKey: string) => LanguageModel

const ZAI_BASE_URL = "https://api.z.ai/api/coding/paas/v4"
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

const builders: Record<ProviderId, ModelBuilder> = {
  openai: (modelId, apiKey) => createOpenAI({ apiKey }).chat(modelId),
  anthropic: (modelId, apiKey) => createAnthropic({ apiKey }).chat(modelId),
  google: (modelId, apiKey) => createGoogleGenerativeAI({ apiKey })(modelId),
  zai: (modelId, apiKey) => createOpenAI({ apiKey, baseURL: ZAI_BASE_URL }).chat(modelId),
  openrouter: (modelId, apiKey) =>
    createOpenAI({ apiKey, baseURL: OPENROUTER_BASE_URL }).chat(modelId),
}

export function buildModel(provider: ProviderId, modelId: string, apiKey: string): LanguageModel {
  return builders[provider](modelId, apiKey)
}
