import { getSupabaseAdmin } from "@/lib/supabase"
import type { Notification, NotificationType } from "@/lib/types/dashboard"

export type NewNotification = {
  userId: string
  type: NotificationType
  title: string
  body?: string
  link?: string
  data?: Record<string, unknown>
}

export async function createNotification(input: NewNotification): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("notification").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    link: input.link ?? null,
    data: input.data ?? {},
  })
  if (error) throw error
}

type NotificationRow = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  data: Record<string, unknown> | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

export function mapNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body ?? undefined,
    link: row.link ?? undefined,
    data: row.data ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
}
