import { createOpenAI } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"

const zai = createOpenAI({
  baseURL: "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.ZAI_API_KEY,
})

export const model = zai.chat("glm-5.2")

export { generateText, streamText }
