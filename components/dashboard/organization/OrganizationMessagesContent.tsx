"use client"

import {
  Attachment01Icon,
  Briefcase01Icon,
  BubbleChatIcon,
  Calendar04Icon,
  CheckmarkCircle02Icon,
  Image01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useSearchParams } from "next/navigation"
import type * as React from "react"
import { useEffect, useRef, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatById, type Chat } from "@/lib/api/chats"
import type { Message } from "@/lib/api/messages"
import { useChatListRealtime, useChatsByRecruiter } from "@/lib/api/use-chats"
import { useInfiniteMessages, useSendMessageMutation } from "@/lib/api/use-messages"
import { useUser } from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"

export function OrganizationMessagesContent() {
  const searchParams = useSearchParams()
  const chatIdFromUrl = searchParams.get("chat")

  const { useSession } = authClient
  const { data: session } = useSession()
  const recruiterId = (session?.user as { id?: string })?.id

  const { data: chats = [], isLoading: chatsLoading } = useChatsByRecruiter(recruiterId)
  useChatListRealtime(chats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

  useEffect(() => {
    if (!chatIdFromUrl) return

    const found = chats.find((c) => c.id === chatIdFromUrl)
    if (found) {
      setSelectedChat(found)
      return
    }

    const loadChat = async () => {
      const result = await getChatById(chatIdFromUrl)
      if ("data" in result) {
        setSelectedChat(result.data)
      }
    }
    void loadChat()
  }, [chatIdFromUrl, chats])
  const [messageInput, setMessageInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: professional } = useUser(selectedChat?.professionalId)
  const { data: recruiterProfile } = useUser(recruiterId)
  const {
    messages,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorDetail,
    refetch: refetchMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteMessages(selectedChat?.id)
  const sendMutation = useSendMessageMutation(selectedChat?.id ?? "", recruiterId ?? "")

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior })
    })
  }

  const lastMessageId = messages[messages.length - 1]?.id

  useEffect(() => {
    if (selectedChat?.id && !messagesLoading && messages.length > 0 && lastMessageId) {
      scrollToBottom()
    }
  }, [selectedChat?.id, messagesLoading, lastMessageId])

  const handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const threshold = 80
    if (el.scrollTop <= threshold && hasPreviousPage && !isFetchingPreviousPage) {
      const prevScrollHeight = el.scrollHeight
      const prevScrollTop = el.scrollTop
      fetchPreviousPage().then(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight
          el.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
        })
      })
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !recruiterId) return
    sendMutation.mutate(messageInput.trim(), {
      onSuccess: () => {
        setMessageInput("")
        scrollToBottom()
      },
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const professionalName = professional?.name ?? "Profesional"
  const professionalInitials = professionalName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const formatMessageTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      if (diff < 86400000) return format(d, "HH:mm", { locale: es })
      if (diff < 604800000) return format(d, "EEE", { locale: es })
      return format(d, "d MMM", { locale: es })
    } catch {
      return ""
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="flex w-80 flex-col overflow-hidden border-r border-border max-h-dvh">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
              <p className="mt-1 text-muted-foreground text-sm">
                {chatsLoading ? "Cargando..." : `${chats.length} conversaciones activas`}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="size-9" aria-label="Más opciones">
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </Button>
          </div>

          <div className="relative mb-6">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar conversaciones..."
              className="h-10 border-muted bg-muted/50 pl-10 transition-colors focus:bg-background"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={() => setSelectedChat(chat)}
            />
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden max-h-dvh">
        {!selectedChat ? (
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
        ) : (
          <>
            {/* Chat header */}
            <div className="shrink-0 border-b border-border bg-background p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-3">
                  <Avatar className="size-12">
                    {professional?.avatar && <AvatarImage src={professional.avatar} alt="" />}
                    <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
                      {professionalInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-lg font-semibold text-foreground text-balance">
                      {professionalName}
                    </h2>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <HugeiconsIcon icon={Briefcase01Icon} size={14} className="shrink-0" />
                      <span className="truncate">{professional?.profession ?? "—"}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Más opciones">
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-message-hide min-h-0"
              onScroll={handleMessagesScroll}
            >
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground text-sm">Cargando mensajes...</p>
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
                  {isFetchingPreviousPage && (
                    <div className="flex justify-center py-2">
                      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  )}
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
                      senderAvatar={(msg.senderId === recruiterId ? recruiterProfile?.avatar : professional?.avatar) ?? undefined}
                      formatTime={formatMessageTime}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border bg-background p-4">
              {sendMutation.isError && (
                <p className="mb-2 text-destructive text-sm">
                  {sendMutation.error instanceof Error
                    ? sendMutation.error.message
                    : "Error al enviar"}
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  className="hidden"
                  aria-label="Seleccionar archivos"
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  aria-label="Seleccionar imágenes"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Adjuntar">
                      <HugeiconsIcon icon={Attachment01Icon} size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Adjuntar</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <HugeiconsIcon icon={Image01Icon} size={18} className="mr-2 size-4" />
                      Imágenes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <HugeiconsIcon icon={Calendar04Icon} size={18} className="mr-2 size-4" />
                      Reunión
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <HugeiconsIcon icon={Attachment01Icon} size={18} className="mr-2 size-4" />
                      Archivos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="relative flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value)
                      e.target.style.height = "auto"
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="w-full min-h-[36px] max-h-[120px] resize-none overflow-y-auto rounded-md border border-input bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={1}
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendMutation.isPending}
                  size="icon"
                  aria-label="Enviar"
                >
                  <HugeiconsIcon icon={Sent02Icon} size={20} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ChatListItem({
  chat,
  isSelected,
  onSelect,
}: {
  chat: Chat
  isSelected: boolean
  onSelect: () => void
}) {
  const { data: professional } = useUser(chat.professionalId)
  const name = professional?.name ?? "Profesional"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      if (diff < 86400000) return format(d, "HH:mm", { locale: es })
      if (diff < 604800000) return format(d, "EEE", { locale: es })
      return format(d, "d MMM", { locale: es })
    } catch {
      return ""
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`cursor-pointer border-b border-border p-4 transition-colors hover:bg-muted/30 focus-visible:bg-muted/50 ${
        isSelected ? "bg-muted/50" : ""
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          {professional?.avatar && <AvatarImage src={professional.avatar} alt="" />}
          <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="truncate text-sm font-semibold">{name}</h3>
            <span className="ml-2 shrink-0 text-muted-foreground text-xs">
              {formatTime(chat.updatedAt)}
            </span>
          </div>
          <p className="truncate text-muted-foreground text-sm">{chat.lastMessage ?? "—"}</p>
          {chat.unreadCountRecruiter > 0 && (
            <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {chat.unreadCountRecruiter}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isOwn,
  senderName,
  senderInitials,
  senderAvatar,
  formatTime,
}: {
  message: Message
  isOwn: boolean
  senderName: string
  senderInitials: string
  senderAvatar?: string
  formatTime: (iso: string) => string
}) {
  const chatAlign = isOwn ? "chat-end" : "chat-start"
  const bubbleColor = isOwn ? "chat-bubble-primary" : "chat-bubble-neutral"

  return (
    <div className={`chat ${chatAlign}`}>
      <div className="chat-image avatar">
        <div className="size-10 overflow-hidden rounded-full">
          <Avatar className="size-10 rounded-full">
            {senderAvatar && <AvatarImage src={senderAvatar} alt="" />}
            <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
              {senderInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="chat-header">
        {senderName}
        <time className="text-xs opacity-50">{formatTime(message.createdAt)}</time>
      </div>
      <div className={`chat-bubble ${bubbleColor}`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        {isOwn && (
          <div className="mt-1 flex justify-end">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="opacity-70" />
          </div>
        )}
      </div>
    </div>
  )
}
