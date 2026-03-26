"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { createClientBrowser } from "@/lib/supabase-browser"
import { getMessagesByChatId, type Message, sendMessage } from "./messages"

export const messagesKeys = {
  byChat: (chatId: string) => ["messages", "chat", chatId] as const,
}

export function useMessages(chatId: string | undefined) {
  const queryClient = useQueryClient()
  const effectiveChatId = chatId && chatId.trim() ? chatId : ""

  const query = useQuery({
    queryKey: messagesKeys.byChat(effectiveChatId),
    queryFn: async () => {
      if (!effectiveChatId) throw new Error("Chat ID required")
      // Fetch a large number of messages for now (no pagination)
      const result = await getMessagesByChatId(effectiveChatId, {
        limit: 100,
      })
      if ("error" in result) throw new Error(result.error)
      return result.data ?? []
    },
    enabled: Boolean(effectiveChatId),
  })

  // Sort messages by createdAt ASC
  const messages = query.data
    ? [...query.data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : []

  // Realtime subscription for new messages
  useEffect(() => {
    if (!effectiveChatId) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(`chat:${effectiveChatId}`)
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
          const r = (k: string) =>
            (row[k] ?? row[k.replace(/([A-Z])/g, "_$1").toLowerCase()]) as
              | string
              | boolean
              | undefined
          const chatIdVal = String(r("chatId") ?? r("chat_id") ?? "")
          if (chatIdVal !== effectiveChatId) return
          const msg: Message = {
            id: row.id as string,
            chatId: chatIdVal || effectiveChatId,
            senderId: String(r("senderId") ?? r("sender_id") ?? ""),
            content: String(r("content") ?? ""),
            isRead: Boolean(r("isRead") ?? r("is_read") ?? false),
            createdAt: String(r("createdAt") ?? r("created_at") ?? new Date().toISOString()),
          }
          queryClient.setQueryData(
            messagesKeys.byChat(effectiveChatId),
            (old: Message[] | undefined) => {
              if (!old) return old
              // Avoid duplicates
              if (old.some((m) => m.id === msg.id)) return old
              return [...old, msg]
            }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [effectiveChatId, queryClient])

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useSendMessageMutation(chatId: string, senderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      const result = await sendMessage(chatId, senderId, content)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    onMutate: async (content) => {
      if (!chatId) return
      await queryClient.cancelQueries({
        queryKey: messagesKeys.byChat(chatId),
      })
      const previous = queryClient.getQueryData<Message[]>(messagesKeys.byChat(chatId))
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId,
        senderId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData(messagesKeys.byChat(chatId), (old: Message[] | undefined) => {
        if (!old) return old
        return [...old, tempMessage]
      })
      return { previous }
    },
    onError: (_err, _content, context) => {
      if (context?.previous) {
        queryClient.setQueryData(messagesKeys.byChat(chatId), context.previous)
      }
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(messagesKeys.byChat(chatId), (old: Message[] | undefined) => {
        if (!old) return old
        // Replace temp message with real one
        const tempIndex = old.findIndex((m) => m.id.startsWith("temp-"))
        if (tempIndex >= 0) {
          const next = [...old]
          next[tempIndex] = newMessage
          return next
        }
        // Or add if not exists
        if (old.some((m) => m.id === newMessage.id)) return old
        return [...old, newMessage]
      })
      queryClient.setQueriesData<Record<string, unknown>[]>({ queryKey: ["chats"] }, (prev) => {
        if (!prev) return prev
        return prev.map((chat) =>
          (chat as { id?: string }).id === chatId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                updatedAt: newMessage.createdAt,
              }
            : chat
        )
      })
    },
  })
}
