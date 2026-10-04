"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import {
  getMessagesByChatId,
  type Message,
  type MessageType,
  markChatAsRead,
  sendMessage,
} from "./messages"

export const messagesKeys = {
  byChat: (chatId: string) => ["messages", "chat", chatId] as const,
}

export function useMessages(chatId: string | undefined, userId: string | undefined) {
  const effectiveChatId = chatId?.trim() ? chatId : ""

  const query = useQuery({
    queryKey: messagesKeys.byChat(effectiveChatId),
    queryFn: async ({ signal }) => {
      if (!effectiveChatId) return Promise.reject(new Error("Chat ID required"))
      const result = await getMessagesByChatId(effectiveChatId, { limit: 100 }, undefined, signal)
      if (!Result.isOk(result)) return Promise.reject(result.error)
      return result.value.data ?? []
    },
    enabled: Boolean(effectiveChatId && userId),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    // Fallback only. The realtime broadcast is the primary path, so this poll
    // just covers a dropped channel. It pauses while the tab is hidden.
    refetchInterval: 30_000,
  })

  const messages = query.data
    ? [...query.data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : []

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
      if (!Result.isOk(result)) return Promise.reject(result.error)
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
      if (!Result.isOk(result)) return Promise.reject(result.error)
    },
    onSuccess: (_, variables) => {
      queryClient.setQueriesData<Record<string, unknown>[]>({ queryKey: ["chats"] }, (prev) => {
        if (!prev) return prev
        return prev.map((chat) =>
          (chat as { id?: string }).id === variables.chatId
            ? {
                ...chat,
                unreadCountRecruiter:
                  chat.recruiterId === variables.userId ? 0 : chat.unreadCountRecruiter,
                unreadCountProfessional:
                  chat.professionalId === variables.userId ? 0 : chat.unreadCountProfessional,
              }
            : chat
        )
      })
    },
  })
}
