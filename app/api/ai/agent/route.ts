import { convertToModelMessages, stepCountIs, type UIMessage } from "ai"
import { Result } from "better-result"
import { headers } from "next/headers"
import { after, type NextRequest } from "next/server"
import { z } from "zod"
import { createAgentAudit } from "@/lib/ai/agent-audit"
import { AIAuditService, aiAuditService } from "@/lib/ai/audit"
import { findProviderModel } from "@/lib/ai/byok/registry"
import { AI_LIMITS } from "@/lib/ai/env"
import { PromptInjectionError } from "@/lib/ai/errors"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { resolveModel, streamText } from "@/lib/ai/provider"
import { sanitizeInput } from "@/lib/ai/sanitize"
import { externalTools } from "@/lib/ai/tools/external"
import { organizationTools } from "@/lib/ai/tools/organization"
import { auth } from "@/lib/auth"
import { authorizeResource } from "@/lib/auth/resource-access"

const AgentRequestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["system", "user", "assistant"]),
      parts: z.array(
        z.custom<UIMessage["parts"][number]>((value) => {
          if (
            typeof value !== "object" ||
            value === null ||
            !("type" in value) ||
            typeof value.type !== "string"
          )
            return false
          return value.type !== "text" || ("text" in value && typeof value.text === "string")
        })
      ),
    })
  ),
  jobOfferId: z.string().optional(),
  organizationId: z.string().optional(),
})

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  const body = await Result.tryPromise(() => req.json())
  if (body.isErr()) return Response.json({ error: "Solicitud inválida" }, { status: 400 })
  const parsed = AgentRequestSchema.safeParse(body.value)
  if (!parsed.success) return Response.json({ error: "Solicitud inválida" }, { status: 400 })
  const { messages, jobOfferId, organizationId } = parsed.data

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const sessionUser = session.user as typeof session.user & {
    organizationId?: string
    type?: string
  }
  const resolvedOrganizationId = organizationId ?? sessionUser.organizationId
  const audit = createAgentAudit(
    {
      userId: session.user.id,
      inputHash: AIAuditService.hashInput(JSON.stringify(messages)),
      startTime,
      organizationId: resolvedOrganizationId,
      jobOfferId,
    },
    (record) => aiAuditService.log(record)
  )
  if (!resolvedOrganizationId) {
    await audit.finish("blocked")
    return Response.json({ error: "Organización requerida" }, { status: 403 })
  }
  const access = await authorizeResource(
    { kind: "organization", id: resolvedOrganizationId },
    "recruit"
  )
  if (access.isErr()) {
    await audit.finish("blocked")
    return Response.json({ error: access.error.message }, { status: access.error.status })
  }

  for (const msg of messages) {
    const text = msg.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
    const sanitized = Result.try(() => sanitizeInput(text, session.user.id))
    if (sanitized.isErr()) {
      const blocked = sanitized.error instanceof PromptInjectionError
      await audit.finish(blocked ? "blocked" : "failed")
      return Response.json(
        {
          error: blocked ? "Solicitud bloqueada por seguridad" : "No se pudo procesar la solicitud",
          code: blocked ? "ERR_PROMPT_INJECTION" : "ERR_AGENT_REQUEST",
        },
        { status: blocked ? 400 : 500 }
      )
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

  const resolution = await Result.tryPromise(() => resolveModel(resolvedOrganizationId))
  if (resolution.isErr()) {
    await audit.finish("failed")
    return Response.json({ error: "No se pudo iniciar el agente" }, { status: 500 })
  }
  const resolved = resolution.value
  audit.setModel(resolved)
  const capability = findProviderModel(resolved.provider, resolved.modelId)
  if (resolved.source === "byok" && capability && !capability.supportsTools) {
    await audit.finish("blocked")
    return Response.json(
      {
        error: "El modelo seleccionado no soporta herramientas",
        code: "ERR_MODEL_NO_TOOLS",
      },
      { status: 400 }
    )
  }

  const conversion = await Result.tryPromise(() => convertToModelMessages(messages))
  if (conversion.isErr()) {
    await audit.finish("failed")
    return Response.json({ error: "No se pudo procesar la solicitud" }, { status: 400 })
  }
  const stream = Result.try(() =>
    streamText({
      model: resolved.model,
      messages: conversion.value,
      stopWhen: stepCountIs(AI_LIMITS.DEFAULT_MAX_STEPS),
      tools: allTools,
      system: systemPrompt,
      abortSignal: req.signal,
      experimental_onToolCallFinish: ({ toolCall }) => audit.recordTool(toolCall.toolName),
      onError: () => audit.recordError(),
      onAbort: () => audit.finish("aborted"),
      onFinish: ({ totalUsage, finishReason }) =>
        audit.finish(finishReason === "error" ? "failed" : "ready", totalUsage),
    })
  )
  if (stream.isErr()) {
    await audit.finish("failed")
    return Response.json({ error: "No se pudo iniciar el agente" }, { status: 500 })
  }
  const result = stream.value
  after(async () => {
    await Result.tryPromise(() =>
      Promise.resolve(
        result.consumeStream({
          onError: () => audit.recordError(),
        })
      )
    )
    await audit.finish(req.signal.aborted ? "aborted" : "failed")
  })
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
  })
}
