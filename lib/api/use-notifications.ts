"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
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
