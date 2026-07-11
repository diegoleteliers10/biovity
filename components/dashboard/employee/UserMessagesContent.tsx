"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { ChatListSidebar } from "@/components/dashboard/employee/ChatListSidebar"
import { EmptyStateView } from "@/components/dashboard/employee/EmptyStateView"
import { MessageThread } from "@/components/dashboard/employee/MessageThread"
import type { Chat } from "@/lib/api/chats"
import { getChatById } from "@/lib/api/chats"
import { useChatListRealtime, useChatsByProfessional } from "@/lib/api/use-chats"
import {
  useMarkChatAsReadMutation,
  useMessages,
  useSendMessageMutation,
} from "@/lib/api/use-messages"
import { useUser } from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { getResultErrorMessage } from "@/lib/result"
import { cn, formatDateChilean } from "@/lib/utils"

export function UserMessagesContent() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [chatIdFromUrl, setChatIdFromUrl] = useQueryState("chat", {
    defaultValue: "",
  })

  const { useSession } = authClient
  const { data: session } = useSession()
  const professionalId = (session?.user as { id?: string })?.id

  const [mobileView, setMobileView] = useState<"list" | "chat">("list")

  const { data: chats = [], isLoading: chatsLoading } = useChatsByProfessional(professionalId)
  useChatListRealtime(chats)
  const markChatAsRead = useMarkChatAsReadMutation()

  const { data: chatFromUrl } = useQuery({
    queryKey: ["chat", "fromUrl", chatIdFromUrl],
    queryFn: async () => {
      const result = await getChatById(chatIdFromUrl!)
      if (!Result.isOk(result)) {
        console.error(getResultErrorMessage(result.error))
        return null
      }
      return result.value
    },
    enabled: Boolean(chatIdFromUrl),
  })

  const selectedChat = chatIdFromUrl
    ? (chats.find((c) => c.id === chatIdFromUrl) ?? chatFromUrl ?? null)
    : null

  const handleSelectChat = (chat: Chat) => {
    setMobileView("chat")
    setChatIdFromUrl(chat.id)
    if (professionalId) {
      markChatAsRead.mutate({ chatId: chat.id, userId: professionalId })
    }
  }

  const handleBackToList = () => {
    setMobileView("list")
    setChatIdFromUrl("")
  }

  const { data: recruiter } = useUser(selectedChat?.recruiterId)
  const { data: professionalProfile } = useUser(professionalId)
  const {
    messages,
    isLoading: messagesLoading,
    isError: messagesError,
    error: messagesErrorDetail,
    refetch: refetchMessages,
  } = useMessages(selectedChat?.id)
  const sendMutation = useSendMessageMutation()

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

  const recruiterName = recruiter?.name ?? "Reclutador"
  const recruiterInitials = recruiterName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (!mounted) return null

  return (
    <div className="flex h-[calc(100dvh_-_1rem)] min-h-0 flex-none flex-col overflow-hidden lg:flex-row w-full">
      <div
        className={cn(
          "flex w-full h-full min-h-0 lg:w-80 flex-col overflow-hidden border-r border-border transition-all",
          mobileView === "chat" ? "hidden lg:flex" : "flex"
        )}
      >
        <ChatListSidebar
          chats={chats}
          chatsLoading={chatsLoading}
          selectedChatId={selectedChat?.id ?? null}
          onSelectChat={handleSelectChat}
          formatTime={formatMessageTime}
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden h-full min-h-0 transition-all",
          mobileView === "list" ? "hidden lg:flex" : "flex"
        )}
      >
        {!selectedChat ? (
          <EmptyStateView />
        ) : (
          <MessageThread
            selectedChat={selectedChat}
            recruiter={recruiter}
            recruiterName={recruiterName}
            recruiterInitials={recruiterInitials}
            professionalId={professionalId}
            professionalProfile={professionalProfile}
            messages={messages}
            messagesLoading={messagesLoading}
            messagesError={messagesError}
            messagesErrorDetail={messagesErrorDetail}
            refetchMessages={refetchMessages}
            onBackToList={handleBackToList}
            formatTime={formatMessageTime}
            sendMutation={sendMutation}
          />
        )}
      </div>
    </div>
  )
}
