"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/lib/api/use-notifications"

import { NotificationBell } from "./NotificationBell"

export function ConnectedNotificationBell({
  showAgentTrigger = false,
}: {
  showAgentTrigger?: boolean
}) {
  const session = useDashboardSession()
  const userId = session?.user?.id
  const { data } = useNotifications(userId)
  const { push } = useRouter()
  const markRead = useMarkNotificationRead(userId)
  const markAllRead = useMarkAllNotificationsRead(userId)

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  const handleClick = useCallback(
    (id: string) => {
      markRead.mutate(id)
      const target = notifications.find((n) => n.id === id)
      if (target?.link) push(target.link)
    },
    [markRead, notifications, push]
  )

  const handleMarkAllRead = useCallback(() => {
    markAllRead.mutate()
  }, [markAllRead])

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={handleClick}
      onMarkAllRead={handleMarkAllRead}
      showAgentTrigger={showAgentTrigger}
    />
  )
}
