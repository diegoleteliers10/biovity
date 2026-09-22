"use client"

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { ChatHeader } from "@/components/dashboard/employee/ChatHeader"
import { MessageInput } from "@/components/dashboard/employee/MessageInput"
import { ProductShot } from "@/components/landing/demo/product-shot"
import { MessageBubble } from "@/components/ui/message-bubble"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import type { Message } from "@/lib/api/messages"
import type * as MessagesHooks from "@/lib/api/use-messages"
import {
  DEMO_CHAT_MESSAGES,
  DEMO_PROFESSIONAL_USER,
  DEMO_RECRUITER_USER,
} from "@/lib/data/demo/user-demo"

const idleSendMutation = {
  isPending: false,
  isError: false,
  error: null,
} as unknown as ReturnType<typeof MessagesHooks.useSendMessageMutation>

const RECRUITER_NAME = "Camila Rojas"
const RECRUITER_INITIALS = "CR"
const PROFESSIONAL_ID = "demo-javiera"

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })

const HIGHLIGHTS = [
  "Mensajería en tiempo real con los reclutadores",
  "Agenda de entrevistas dentro de la conversación",
  "Envío de imágenes y documentos (CV, certificados)",
]

/**
 * Chat visualization for the landing: the real ChatHeader, MessageBubble and
 * MessageInput components over local state, so the conversation — including
 * the interview event card — behaves without any session or socket.
 */
function DemoChatThread() {
  const [messages, setMessages] = useState<Message[]>(DEMO_CHAT_MESSAGES)
  const [messageInput, setMessageInput] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    // Scroll only the chat thread container: scrollIntoView would also move
    // the page itself, yanking visitors down to this section on load.
    const el = scrollContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  const handleSend = () => {
    const content = messageInput.trim()
    if (!content) return
    setMessages((prev) => [
      ...prev,
      {
        id: `demo-msg-${Date.now()}`,
        chatId: "chat-1",
        senderId: PROFESSIONAL_ID,
        content,
        type: "text",
        contentType: null,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ])
    setMessageInput("")
  }

  const handleEventAction = (eventId: string, action: "accept" | "decline") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.type === "event" && (msg.contentType as { eventId?: string })?.eventId === eventId
          ? {
              ...msg,
              contentType: {
                ...(msg.contentType as Record<string, unknown>),
                participantStatus: action === "accept" ? "accepted" : "declined",
              },
            }
          : msg
      )
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        recruiter={DEMO_RECRUITER_USER}
        recruiterName={RECRUITER_NAME}
        recruiterInitials={RECRUITER_INITIALS}
        onBackToList={() => {}}
      />

      <div
        ref={scrollContainerRef}
        className="scrollbar-message-hide min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === PROFESSIONAL_ID}
            senderName={msg.senderId === PROFESSIONAL_ID ? "Tú" : RECRUITER_NAME}
            senderInitials={
              msg.senderId === PROFESSIONAL_ID
                ? DEMO_PROFESSIONAL_USER.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : RECRUITER_INITIALS
            }
            senderAvatar={
              (msg.senderId === PROFESSIONAL_ID
                ? DEMO_PROFESSIONAL_USER.avatar
                : DEMO_RECRUITER_USER.avatar) ?? undefined
            }
            formatTime={formatTime}
            onEventAction={handleEventAction}
          />
        ))}
      </div>

      <MessageInput
        messageInput={messageInput}
        onMessageChange={setMessageInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        onSendMessage={handleSend}
        sendMutation={idleSendMutation}
        messageInputRef={inputRef}
        fileInputRef={{ current: null }}
        imageInputRef={{ current: null }}
        onSelectImage={() =>
          toast.info("Los adjuntos se activan al crear tu cuenta.", {
            action: { label: "Crear cuenta", onClick: () => window.open("/register", "_self") },
          })
        }
        onSelectFile={() =>
          toast.info("Los adjuntos se activan al crear tu cuenta.", {
            action: { label: "Crear cuenta", onClick: () => window.open("/register", "_self") },
          })
        }
        onImageChange={() => {}}
        onFileChange={() => {}}
        isUploading={false}
      />
    </div>
  )
}

export function MessagesShowcase() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="w-full bg-surface-container-low py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <m.div
            initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: viewportMargin }}
            transition={t()}
          >
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Conexión directa
            </span>
            <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
              Habla directo con <span className="text-accent font-semibold">quien contrata</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed text-pretty">
              Sin intermediarios ni correos perdidos: la conversación con cada empresa vive junto a
              tu postulación, y las entrevistas se agendan dentro del mismo chat.
            </p>
            <ul className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-secondary"
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </m.div>

          <m.div
            initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: viewportMargin }}
            transition={t(0.1)}
          >
            <ProductShot
              url="biovity.cl/dashboard/messages"
              height="h-[520px] lg:h-[560px]"
              caption="Vista: Mensajes · datos ilustrativos — prueba responder la entrevista"
            >
              <DemoChatThread />
            </ProductShot>
          </m.div>
        </div>
      </div>
    </section>
  )
}

export default MessagesShowcase
