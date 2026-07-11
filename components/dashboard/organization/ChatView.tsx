"use client"

import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as React from "react"
import { useCallback, useState } from "react"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "@/components/ui/message-bubble"
import { useChatPresence } from "@/hooks/use-chat-presence"
import type { Message } from "@/lib/api/messages"
import { useEvent } from "@/lib/api/use-events"
import { cn } from "@/lib/utils"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"

interface ChatViewProps {
  selectedChat: { id: string; professionalId: string } | null
  professional:
    | { name?: string | null; avatar?: string | null; profession?: string | null }
    | undefined
  recruiterProfile: { name?: string | null; avatar?: string | null } | undefined
  recruiterId: string | undefined
  organizationId?: string
  messages: Message[]
  messagesLoading: boolean
  messagesError: boolean
  messagesErrorDetail: unknown
  onRefetchMessages: () => void
  onBack: () => void
  formatMessageTime: (iso: string) => string
  messageInput: string
  onMessageInputChange: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  isPending: boolean
  sendError: Error | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function ChatView({
  selectedChat,
  professional,
  recruiterProfile,
  recruiterId,
  organizationId,
  messages,
  messagesLoading,
  messagesError,
  messagesErrorDetail,
  onRefetchMessages,
  onBack,
  formatMessageTime,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onKeyPress,
  isPending,
  sendError,
  onImageChange,
  onFileChange,
  isUploading,
  messagesEndRef,
  scrollContainerRef,
  className,
}: ChatViewProps) {
  const professionalName = professional?.name ?? "Profesional"
  const professionalInitials = professionalName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const { event: editingEventData } = useEvent(editingEventId ?? undefined)

  const { isTyping, trackTyping } = useChatPresence(selectedChat?.id, recruiterId)

  const handleInputChange = useCallback(
    (value: string) => {
      onMessageInputChange(value)
      trackTyping()
    },
    [onMessageInputChange, trackTyping]
  )

  const handleCreateEventFromChat = useCallback(() => {
    setEditingEventId(null)
    setShowEventModal(true)
  }, [])

  const handleEditEventFromChat = useCallback((eventId: string) => {
    setEditingEventId(eventId)
    setShowEventModal(true)
  }, [])

  return (
    <div
      className={cn(
        "flex flex-1 flex-col overflow-hidden h-full min-h-0 transition-all",
        className
      )}
    >
      {!selectedChat ? (
        <EmptyChatState />
      ) : (
        <>
          <ChatHeader
            professionalName={professionalName}
            professionalInitials={professionalInitials}
            professionalAvatar={professional?.avatar}
            professionalProfession={professional?.profession}
            showBackButton={true}
            onBack={onBack}
            isTyping={isTyping}
          />

          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-message-hide min-h-0"
          >
            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground text-sm">Cargando mensajes…</p>
              </div>
            ) : messagesError ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <p className="text-destructive text-sm">
                  {messagesErrorDetail instanceof Error
                    ? messagesErrorDetail.message
                    : "Error al cargar mensajes"}
                </p>
                <Button variant="outline" size="sm" onClick={onRefetchMessages}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === recruiterId}
                    senderName={msg.senderId === recruiterId ? "Tú" : professionalName}
                    senderInitials={
                      msg.senderId === recruiterId
                        ? (recruiterProfile?.name ?? "Tú")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : professionalInitials
                    }
                    senderAvatar={
                      (msg.senderId === recruiterId
                        ? recruiterProfile?.avatar
                        : professional?.avatar) ?? undefined
                    }
                    formatTime={formatMessageTime}
                    onEditEvent={handleEditEventFromChat}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <MessageInput
            value={messageInput}
            onChange={handleInputChange}
            onSend={onSendMessage}
            onKeyPress={onKeyPress}
            isPending={isPending}
            sendError={sendError}
            onImageChange={onImageChange}
            onFileChange={onFileChange}
            isUploading={isUploading}
            onCreateEvent={handleCreateEventFromChat}
            organizationId={organizationId}
          />
        </>
      )}

      {showEventModal && selectedChat && recruiterId && (!editingEventId || editingEventData) && (
        <EventFormModal
          key={`${selectedChat.id}-${recruiterId}-${editingEventId ?? "new"}`}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setEditingEventId(null)
          }}
          organizerId={recruiterId}
          organizationId={organizationId}
          candidateId={selectedChat.professionalId}
          lockedType="interview"
          editEvent={editingEventData}
          onSuccess={() => {
            setShowEventModal(false)
            setEditingEventId(null)
          }}
          onDelete={() => {
            setShowEventModal(false)
            setEditingEventId(null)
          }}
        />
      )}
    </div>
  )
}

function EmptyChatState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md rounded-2xl bg-transparent px-6 py-7 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
          <HugeiconsIcon
            icon={BubbleChatIcon}
            size={24}
            strokeWidth={1.5}
            className="size-8 text-secondary-foreground"
          />
        </div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Mensajeria
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Tus mensajes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona una conversación en la izquierda para comenzar.
        </p>
      </div>
    </div>
  )
}
