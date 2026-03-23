"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { createClientBrowser } from "@/lib/supabase-browser"
import type { Chat } from "./chats"
import { createOrFindChat, getChatsByProfessional, getChatsByRecruiter } from "./chats"

export const chatsKeys = {
  byRecruiter: (recruiterId: string) => ["chats", "recruiter", recruiterId] as const,
  byProfessional: (professionalId: string) => ["chats", "professional", professionalId] as const,
}

export function useChatsByRecruiter(recruiterId: string | undefined) {
  return useQuery({
    queryKey: chatsKeys.byRecruiter(recruiterId ?? ""),
    queryFn: async () => {
      if (!recruiterId) throw new Error("Recruiter ID required")
      const result = await getChatsByRecruiter(recruiterId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(recruiterId),
  })
}

export function useChatsByProfessional(professionalId: string | undefined) {
  return useQuery({
    queryKey: chatsKeys.byProfessional(professionalId ?? ""),
    queryFn: async () => {
      if (!professionalId) throw new Error("Professional ID required")
      const result = await getChatsByProfessional(professionalId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(professionalId),
  })
}

export function useCreateOrFindChatMutation(recruiterId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (professionalId: string) => {
      const result = await createOrFindChat(professionalId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      if (recruiterId) {
        void queryClient.invalidateQueries({
          queryKey: chatsKeys.byRecruiter(recruiterId),
        })
      }
    },
  })
}

export function useChatListRealtime(chats: Chat[]) {
  const queryClient = useQueryClient()
  const chatIds = useMemo(() => {
    if (!Array.isArray(chats)) return new Set<string>()
    return new Set(chats.map((c) => c.id))
  }, [chats])

  useEffect(() => {
    if (chatIds.size === 0) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel("chat-list-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          const r = (k: string) => row[k] ?? row[k.replace(/([A-Z])/g, "_$1").toLowerCase()]
          const msgChatId = String(r("chatId") ?? r("chat_id") ?? "")
          if (!chatIds.has(msgChatId)) return

          const content = String(r("content") ?? "")
          const createdAt = String(r("createdAt") ?? r("created_at") ?? new Date().toISOString())

          queryClient.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (prev) => {
            if (!Array.isArray(prev)) return prev
            return prev.map((chat) =>
              chat.id === msgChatId ? { ...chat, lastMessage: content, updatedAt: createdAt } : chat
            )
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatIds, queryClient])
}
