import { createOpenAI } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"

export const AI_MODEL = "minimax/MiniMax-M2.7" as const

export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  baseURL: "https://openrouter.ai/api/v1",
})

export const model = openrouter.chat(AI_MODEL)

export { generateText, streamText }
