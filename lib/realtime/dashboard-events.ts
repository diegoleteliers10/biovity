import type { QueryClient } from "@tanstack/react-query"
import { z } from "zod"
import type { Chat } from "@/lib/api/chats"
import { type Message, parseRealtimeMessage } from "@/lib/api/messages"
import type { NotificationsResponse } from "@/lib/api/notifications"
import { invalidateResource, reconcileDashboardResources } from "./resources"
import type { UserEvent } from "./types"

const receivedMessages = new WeakMap<QueryClient, Set<string>>()

const NotificationEventSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.enum(["application", "interview", "message", "job_alert", "system"]),
  title: z.string(),
  body: z.string().nullable(),
  link: z.string().nullable(),
  data: z.record(z.string(), z.unknown()).nullable(),
  is_read: z.boolean(),
  created_at: z.string(),
})

export function applyDashboardEvent(client: QueryClient, userId: string, event: UserEvent) {
  if (event.event === "resource_changed") {
    invalidateResource(client, event.payload)
    return null
  }
  if (event.event === "message_insert") {
    const message = parseRealtimeMessage(event.payload)
    if (!message) return null
    let received = receivedMessages.get(client)
    if (!received) {
      received = new Set()
      receivedMessages.set(client, received)
    }
    if (received.has(message.id)) return null
    received.add(message.id)
    if (received.size > 1000) {
      const oldest = received.values().next().value
      if (oldest !== undefined) received.delete(oldest)
    }
    const messageKey = ["messages", "chat", message.chatId]
    void client.cancelQueries({ queryKey: messageKey })
    client.setQueryData<Message[]>(messageKey, (current) =>
      current && !current.some((item) => item.id === message.id) ? [...current, message] : current
    )
    client.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (current) =>
      current?.map((chat) =>
        chat.id === message.chatId
          ? {
              ...chat,
              lastMessage: message.content,
              updatedAt: message.createdAt,
              unreadCountRecruiter:
                (chat.unreadCountRecruiter ?? 0) +
                (chat.recruiterId === userId && message.senderId !== userId ? 1 : 0),
              unreadCountProfessional:
                (chat.unreadCountProfessional ?? 0) +
                (chat.professionalId === userId && message.senderId !== userId ? 1 : 0),
            }
          : chat
      )
    )
    return null
  }
  const payload =
    event.payload && typeof event.payload === "object" && "payload" in event.payload
      ? event.payload.payload
      : event.payload
  const parsed = NotificationEventSchema.safeParse(payload)
  if (!parsed.success || parsed.data.user_id !== userId) return null
  const row = parsed.data
  const notification = {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body ?? undefined,
    link: row.link ?? undefined,
    data: row.data ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
  const key = ["notifications", userId]
  const current = client.getQueryData<NotificationsResponse>(key)
  if (current?.data.some((item) => item.id === notification.id)) return null
  void client.cancelQueries({ queryKey: key })
  client.setQueryData<NotificationsResponse>(key, (previous) => ({
    data: [notification, ...(previous?.data ?? [])].slice(0, 50),
    unreadCount: (previous?.unreadCount ?? 0) + (notification.isRead ? 0 : 1),
  }))
  return notification
}

export function reconcileDashboardEvents(client: QueryClient, _userId: string) {
  reconcileDashboardResources(client)
}
