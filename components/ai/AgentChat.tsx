"use client"

import { useChat } from "@ai-sdk/react"
import {
  Attachment01Icon,
  Brain03Icon,
  Copy01Icon,
  DocumentAttachmentIcon,
  // Globe02Icon,
  Mic02Icon,
  SentIcon,
  SquareIcon,
  Comment02Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai"
import { CheckIcon, ExternalLinkIcon, XIcon } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  getAttachmentLabel,
  getMediaCategory,
} from "@/components/ai-elements/attachments"
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
} from "@/components/ai-elements/confirmation"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input"
import { Reasoning, ReasoningTrigger, useReasoning } from "@/components/ai-elements/reasoning"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Suggestion } from "@/components/ai-elements/suggestion"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useSession } from "@/lib/auth-client"

type AgentChatProps = {
  jobOfferId?: string
  organizationId?: string
  recruiterUserId?: string
}

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

type ToolApproval = {
  id: string
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

const isToolApproval = (value: unknown): value is ToolApproval => {
  if (!value || typeof value !== "object") return false
  const maybeApproval = value as { id?: unknown }
  return typeof maybeApproval.id === "string" && maybeApproval.id.length > 0
}

function ToolCvPreview({ cvUrl }: { cvUrl: string }) {
  const previewUrl = cvUrl.endsWith(".pdf")
    ? `${cvUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
    : cvUrl

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <HugeiconsIcon icon={DocumentAttachmentIcon} className="size-4 text-primary" aria-hidden />
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
        <HugeiconsIcon icon={Brain03Icon} className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">{line}</span>
      </span>
    </ReasoningTrigger>
  )
}

function AttachmentButton() {
  const attachments = usePromptInputAttachments()
  return (
    <PromptInputButton tooltip="Adjuntar archivos" onClick={attachments.openFileDialog}>
      <HugeiconsIcon icon={Attachment01Icon} size={16} />
    </PromptInputButton>
  )
}

function AttachmentItem({
  attachment,
  onRemove,
}: {
  attachment: {
    id: string
    type: string
    url?: string
    mediaType?: string
    filename?: string
    title?: string
  }
  onRemove: (id: string) => void
}) {
  const mediaCategory = getMediaCategory(attachment as never)
  const label = getAttachmentLabel(attachment as never)
  return (
    <AttachmentHoverCard>
      <AttachmentHoverCardTrigger asChild>
        <Attachment data={attachment as never} onRemove={() => onRemove(attachment.id)}>
          <div className="relative size-5 shrink-0">
            <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
              <AttachmentPreview />
            </div>
            <AttachmentRemove className="absolute inset-0" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>
      <AttachmentHoverCardContent>
        <div className="space-y-3">
          {mediaCategory === "image" && attachment.type === "file" && attachment.url && (
            <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
              <Image
                alt={label}
                className="max-h-full max-w-full object-contain"
                height={384}
                src={attachment.url}
                width={320}
                unoptimized
              />
            </div>
          )}
          <div className="space-y-1 px-0.5">
            <h4 className="font-semibold text-sm leading-none">{label}</h4>
            {attachment.mediaType && (
              <p className="font-mono text-muted-foreground text-xs">{attachment.mediaType}</p>
            )}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  )
}

function AttachmentHeader() {
  const attachments = usePromptInputAttachments()
  if (attachments.files.length === 0) return null
  return (
    <PromptInputHeader>
      <Attachments variant="inline">
        {attachments.files.map((file) => (
          <AttachmentItem key={file.id} attachment={file} onRemove={attachments.remove} />
        ))}
      </Attachments>
    </PromptInputHeader>
  )
}

export function AgentChat({ jobOfferId, organizationId, recruiterUserId }: AgentChatProps) {
  const transcriptRef = useRef("")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { data: session } = useSession()
  const sessionOrganizationId = session?.user?.organizationId
  const sessionRecruiterUserId = session?.user?.id
  const resolvedOrganizationId = organizationId ?? sessionOrganizationId
  const resolvedRecruiterUserId = recruiterUserId ?? sessionRecruiterUserId

  const { messages, sendMessage, status, stop, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/agent",
      body: {
        jobOfferId,
        organizationId: resolvedOrganizationId,
        recruiterUserId: resolvedRecruiterUserId,
      },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  })

  const isLoading = status === "submitted" || status === "streaming"
  const isStreaming = status === "streaming"
  const latestMessageId = useMemo(() => messages.at(-1)?.id, [messages])
  const shouldShowPendingAssistant = isLoading && messages.at(-1)?.role !== "assistant"

  const handleSubmit = useCallback(
    (message: { text: string; files: unknown[] }) => {
      const trimmedInput = message.text.trim()
      if (!trimmedInput || isLoading) return

      sendMessage({ text: trimmedInput })
    },
    [isLoading, sendMessage]
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

  // Speech recognition
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const startRecording = useCallback(() => {
    if (
      typeof window === "undefined" ||
      (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window))
    ) {
      return
    }

    const speechWindow = window as WindowWithSpeechRecognition
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "es-CL"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (textareaRef.current) {
        textareaRef.current.value = transcript
        textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }))
      } else {
        transcriptRef.current = transcript
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
      const finalTranscript = textareaRef.current?.value || transcriptRef.current
      if (finalTranscript.trim() && !isLoading) {
        sendMessage({ text: finalTranscript.trim() })
        if (textareaRef.current) {
          textareaRef.current.value = ""
          textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }
      transcriptRef.current = ""
    }

    recognition.onerror = () => {
      setIsRecording(false)
      transcriptRef.current = ""
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isLoading, sendMessage])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<HugeiconsIcon icon={Comment02Icon} size={48} />}
                title="Empieza una conversación"
                description="Helix te ayuda a gestionar candidatos, analizar ofertas y más."
              />
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={copyToClipboard}
                    isStreaming={isStreaming && message.id === latestMessageId}
                    addToolApprovalResponse={addToolApprovalResponse}
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
                    addToolApprovalResponse={addToolApprovalResponse}
                  />
                ) : null}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Suggestion
                  key={action}
                  suggestion={action}
                  onClick={handleQuickAction}
                  className="justify-start rounded-lg px-3 py-2.5"
                />
              ))}
            </div>
          </div>
        )}

        <PromptInput onSubmit={handleSubmit} className="px-4 pb-4">
          <AttachmentHeader />
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Pregúntame sobre candidatos, ofertas, métricas..."
              ref={textareaRef}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <AttachmentButton />
              {/*<PromptInputButton tooltip={{ content: "Buscar en la web", shortcut: "⌘K" }}>
                <HugeiconsIcon icon={Globe02Icon} size={16} />
              </PromptInputButton>*/}
              <PromptInputButton
                tooltip={{
                  content: isRecording ? "Detener grabación" : "Entrada de voz",
                  shortcut: "⌘M",
                  side: "bottom",
                }}
                onClick={toggleRecording}
                variant={isRecording ? "default" : "ghost"}
              >
                {isRecording ? (
                  <HugeiconsIcon icon={SquareIcon} size={16} />
                ) : (
                  <HugeiconsIcon icon={Mic02Icon} size={16} />
                )}
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit
              status={isLoading ? "submitted" : "ready"}
              onStop={isLoading ? stop : undefined}
            >
              <HugeiconsIcon icon={SentIcon} size={16} />
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </TooltipProvider>
  )
}

function MessageBubble({
  message,
  onCopy,
  isStreaming,
  addToolApprovalResponse,
}: {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    parts: Array<Record<string, unknown>>
  }
  onCopy: (text: string) => void
  isStreaming: boolean
  addToolApprovalResponse?: (options: {
    id: string
    approved: boolean
    reason?: string
  }) => void | PromiseLike<void>
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
                  | "approval-requested"
                  | "approval-responded"
                  | "output-available"
                  | "output-denied"
                  | undefined) ?? "input-available"
              const toolKey = `${toolName}-${idx}-${JSON.stringify(tool.input ?? "").slice(0, 20)}`
              const isDestructive = ["delete", "create", "update", "edit", "remove"].some((kw) =>
                toolName.toLowerCase().includes(kw)
              )
              const approval = isToolApproval(tool.approval) ? tool.approval : null

              if (isDestructive && approval && toolState === "approval-requested") {
                return (
                  <Confirmation key={toolKey} approval={approval} state={toolState}>
                    <ConfirmationRequest>
                      Esta accion quiere ejecutar: <code>{toolName}</code>
                    </ConfirmationRequest>
                    <ConfirmationAccepted>
                      <CheckIcon className="size-4" />
                      <span>Accion aprobada</span>
                    </ConfirmationAccepted>
                    <ConfirmationRejected>
                      <XIcon className="size-4" />
                      <span>Accion rechazada</span>
                    </ConfirmationRejected>
                    <ConfirmationActions>
                      <ConfirmationAction
                        variant="outline"
                        onClick={() => addToolApprovalResponse?.({ id: approval.id, approved: false })}
                      >
                        Rechazar
                      </ConfirmationAction>
                      <ConfirmationAction
                        variant="default"
                        onClick={() => addToolApprovalResponse?.({ id: approval.id, approved: true })}
                      >
                        Aprobar
                      </ConfirmationAction>
                    </ConfirmationActions>
                  </Confirmation>
                )
              }

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
              <HugeiconsIcon icon={Copy01Icon} size={14} />
            </MessageAction>
          </MessageActions>
        ) : null}
      </MessageContent>
    </Message>
  )
}
