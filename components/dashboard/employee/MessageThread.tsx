"use client"

import type * as React from "react"
import { useCallback, useRef } from "react"
import { ChatHeader } from "@/components/dashboard/employee/ChatHeader"
import { MessageInput } from "@/components/dashboard/employee/MessageInput"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "@/components/ui/message-bubble"
import type { MessageType } from "@/lib/api/messages"
import type { UseSendMessageMutation } from "@/lib/api/use-messages"
import type { User } from "@/lib/api/users"

type Message = {
  id: string
  content: string
  senderId: string
  createdAt: string
  type: MessageType
  contentType: Record<string, unknown> | null
}

type MessageThreadProps = {
  selectedChat: { id: string; recruiterId: string } | null
  recruiter: User | null | undefined
  recruiterName: string
  recruiterInitials: string
  professionalId: string | undefined
  professionalProfile: User | null | undefined
  messages: Message[]
  messagesLoading: boolean
  messagesError: boolean
  messagesErrorDetail: Error | null
  refetchMessages: () => void
  onBackToList: () => void
  formatTime: (iso: string) => string
  sendMutation: ReturnType<UseSendMessageMutation>
}

export function MessageThread({
  selectedChat,
  recruiter,
  recruiterName,
  recruiterInitials,
  professionalId,
  professionalProfile,
  messages,
  messagesLoading,
  messagesError,
  messagesErrorDetail,
  refetchMessages,
  onBackToList,
  formatTime,
  sendMutation,
}: MessageThreadProps) {
  const [messageInput, setMessageInput] = React.useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior })
    })
  }, [])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !professionalId) return
    const content = messageInput.trim()
    setMessageInput("")
    if (messageInputRef.current) {
      const current = messageInputRef.current.style.cssText
      messageInputRef.current.style.cssText = `${current} height: 40px; overflow-y: hidden;`
    }
    scrollToBottom()
    sendMutation.mutate({ chatId: selectedChat.id, senderId: professionalId, content })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!selectedChat) return null

  return (
    <>
      <ChatHeader
        recruiter={recruiter}
        recruiterName={recruiterName}
        recruiterInitials={recruiterInitials}
        onBackToList={onBackToList}
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-message-hide min-h-0">
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
            <Button variant="outline" size="sm" onClick={() => refetchMessages()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === professionalId}
                senderName={msg.senderId === professionalId ? "Tu" : recruiterName}
                senderInitials={
                  msg.senderId === professionalId
                    ? (professionalProfile?.name ?? "Tu")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : recruiterInitials
                }
                senderAvatar={
                  (msg.senderId === professionalId
                    ? professionalProfile?.avatar
                    : recruiter?.avatar) ?? undefined
                }
                formatTime={formatTime}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput
        messageInput={messageInput}
        onMessageChange={setMessageInput}
        onKeyDown={handleKeyPress}
        onSendMessage={handleSendMessage}
        sendMutation={sendMutation}
        messageInputRef={messageInputRef}
        fileInputRef={fileInputRef}
        imageInputRef={imageInputRef}
      />
    </>
  )
}
