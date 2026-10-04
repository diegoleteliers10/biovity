"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useEffect, useMemo } from "react"
import { getResultErrorMessage } from "@/lib/result"
import { createClientBrowser } from "@/lib/supabase-browser"
import type { Chat } from "./chats"
import { createOrFindChat, getChatsByProfessional, getChatsByRecruiter } from "./chats"
import { parseRealtimeMessage } from "./messages"
import { useRealtimeUserTopic } from "./use-realtime-topics"

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
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
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
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(professionalId),
  })
}

export function useCreateOrFindChatMutation(recruiterId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (professionalId: string) => {
      const result = await createOrFindChat(professionalId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
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

export function useChatListRealtime(chats: Chat[], userId: string | undefined) {
  const queryClient = useQueryClient()
  const topic = useRealtimeUserTopic(userId)
  const chatIds = useMemo(() => {
    if (!Array.isArray(chats)) return new Set<string>()
    return new Set(chats.map((c) => c.id))
  }, [chats])

  useEffect(() => {
    if (chatIds.size === 0 || !topic) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "message_insert" }, (payload) => {
        const message = parseRealtimeMessage(payload)
        if (!message || !chatIds.has(message.chatId)) return

        queryClient.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (prev) => {
          if (!Array.isArray(prev)) return prev
          return prev.map((chat) =>
            chat.id === message.chatId
              ? { ...chat, lastMessage: message.content, updatedAt: message.createdAt }
              : chat
          )
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatIds, queryClient, topic])
}
