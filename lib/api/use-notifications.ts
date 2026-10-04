"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useCallback, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { applyDashboardEvent, reconcileDashboardEvents } from "@/lib/realtime/dashboard-events"
import { subscribeUserChannel, userChannelStatus } from "@/lib/realtime/user-channel"
import { createClientBrowser } from "@/lib/supabase-browser"
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
      if (!Result.isOk(result)) return Promise.reject(result.error)
      return result.value
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    enabled: Boolean(userId),
  })
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await markNotificationRead(id)
      if (!Result.isOk(result)) return Promise.reject(result.error)
      return result.value
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<NotificationsResponse>(notificationsKeys.byUser(userId), (prev) => {
        if (!prev) return prev
        return {
          data: prev.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(
            0,
            prev.unreadCount - (prev.data.some((n) => n.id === id && !n.isRead) ? 1 : 0)
          ),
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
      if (!Result.isOk(result)) return Promise.reject(result.error)
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

export function useNotificationsRealtime(
  userId: string | undefined,
  sessionId: string | undefined
) {
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const topic = useRealtimeUserTopic(userId, sessionId)
  const client = createClientBrowser()
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!client || !userId || !topic) return () => {}
      return subscribeUserChannel(client, topic, {
        onStatusChange: notify,
        onConnected: () => reconcileDashboardEvents(queryClient, userId),
        onEvent: (event) => {
          const notification = applyDashboardEvent(queryClient, userId, event)
          if (!notification) return
          const link = notification.link?.startsWith("/dashboard") ? notification.link : null
          toast.info(notification.title, {
            id: notification.id,
            description: notification.body,
            duration: 8000,
            action: link ? { label: "Ver", onClick: () => push(link) } : undefined,
          })
        },
      })
    },
    [client, userId, topic, queryClient, push]
  )
  const snapshot = useCallback(() => userChannelStatus(client, topic), [client, topic])
  return useSyncExternalStore(subscribe, snapshot, () => "CLOSED")
}
