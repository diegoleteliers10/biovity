import type { QueryClient } from "@tanstack/react-query"
import { z } from "zod"
import type { Chat } from "@/lib/api/chats"
import { type Message, parseRealtimeMessage } from "@/lib/api/messages"
import type { NotificationsResponse } from "@/lib/api/notifications"
import { invalidateResource, reconcileDashboardResources } from "./resources"
import type { UserEvent } from "./types"

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
    const messageKey = ["messages", "chat", message.chatId]
    void client.cancelQueries({ queryKey: messageKey })
    client.setQueryData<Message[]>(["messages", "chat", message.chatId], (current) =>
      current && !current.some((item) => item.id === message.id) ? [...current, message] : current
    )
    client.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (current) =>
      current?.map((chat) =>
        chat.id === message.chatId
          ? { ...chat, lastMessage: message.content, updatedAt: message.createdAt }
          : chat
      )
    )
    void client.invalidateQueries({ queryKey: messageKey })
    void client.invalidateQueries({ queryKey: ["chats"] })
    void client.invalidateQueries({ queryKey: ["chat", "fromUrl", message.chatId] })
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
  client.setQueryData<NotificationsResponse>(key, (previous) => ({
    data: [notification, ...(previous?.data ?? [])].slice(0, 50),
    unreadCount: (previous?.unreadCount ?? 0) + (notification.isRead ? 0 : 1),
  }))
  void client.invalidateQueries({ queryKey: key })
  return notification
}

export function reconcileDashboardEvents(client: QueryClient, userId: string) {
  reconcileDashboardResources(client)
  void client.invalidateQueries({ queryKey: ["messages"] })
  void client.invalidateQueries({ queryKey: ["chats"] })
  void client.invalidateQueries({ queryKey: ["chat", "fromUrl"] })
  void client.invalidateQueries({ queryKey: ["notifications", userId] })
}
