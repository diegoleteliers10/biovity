"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { createClientBrowser } from "@/lib/supabase-browser"
import { getMessagesByChatId, sendMessage, type Message } from "./messages"

export const messagesKeys = {
  byChat: (chatId: string) => ["messages", "chat", chatId] as const,
}

export function useMessages(chatId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: messagesKeys.byChat(chatId ?? ""),
    queryFn: async () => {
      if (!chatId) throw new Error("Chat ID required")
      const result = await getMessagesByChatId(chatId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(chatId),
  })

  useEffect(() => {
    if (!chatId) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          if (!row?.id) return
          if (String(row.chatId ?? "") !== chatId) return
          const msg: Message = {
            id: row.id as string,
            chatId: (row.chatId as string) ?? chatId,
            senderId: (row.senderId as string) ?? "",
            content: (row.content as string) ?? "",
            isRead: (row.isRead as boolean) ?? false,
            createdAt: (row.createdAt as string) ?? new Date().toISOString(),
          }
          queryClient.setQueryData<Message[]>(messagesKeys.byChat(chatId), (prev) => {
            const list = prev ?? []
            if (list.some((m) => m.id === msg.id)) return prev
            return [...list, msg]
          })
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Realtime] Subscribed to postgres_changes for chat:", chatId)
        } else if (status === "CHANNEL_ERROR") {
          console.error("[Realtime] Channel error for chat:", chatId)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, queryClient])

  return query
}

export function useSendMessageMutation(chatId: string, senderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      const result = await sendMessage(chatId, senderId, content)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(messagesKeys.byChat(chatId), (prev) => {
        const list = prev ?? []
        if (list.some((m) => m.id === newMessage.id)) return prev
        return [...list, newMessage]
      })
      queryClient.setQueriesData<Record<string, unknown>[]>(
        { queryKey: ["chats"] },
        (prev) => {
          if (!prev) return prev
          return prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, lastMessage: newMessage.content, updatedAt: newMessage.createdAt }
              : chat
          )
        }
      )
    },
  })
}
