import { convertToModelMessages, smoothStream, stepCountIs, type UIMessage } from "ai"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { AIAuditService, aiAuditService } from "@/lib/ai/audit"
import { AI_LIMITS } from "@/lib/ai/env"
import { PromptInjectionError } from "@/lib/ai/errors"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { model, streamText } from "@/lib/ai/provider"
import { sanitizeInput } from "@/lib/ai/sanitize"
import { externalTools } from "@/lib/ai/tools/external"
import { organizationTools } from "@/lib/ai/tools/organization"
import { auth } from "@/lib/auth"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let flagged = false

  const {
    messages,
    jobOfferId,
    organizationId,
    recruiterUserId,
  }: {
    messages: UIMessage[]
    jobOfferId?: string
    organizationId?: string
    recruiterUserId?: string
  } = await req.json()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const sessionUser = session.user as typeof session.user & {
    organizationId?: string
    type?: string
  }
  const resolvedOrganizationId = organizationId ?? sessionUser.organizationId
  const _resolvedRecruiterUserId = recruiterUserId ?? session.user.id

  for (const msg of messages) {
    const msgAny = msg as unknown as { content?: string | Array<{ type?: string; text?: string }> }
    const text = typeof msgAny.content === "string" ? msgAny.content : ""
    if (text) {
      try {
        sanitizeInput(text, session.user.id)
      } catch (error) {
        if (error instanceof PromptInjectionError) {
          flagged = true
          await aiAuditService
            .log({
              userId: session.user.id,
              endpoint: "/api/ai/agent",
              inputHash: AIAuditService.hashInput(text),
              outputSummary: "BLOCKED: Prompt injection detected",
              toolsCalled: [],
              flagged: true,
              durationMs: Date.now() - startTime,
              metadata: { detectedPattern: error.detectedPattern },
            })
            .catch(() => {})

          return Response.json(
            {
              error: "Solicitud bloqueada por seguridad",
              code: "ERR_PROMPT_INJECTION",
            },
            { status: 400 }
          )
        }
      }
    }
  }

  const allTools = {
    ...organizationTools,
    ...externalTools,
  }

  const systemPrompt = buildSystemPrompt({
    role: "recruiter_assistant",
    userId: session.user.id,
    organizationId: resolvedOrganizationId,
    jobOfferId,
  })

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(AI_LIMITS.DEFAULT_MAX_STEPS),
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: "word",
    }),
    tools: allTools,
    system: systemPrompt,
  })

  aiAuditService
    .log({
      userId: session.user.id,
      endpoint: "/api/ai/agent",
      inputHash: AIAuditService.hashInput(
        JSON.stringify({ messageCount: messages.length, jobOfferId })
      ),
      outputSummary: "Streaming response initiated",
      toolsCalled: Object.keys(allTools),
      flagged,
      durationMs: Date.now() - startTime,
      metadata: { jobOfferId, organizationId: resolvedOrganizationId },
    })
    .catch(() => {})

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
  })
}
