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
import { useQueryState } from "nuqs"
import type * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChatListItem, MessageBubble } from "@/components/ui/message-bubble"
import { useDebounce } from "@/hooks/use-debounce"
import type { Chat } from "@/lib/api/chats"
import type { Message } from "@/lib/api/messages"
import { useChatListRealtime, useChatsByProfessional } from "@/lib/api/use-chats"
import { useMessages, useSendMessageMutation } from "@/lib/api/use-messages"
import { useUser } from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { formatDateChilean } from "@/lib/utils"

export function UserMessagesContent() {
  const { useSession } = authClient
  const { data: session } = useSession()
  const professionalId = (session?.user as { id?: string })?.id

  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  })
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const { data: chats = [], isLoading: chatsLoading } = useChatsByProfessional(professionalId)
  useChatListRealtime(chats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: recruiter } = useUser(selectedChat?.recruiterId)
  const { data: professionalProfile } = useUser(professionalId)
  const {
    messages,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorDetail,
    refetch: refetchMessages,
  } = useMessages(selectedChat?.id)
  const sendMutation = useSendMessageMutation(selectedChat?.id ?? "", professionalId ?? "")

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior })
    })
  }

  useEffect(() => {
    if (selectedChat?.id && !messagesLoading && messages.length > 0) {
      const timeout = setTimeout(() => scrollToBottom(), 50)
      return () => clearTimeout(timeout)
    }
  }, [selectedChat?.id, messagesLoading, messages.length])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !professionalId) return
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

  const recruiterName = recruiter?.name ?? "Reclutador"
  const recruiterInitials = recruiterName
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
      if (diff < 86400000) return formatDateChilean(iso, "HH:mm")
      if (diff < 604800000) return formatDateChilean(iso, "EEE")
      return formatDateChilean(iso, "d MMM")
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              searchQuery={debouncedSearchQuery}
              contactType="recruiter"
              formatTime={formatMessageTime}
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
                    {recruiter?.avatar && <AvatarImage src={recruiter.avatar} alt="" />}
                    <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
                      {recruiterInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="text-lg font-semibold text-foreground text-balance">
                      {recruiterName}
                    </h2>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <HugeiconsIcon icon={Briefcase01Icon} size={14} className="shrink-0" />
                      <span className="truncate">{recruiter?.profession ?? "—"}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Más opciones">
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-message-hide min-h-0">
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
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.senderId === professionalId}
                      senderName={msg.senderId === professionalId ? "Tú" : recruiterName}
                      senderInitials={
                        msg.senderId === professionalId
                          ? (professionalProfile?.name ?? "Tú")
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
