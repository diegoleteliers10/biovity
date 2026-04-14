import type { NextRequest } from "next/server"
import { buildPrompt, getSystemPrompt } from "@/lib/ai/prompts"
import { model, streamText } from "@/lib/ai/provider"
import type { AIActionPayload } from "@/lib/ai/types"

export async function POST(req: NextRequest) {
  const body: AIActionPayload = await req.json()

  if (!body.action || !body.context) {
    return new Response("Bad request", { status: 400 })
  }

  const systemPrompt = getSystemPrompt(body.action)
  const userPrompt = buildPrompt(body)

  const result = streamText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
  })

  return result.toTextStreamResponse()
}
