"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useMarkNotificationRead, useNotifications } from "@/lib/api/use-notifications"

import { NotificationBell } from "./NotificationBell"

export function ConnectedNotificationBell({
  showAgentTrigger = false,
}: {
  showAgentTrigger?: boolean
}) {
  const { data } = useNotifications()
  const { push } = useRouter()
  const markRead = useMarkNotificationRead()

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

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      onNotificationClick={handleClick}
      showAgentTrigger={showAgentTrigger}
    />
  )
}
