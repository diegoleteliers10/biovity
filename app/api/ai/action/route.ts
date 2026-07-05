import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { buildPrompt, getSystemPrompt } from "@/lib/ai/prompts"
import { resolveModel, streamText } from "@/lib/ai/provider"
import type { AIActionPayload } from "@/lib/ai/types"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }
  const organizationId = (session.user as { organizationId?: string }).organizationId

  const body: AIActionPayload = await req.json()

  if (!body.action || !body.context) {
    return new Response("Bad request", { status: 400 })
  }

  const systemPrompt = getSystemPrompt(body.action)
  const userPrompt = buildPrompt(body)

  const resolved = await resolveModel(organizationId)
  const result = streamText({
    model: resolved.model,
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
