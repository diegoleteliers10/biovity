"use client"

import { useChat } from "@ai-sdk/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { DefaultChatTransport } from "ai"
import {
  BrainIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
  SendIcon,
  SquareIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { Reasoning, ReasoningTrigger, useReasoning } from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Suggestion } from "@/components/ai-elements/suggestion"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"

type AgentChatProps = {
  jobOfferId?: string
  organizationId?: string
  recruiterUserId?: string
}

const QUICK_ACTIONS = [
  "¿Cuántos candidatos tengo en revisión?",
  "Muestra los candidatos con más skills en común",
  "Busca candidatos con experiencia en bioinformática",
  "Dame estadísticas de mis ofertas activas",
]

/** One-line preview for the reasoning trigger (model-generated copy, truncated). */
const REASONING_TRIGGER_PREVIEW_MAX = 200

const getReasoningTriggerPreview = (text: string) => {
  const trimmed = text.trim()
  if (trimmed.length <= REASONING_TRIGGER_PREVIEW_MAX) return trimmed
  return `${trimmed.slice(0, REASONING_TRIGGER_PREVIEW_MAX)}…`
}

const CV_KEYS = new Set(["cvUrl", "resumeUrl", "cv"])

const getCvUrlsFromOutput = (output: unknown): string[] => {
  const urls = new Set<string>()

  const walk = (value: unknown): void => {
    if (typeof value === "string") {
      if (value.startsWith("/api/cv/") || value.includes("/api/cv/") || value.includes("/cv/")) {
        urls.add(value)
      }
      return
    }

    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }

    if (typeof value !== "object" || value === null) return

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      if (CV_KEYS.has(key) && typeof nestedValue === "string" && nestedValue.length > 0) {
        urls.add(nestedValue)
      }
      walk(nestedValue)
    }
  }

  walk(output)
  return Array.from(urls)
}

