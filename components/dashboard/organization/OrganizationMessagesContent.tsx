"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useQueryState } from "nuqs"
import type * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAutoScrollToBottom } from "@/hooks/use-auto-scroll-to-bottom"
import { getChatById } from "@/lib/api/chats"
import { uploadMessageAttachment } from "@/lib/api/messages"
import { useChatListRealtime, useChatsByRecruiter } from "@/lib/api/use-chats"
import {
  useMarkChatAsReadMutation,
  useMessages,
  useSendMessageMutation,
} from "@/lib/api/use-messages"
import { useUser } from "@/lib/api/use-profile"
import { getResultErrorMessage } from "@/lib/result"
import { createClientBrowser } from "@/lib/supabase-browser"
import { formatDateChilean } from "@/lib/utils"
import { useDashboardSession } from "../DashboardSessionContext"
import { ChatListPanel } from "./ChatListPanel"
import { ChatView } from "./ChatView"
import { MessagesEmptyState } from "./MessagesEmptyState"

function useChatMessageRealtime(
  chatIdFromUrl: string,
  queryClient: ReturnType<typeof useQueryClient>
) {
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
}

export function OrganizationMessagesContent() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [chatIdFromUrl, setChatIdFromUrl] = useQueryState("chat", {
    defaultValue: "",
  })

  const session = useDashboardSession()
  const recruiterId = session?.user?.id ?? undefined

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

  useChatMessageRealtime(chatIdFromUrl, queryClient)

  const [mobileView, setMobileView] = useState<"list" | "chat">(
    chatIdFromUrl ? "chat" : "list"
  )

  useEffect(() => {
    if (chatIdFromUrl) {
      setMobileView("chat")
    } else {
      setMobileView("list")
    }
  }, [chatIdFromUrl])

  const [selectedChatId, setSelectedChatId] = useState<string | null>(chatIdFromUrl)

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    setChatIdFromUrl(chatId)
    setMobileView("chat")
    if (recruiterId) {
      markAsReadMutation.mutate({ chatId, userId: recruiterId })
    }
  }

  const handleBackToList = () => {
    setSelectedChatId(null)
    setChatIdFromUrl("")
    setMobileView("list")
  }

  const selectedChat = selectedChatId
    ? (chats.find((c) => c.id === selectedChatId) ?? chatFromUrl ?? null)
    : null

  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
  const markAsReadMutation = useMarkChatAsReadMutation()

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior,
        })
      }
    })
  }, [])

  useAutoScrollToBottom(selectedChat?.id, messagesLoading, messages.length, scrollToBottom)

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

  const [isUploading, setIsUploading] = useState(false)

  const handleSendAttachment = useCallback(
    async (file: File, kind: "image" | "file") => {
      if (!selectedChat || !recruiterId) return
      setIsUploading(true)
      const result = await uploadMessageAttachment(file, selectedChat.id)
      setIsUploading(false)
      if (!Result.isOk(result)) {
        console.error(getResultErrorMessage(result.error))
        return
      }
      const att = result.value
      sendMutation.mutate({
        chatId: selectedChat.id,
        senderId: recruiterId,
        content: kind === "image" ? "" : att.name,
        type: kind,
        contentType: { url: att.url, name: att.name, size: att.size, mimeType: att.mimeType },
      })
    },
    [selectedChat, recruiterId, sendMutation]
  )

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) void handleSendAttachment(file, "image")
      e.target.value = ""
    },
    [handleSendAttachment]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) void handleSendAttachment(file, "file")
      e.target.value = ""
    },
    [handleSendAttachment]
  )

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

  if (!mounted) {
    return null
  }

  if (chats.length === 0 && !selectedChatId) {
    return <MessagesEmptyState />
  }

  return (
    <div className="flex h-[calc(100dvh_-_1rem)] min-h-0 flex-none flex-col overflow-hidden lg:flex-row w-full">
      <ChatListPanel
        chats={chats}
        selectedChatId={selectedChat?.id ?? null}
        onSelectChat={handleSelectChat}
        formatTime={formatMessageTime}
        className={mobileView === "chat" ? "max-lg:hidden" : ""}
      />

      <ChatView
        scrollContainerRef={scrollContainerRef}
        selectedChat={selectedChat}
        professional={professional}
        recruiterProfile={recruiterProfile}
        recruiterId={recruiterId}
        organizationId={
          session?.user?.organizationId ?? recruiterProfile?.organizationId ?? undefined
        }
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
        onImageChange={handleImageChange}
        onFileChange={handleFileChange}
        isUploading={isUploading}
        messagesEndRef={messagesEndRef}
        className={mobileView === "list" ? "max-lg:hidden" : ""}
      />
    </div>
  )
}
