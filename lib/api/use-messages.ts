"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useEffect } from "react"
import { createClientBrowser } from "@/lib/supabase-browser"
import {
  getMessagesByChatId,
  type Message,
  type MessageType,
  markChatAsRead,
  parseRealtimeMessage,
  sendMessage,
} from "./messages"
import { useRealtimeUserTopic } from "./use-realtime-topics"

export const messagesKeys = {
  byChat: (chatId: string) => ["messages", "chat", chatId] as const,
}

export function useMessages(chatId: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient()
  const effectiveChatId = chatId?.trim() ? chatId : ""
  const topic = useRealtimeUserTopic(userId)

  const query = useQuery({
    queryKey: messagesKeys.byChat(effectiveChatId),
    queryFn: async () => {
      if (!effectiveChatId) throw new Error("Chat ID required")
      const result = await getMessagesByChatId(effectiveChatId, {
        limit: 100,
      })
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value.data ?? []
    },
    enabled: Boolean(effectiveChatId),
  })

  const messages = query.data
    ? [...query.data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : []

  useEffect(() => {
    if (!effectiveChatId || !topic) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "message_insert" }, (payload) => {
        const msg = parseRealtimeMessage(payload)
        if (!msg || msg.chatId !== effectiveChatId) return
        queryClient.setQueryData(
          messagesKeys.byChat(effectiveChatId),
          (old: Message[] | undefined) => {
            if (!old) return old
            if (old.some((m) => m.id === msg.id)) return old
            return [...old, msg]
          }
        )
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [effectiveChatId, queryClient, topic])

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export type SendMessageInput = {
  chatId: string
  senderId: string
  content: string
  type?: MessageType
  contentType?: Record<string, unknown> | null
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const result = await sendMessage(input)
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value
    },
    onMutate: async (input) => {
      if (!input.chatId) return
      await queryClient.cancelQueries({
        queryKey: messagesKeys.byChat(input.chatId),
      })
      const tempMessage: Message = {
        id: `temp-${crypto.randomUUID()}`,
        chatId: input.chatId,
        senderId: input.senderId,
        content: input.content,
        type: input.type ?? "text",
        contentType: input.contentType ?? null,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData(messagesKeys.byChat(input.chatId), (old: Message[] | undefined) => {
        if (!old) return old
        if (old.some((m) => m.id === tempMessage.id)) return old
        return [...old, tempMessage]
      })
      return { tempId: tempMessage.id }
    },
    mutationKey: ["sendMessage"],
    onError: (_err, input, context) => {
      if (!context?.tempId) return
      queryClient.setQueryData<Message[]>(messagesKeys.byChat(input.chatId), (old) =>
        old?.filter((message) => message.id !== context.tempId)
      )
    },
    onSuccess: (newMessage, _input, context) => {
      queryClient.setQueryData(
        messagesKeys.byChat(newMessage.chatId),
        (old: Message[] | undefined) => {
          if (!old) return old
          const withoutThisOptimistic = old.filter((message) => message.id !== context?.tempId)
          if (withoutThisOptimistic.some((message) => message.id === newMessage.id)) {
            return withoutThisOptimistic
          }
          return [...withoutThisOptimistic, newMessage]
        }
      )
      queryClient.setQueriesData<Record<string, unknown>[]>({ queryKey: ["chats"] }, (prev) => {
        if (!prev) return prev
        return prev.map((chat) =>
          (chat as { id?: string }).id === newMessage.chatId
            ? {
                ...chat,
                lastMessage: newMessage.type === "event" ? "Evento" : newMessage.content,
                updatedAt: newMessage.createdAt,
              }
            : chat
        )
      })
    },
  })
}

export function useMarkChatAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ chatId, userId }: { chatId: string; userId: string }) => {
      const result = await markChatAsRead(chatId, userId)
      if (!Result.isOk(result)) throw new Error(result.error.message)
    },
    onSuccess: (_, variables) => {
      // Reset unreadCount locally in cache
      queryClient.setQueriesData<Record<string, unknown>[]>({ queryKey: ["chats"] }, (prev) => {
        if (!prev) return prev
        return prev.map((chat) =>
          (chat as { id?: string }).id === variables.chatId
            ? {
                ...chat,
                unreadCountRecruiter: 0,
                unreadCountProfessional: 0,
              }
            : chat
        )
      })
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}
