import type { QueryClient } from "@tanstack/react-query"
import type { NotificationsResponse } from "./notifications"

export function readNotifications(client: QueryClient, userId: string | undefined, id?: string) {
  const key = ["notifications", userId ?? ""]
  const current = client.getQueryData<NotificationsResponse>(key)
  const ids =
    current?.data.filter((row) => !row.isRead && (!id || row.id === id)).map((row) => row.id) ?? []
  const hiddenUnreadCount = !id ? Math.max(0, (current?.unreadCount ?? 0) - ids.length) : 0
  client.setQueryData<NotificationsResponse>(
    key,
    (previous) =>
      previous && {
        data: previous.data.map((row) => (ids.includes(row.id) ? { ...row, isRead: true } : row)),
        unreadCount: Math.max(0, previous.unreadCount - ids.length - hiddenUnreadCount),
      }
  )
  return { ids, hiddenUnreadCount }
}

export function restoreUnreadNotifications(
  client: QueryClient,
  userId: string | undefined,
  ids: string[],
  hiddenUnreadCount = 0
) {
  client.setQueryData<NotificationsResponse>(["notifications", userId ?? ""], (previous) => {
    if (!previous) return previous
    const restored = previous.data.filter((row) => ids.includes(row.id) && row.isRead).length
    return {
      data: previous.data.map((row) => (ids.includes(row.id) ? { ...row, isRead: false } : row)),
      unreadCount: previous.unreadCount + restored + hiddenUnreadCount,
    }
  })
}