function ToolCvPreview({ cvUrl }: { cvUrl: string }) {
  const previewUrl = cvUrl.endsWith(".pdf")
    ? `${cvUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
    : cvUrl

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <FileTextIcon className="size-4 text-primary" aria-hidden />
        <p className="font-medium">Vista previa CV</p>
      </div>
      <iframe
        src={previewUrl}
        title="Vista previa de CV"
        className="h-40 w-full rounded-md border bg-muted/20"
        loading="lazy"
      />
      <div className="mt-2 flex justify-end">
        <Button asChild size="sm" variant="outline">
          <a href={cvUrl} target="_blank" rel="noreferrer">
            Abrir CV
            <ExternalLinkIcon className="ml-1 size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  )
}

function AssistantReasoningTriggerRow({ reasoningText }: { reasoningText: string }) {
  const { isStreaming, duration } = useReasoning()

  let line: ReactNode
  if (isStreaming || duration === 0) {
    const preview = getReasoningTriggerPreview(reasoningText)
    line =
      preview.length > 0 ? (
        <Shimmer duration={1}>{preview}</Shimmer>
      ) : (
        <Shimmer duration={1}>Thinking...</Shimmer>
      )
  } else if (duration === undefined) {
    line = <p>Pensé unos segundos</p>
  } else {
    line = <p>Pensé durante {duration} segundos</p>
  }

  return (
    <ReasoningTrigger className="pointer-events-none">
      <span className="flex w-full min-w-0 items-center gap-2 text-left">
        <BrainIcon className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">{line}</span>
      </span>
    </ReasoningTrigger>
  )
}

export function AgentChat({ jobOfferId, organizationId, recruiterUserId }: AgentChatProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const sessionOrganizationId = session?.user?.organizationId
  const sessionRecruiterUserId = session?.user?.id
  const resolvedOrganizationId = organizationId ?? sessionOrganizationId
  const resolvedRecruiterUserId = recruiterUserId ?? sessionRecruiterUserId

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/agent",
      body: {
        jobOfferId,
        organizationId: resolvedOrganizationId,
        recruiterUserId: resolvedRecruiterUserId,
      },
    }),
  })

  const isLoading = status === "submitted" || status === "streaming"
  const isStreaming = status === "streaming"
  const latestMessageId = useMemo(() => messages.at(-1)?.id, [messages])
  const shouldShowPendingAssistant = isLoading && messages.at(-1)?.role !== "assistant"
  /** Bumps on every streamed token / part update (not only when message ids change). */
  const messagesScrollKey = useMemo(() => JSON.stringify(messages), [messages])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedInput = input.trim()
      if (!trimmedInput || isLoading) return

      sendMessage({ text: trimmedInput })
      setInput("")
    },
    [input, isLoading, sendMessage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        const trimmedInput = input.trim()
        if (!trimmedInput || isLoading) return

        sendMessage({ text: trimmedInput })
        setInput("")
      }
    },
    [input, isLoading, sendMessage]
  )

  const handleQuickAction = useCallback(
    (action: string) => {
      if (isLoading) return
      sendMessage({ text: action })
    },
    [isLoading, sendMessage]
  )

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  // Scroll on each streamed chunk (`messagesScrollKey`) and when the pending bubble appears.
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll must follow message content, not only status
  useLayoutEffect(() => {
    const node = messagesScrollRef.current
    if (!node) return
    node.scrollTo({
      top: node.scrollHeight,
      behavior: isStreaming || isLoading ? "auto" : "smooth",
    })
  }, [messagesScrollKey, isStreaming, isLoading, shouldShowPendingAssistant])

  return (
    <div className="flex h-full flex-col">
      <div ref={messagesScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <HugeiconsIcon icon={SparklesIcon} size={32} className="text-muted-foreground mb-3" />
            <h3 className="font-medium text-sm mb-1">Asistente de Reclutamiento</h3>
            <p className="text-muted-foreground text-xs mb-4">
              Puedo ayudarte a gestionar candidatos, analizar ofertas y más.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyToClipboard}
            isStreaming={isStreaming && message.id === latestMessageId}
          />
        ))}
        {shouldShowPendingAssistant ? (
          <MessageBubble
            message={{
              id: "pending-assistant",
              role: "assistant",
              parts: [],
            }}
            onCopy={copyToClipboard}
            isStreaming
          />
        ) : null}
      </div>

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Suggestion
                key={action}
                suggestion={action}
                onClick={handleQuickAction}
                className="w-full justify-start rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntame sobre candidatos, ofertas, métricas..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 max-h-32 overflow-y-auto"
          />
          {isLoading ? (
            <Button type="button" size="icon" variant="outline" onClick={() => stop()}>
              <SquareIcon size={16} />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <SendIcon size={16} />
            </Button>
          )}
        </div>
        {error ? <p className="mt-2 text-xs text-destructive">{error.message}</p> : null}
      </form>
    </div>
  )
}

function MessageBubble({
  message,
  onCopy,
  isStreaming,
}: {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    parts: Array<Record<string, unknown>>
  }
  onCopy: (text: string) => void
  isStreaming: boolean
}) {
  const isUser = message.role === "user"
  const renderedText = message.parts
    .filter((part) => part.type === "text")
    .map((part) => String(part.text ?? ""))
    .join("")
  const reasoningText = !isUser
    ? message.parts
        .filter((part) => part.type === "reasoning")
        .map((part) => String(part.text ?? part.reasoning ?? ""))
        .join("")
    : ""
  const toolParts = message.parts.filter(
    (part) => typeof part.type === "string" && part.type.startsWith("tool-")
  )

  return (
    <Message from={isUser ? "user" : "assistant"}>
      <MessageContent className={isUser ? "text-white" : undefined}>
        {(reasoningText || (!isUser && isStreaming)) && (
          <Reasoning isStreaming={isStreaming} defaultOpen={false}>
            <AssistantReasoningTriggerRow reasoningText={reasoningText} />
          </Reasoning>
        )}

        {toolParts.length > 0 && (
          <div className="mt-3 space-y-2">
            {toolParts.map((tool, idx) => {
              const rawType = String(tool.type ?? "tool-unknown")
              const toolName = rawType.startsWith("tool-") ? rawType.slice(5) : rawType
              const cvUrls = getCvUrlsFromOutput(tool.output)
              const toolState =
                (tool.state as
                  | "input-streaming"
                  | "input-available"
                  | "output-available"
                  | undefined) ?? "input-available"
              const toolKey = `${toolName}-${idx}-${JSON.stringify(tool.input ?? "").slice(0, 20)}`

              return (
                <Tool key={toolKey}>
                  <ToolHeader type="dynamic-tool" state={toolState} toolName={toolName} />
                  <ToolContent>
                    <ToolInput input={tool.input} />
                    {toolState === "output-available" && cvUrls.length > 0 ? (
                      <div className="space-y-2">
                        {cvUrls.slice(0, 1).map((cvUrl) => (
                          <ToolCvPreview key={cvUrl} cvUrl={cvUrl} />
                        ))}
                      </div>
                    ) : null}
                    {toolState === "output-available" ? (
                      <ToolOutput
                        output={
                          typeof tool.output === "string"
                            ? tool.output
                            : (JSON.stringify(tool.output) as unknown)
                        }
                        errorText={typeof tool.errorText === "string" ? tool.errorText : undefined}
                      />
                    ) : null}
                  </ToolContent>
                </Tool>
              )
            })}
          </div>
        )}

        {renderedText &&
          (isUser ? (
            <div className="max-w-none text-sm text-white">
              <p className="whitespace-pre-wrap text-white">{renderedText}</p>
            </div>
          ) : (
            <MessageResponse>{renderedText}</MessageResponse>
          ))}

        {!isUser && renderedText ? (
          <MessageActions>
            <MessageAction tooltip="Copiar" onClick={() => onCopy(renderedText)}>
              <CopyIcon size={14} />
            </MessageAction>
          </MessageActions>
        ) : null}
      </MessageContent>
    </Message>
  )
}
