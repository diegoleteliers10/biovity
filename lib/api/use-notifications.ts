"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { getResultErrorMessage } from "@/lib/result"
import { createClientBrowser } from "@/lib/supabase-browser"
import { parseRealtimeMessage } from "./messages"
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationsResponse,
} from "./notifications"
import { useRealtimeUserTopic } from "./use-realtime-topics"

export const notificationsKeys = {
  all: ["notifications"] as const,
  byUser: (userId: string | undefined) => ["notifications", userId ?? ""] as const,
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: notificationsKeys.byUser(userId),
    queryFn: async () => {
      const result = await getNotifications()
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: Boolean(userId),
  })
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await markNotificationRead(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<NotificationsResponse>(notificationsKeys.byUser(userId), (prev) => {
        if (!prev) return prev
        return {
          data: prev.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }
      })
    },
  })
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const result = await markAllNotificationsRead()
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(notificationsKeys.byUser(userId), (prev) => {
        if (!prev) return prev
        return {
          data: prev.data.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }
      })
    },
  })
}

export function useNotificationsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const topic = useRealtimeUserTopic(userId)

  useEffect(() => {
    if (!userId || !topic) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "notification_insert" }, (payload) => {
        const newRow = isRecord(payload) && isRecord(payload.payload) ? payload.payload : payload
        queryClient.invalidateQueries({ queryKey: notificationsKeys.byUser(userId) })

        if (!isRecord(newRow)) return
        const title = String(newRow.title ?? "Nueva notificación")
        const body = String(newRow.body ?? "")
        const link = String(newRow.link ?? "")

        toast.info(title, {
          description: body,
          duration: 8000,
          action: link
            ? {
                label: "Ver",
                onClick: () => push(link),
              }
            : undefined,
        })
      })
      .on("broadcast", { event: "message_insert" }, (payload) => {
        if (!parseRealtimeMessage(payload)) return
        queryClient.invalidateQueries({ queryKey: ["chats"] })
      })
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [userId, queryClient, push, topic])
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
