"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useQueryState } from "nuqs"
import type * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { getChatById } from "@/lib/api/chats"
import { useChatListRealtime, useChatsByRecruiter } from "@/lib/api/use-chats"
import { useMessages, useSendMessageMutation } from "@/lib/api/use-messages"
import { useUser } from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { getResultErrorMessage } from "@/lib/result"
import { createClientBrowser } from "@/lib/supabase-browser"
import { formatDateChilean } from "@/lib/utils"
import { ChatListPanel } from "./ChatListPanel"
import { ChatView } from "./ChatView"

export function OrganizationMessagesContent() {
  const [chatIdFromUrl, setChatIdFromUrl] = useQueryState("chat", {
    defaultValue: "",
  })

  const { useSession } = authClient
  const { data: session } = useSession()
  const recruiterId = (session?.user as { id?: string })?.id

  const { data: chats = [] } = useChatsByRecruiter(recruiterId)
  useChatListRealtime(chats)

  const { data: chatFromUrl } = useQuery({
    queryKey: ["chat", "fromUrl", chatIdFromUrl],
    queryFn: async () => {
      if (!chatIdFromUrl) return null
      const result = await getChatById(chatIdFromUrl)
      if (!Result.isOk(result)) {
        console.error(getResultErrorMessage(result.error))
        return null
      }
      return result.value
    },
    enabled: Boolean(chatIdFromUrl),
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!chatIdFromUrl) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(`chat-messages-${chatIdFromUrl}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "message" }, () => {
        queryClient.invalidateQueries({ queryKey: ["chat", "fromUrl", chatIdFromUrl] })
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [chatIdFromUrl, queryClient])

  const [selectedChatId, setSelectedChatId] = useState<string | null>(chatIdFromUrl)

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    setChatIdFromUrl(chatId)
  }

  const handleBackToList = () => {
    setSelectedChatId(null)
    setChatIdFromUrl("")
  }

  const selectedChat = selectedChatId
    ? (chats.find((c) => c.id === selectedChatId) ?? chatFromUrl ?? null)
    : null

  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: professional } = useUser(selectedChat?.professionalId)
  const { data: recruiterProfile } = useUser(recruiterId)
  const {
    messages,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorDetail,
    refetch: refetchMessages,
  } = useMessages(selectedChat?.id)
  const sendMutation = useSendMessageMutation()

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior })
    })
  }, [])

  useEffect(() => {
    if (selectedChat?.id && !messagesLoading && messages.length > 0) {
      const timeout = setTimeout(() => scrollToBottom(), 50)
      return () => clearTimeout(timeout)
    }
  }, [selectedChat?.id, messagesLoading, messages.length, scrollToBottom])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !recruiterId) return
    const content = messageInput.trim()
    setMessageInput("")
    scrollToBottom()
    sendMutation.mutate({ chatId: selectedChat.id, senderId: recruiterId, content })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <ChatListPanel
        chats={chats}
        selectedChatId={selectedChat?.id ?? null}
        onSelectChat={handleSelectChat}
        formatTime={formatMessageTime}
      />

      <ChatView
        selectedChat={selectedChat}
        professional={professional}
        recruiterProfile={recruiterProfile}
        recruiterId={recruiterId}
        messages={messages}
        messagesLoading={messagesLoading}
        messagesError={messagesError}
        messagesErrorDetail={messagesErrorDetail}
        onRefetchMessages={refetchMessages}
        onBack={handleBackToList}
        formatMessageTime={formatMessageTime}
        messageInput={messageInput}
        onMessageInputChange={setMessageInput}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isPending={sendMutation.isPending}
        sendError={sendMutation.error}
        messagesEndRef={messagesEndRef}
      />
    </div>
  )
}
