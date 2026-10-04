"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useCallback, useSyncExternalStore } from "react"
import { toast } from "sonner"
import { showMessageToast } from "@/components/ui/message-toast"
import { applyDashboardEvent, reconcileDashboardEvents } from "@/lib/realtime/dashboard-events"
import { subscribeDashboardChannel } from "@/lib/realtime/dashboard-subscription"
import { userChannelStatus } from "@/lib/realtime/user-channel"
import { activeChatId, isReadingMessages } from "@/lib/realtime/viewer-context"
import { createClientBrowser } from "@/lib/supabase-browser"
import { readNotifications, restoreUnreadNotifications } from "./notification-cache"
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "./notifications"
import { useRealtimeUserTopic } from "./use-realtime-topics"

export const notificationsKeys = {
  all: ["notifications"] as const,
  byUser: (userId: string | undefined) => ["notifications", userId ?? ""] as const,
}

export function useNotifications(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: notificationsKeys.byUser(userId),
    queryFn: async ({ signal }) => {
      const result = await getNotifications(signal)
      if (!Result.isOk(result)) return Promise.reject(result.error)
      if (queryClient.isMutating({ mutationKey: ["notifications", "read", userId ?? ""] }) > 0) {
        return (
          queryClient.getQueryData<import("./notifications").NotificationsResponse>(
            notificationsKeys.byUser(userId)
          ) ?? result.value
        )
      }
      return result.value
    },
    // Fallback only. The realtime broadcast is the primary path, so this poll
    // just covers a dropped channel. It pauses while the tab is hidden.
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    enabled: Boolean(userId),
  })
}

export function useMarkNotificationRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["notifications", "read", userId ?? ""],
    mutationFn: async (id: string) => {
      const result = await markNotificationRead(id)
      if (!Result.isOk(result)) return Promise.reject(result.error)
      return result.value
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.byUser(userId) })
      return readNotifications(queryClient, userId, id)
    },
    onError: (_error, _id, context) =>
      restoreUnreadNotifications(
        queryClient,
        userId,
        context?.ids ?? [],
        context?.hiddenUnreadCount ?? 0
      ),
  })
}

export function useMarkAllNotificationsRead(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["notifications", "read", userId ?? ""],
    mutationFn: async () => {
      const result = await markAllNotificationsRead()
      if (!Result.isOk(result)) return Promise.reject(result.error)
      return result.value
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.byUser(userId) })
      return readNotifications(queryClient, userId)
    },
    onError: (_error, _variables, context) =>
      restoreUnreadNotifications(
        queryClient,
        userId,
        context?.ids ?? [],
        context?.hiddenUnreadCount ?? 0
      ),
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
      return subscribeDashboardChannel(client, `${userId}:${sessionId}`, topic, {
        onStatusChange: notify,
        onConnected: () => reconcileDashboardEvents(queryClient, userId),
        onEvent: (event) => {
          const notification = applyDashboardEvent(queryClient, userId, event, activeChatId())
          if (!notification) return
          // A message the user is already reading needs no toast. The
          // notification itself stays so the list and the bell remain truthful.
          if (notification.type === "message" && isReadingMessages()) return
          const link = notification.link?.startsWith("/dashboard") ? notification.link : null
          if (notification.type === "message") {
            showMessageToast(notification, () => {
              if (link) push(link)
            })
            return
          }
          toast.info(notification.title, {
            id: notification.id,
            description: notification.body,
            duration: 8000,
            action: link ? { label: "Ver", onClick: () => push(link) } : undefined,
          })
        },
      })
    },
    [client, userId, sessionId, topic, queryClient, push]
  )
  const snapshot = useCallback(() => userChannelStatus(client, topic), [client, topic])
  return useSyncExternalStore(subscribe, snapshot, () => "CLOSED")
}
