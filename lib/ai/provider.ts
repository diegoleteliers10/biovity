import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText, streamText } from "ai"

const minimax = createAnthropic({
  baseURL: "https://api.minimax.io/anthropic/v1",
  apiKey: process.env.MINIMAX_API_KEY,
})

export const model = minimax("MiniMax-M3")

export { generateText, streamText }
