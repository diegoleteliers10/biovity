"use client"

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { createClientBrowser } from "@/lib/supabase-browser"
import { getMessagesByChatId, type Message, sendMessage } from "./messages"

const MESSAGES_PAGE_SIZE = 30

export const messagesKeys = {
  byChat: (chatId: string) => ["messages", "chat", chatId] as const,
}

export function useInfiniteMessages(chatId: string | undefined) {
  const queryClient = useQueryClient()
  const effectiveChatId = chatId && chatId.trim() ? chatId : ""

  const query = useInfiniteQuery({
    queryKey: messagesKeys.byChat(effectiveChatId),
    queryFn: async ({ pageParam }) => {
      if (!effectiveChatId) throw new Error("Chat ID required")
      const result = await getMessagesByChatId(effectiveChatId, {
        limit: MESSAGES_PAGE_SIZE,
        cursor: pageParam,
      })
      if ("error" in result) throw new Error(result.error)
      return {
        data: result.data ?? [],
        nextCursor: result.nextCursor ?? null,
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: () => undefined,
    getPreviousPageParam: (firstPage) => firstPage?.nextCursor ?? undefined,
    enabled: Boolean(effectiveChatId),
  })

  const messages = Array.isArray(query.data?.pages)
    ? query.data.pages
        .flatMap((p) => p?.data ?? [])
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : []

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
            (old: { pages: { data?: Message[] }[]; pageParams: unknown[] } | undefined) => {
              if (!old?.pages?.length) return old
              const firstPage = old.pages[0]
              const firstData = firstPage?.data ?? []
              if (firstData.some((m) => m.id === msg.id)) return old
              return {
                ...old,
                pages: old.pages.map((p, i) =>
                  i === 0 ? { ...p, data: [...(p.data ?? []), msg] } : p
                ),
              }
            }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [effectiveChatId, queryClient])

  return { ...query, messages }
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
      const previous = queryClient.getQueryData(messagesKeys.byChat(chatId))
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId,
        senderId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData(
        messagesKeys.byChat(chatId),
        (old: { pages: { data?: Message[] }[]; pageParams: unknown[] } | undefined) => {
          if (!old?.pages?.length) return old
          return {
            ...old,
            pages: old.pages.map((p, i) =>
              i === 0 ? { ...p, data: [...(p.data ?? []), tempMessage] } : p
            ),
          }
        }
      )
      return { previous }
    },
    onError: (_err, _content, context) => {
      if (context?.previous) {
        queryClient.setQueryData(messagesKeys.byChat(chatId), context.previous)
      }
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        messagesKeys.byChat(chatId),
        (old: { pages: { data?: Message[] }[]; pageParams: unknown[] } | undefined) => {
          if (!old?.pages?.length) return old
          const firstData = old.pages[0]?.data ?? []
          const tempIndex = firstData.findIndex((m) => m.id.startsWith("temp-"))
          if (tempIndex >= 0) {
            const next = [...firstData]
            next[tempIndex] = newMessage
            return {
              ...old,
              pages: old.pages.map((p, i) => (i === 0 ? { ...p, data: next } : p)),
            }
          }
          if (firstData.some((m) => m.id === newMessage.id)) return old
          return {
            ...old,
            pages: old.pages.map((p, i) =>
              i === 0 ? { ...p, data: [...(p.data ?? []), newMessage] } : p
            ),
          }
        }
      )
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
