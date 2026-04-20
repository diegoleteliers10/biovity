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

  const textStream = result.textStream

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of textStream) {
          const line = `data: ${JSON.stringify({ text: chunk })}\n`
          controller.enqueue(encoder.encode(line))
        }
        controller.enqueue(encoder.encode("data: [DONE]\n"))
        controller.close()
      } catch {
        controller.error("Stream error")
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
