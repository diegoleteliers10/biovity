"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { getResultErrorMessage } from "@/lib/result"
import { createClientBrowser } from "@/lib/supabase-browser"
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationsResponse,
} from "./notifications"

export const notificationsKeys = {
  all: ["notifications"] as const,
}

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.all,
    queryFn: async () => {
      const result = await getNotifications()
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await markNotificationRead(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<NotificationsResponse>(notificationsKeys.all, (prev) => {
        if (!prev) return prev
        return {
          data: prev.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }
      })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const result = await markAllNotificationsRead()
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(notificationsKeys.all, (prev) => {
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

  useEffect(() => {
    if (!userId) return

    const supabase = createClientBrowser()
    if (!supabase) return

    const channel = supabase
      .channel(`realtime-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newRow = payload.new
          queryClient.invalidateQueries({ queryKey: notificationsKeys.all })

          const title = String(newRow.title ?? "Nueva notificacion")
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
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [userId, queryClient, push])
}
