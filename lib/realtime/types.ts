import type { RealtimeChannel } from "@supabase/supabase-js"

export type UserEvent = {
  event: "message_insert" | "notification_insert" | "resource_changed"
  payload: unknown
}
export type ConnectionStatus =
  | "CONNECTING"
  | "SUBSCRIBED"
  | "CHANNEL_ERROR"
  | "TIMED_OUT"
  | "CLOSED"
export type UserEventListener = {
  onEvent: (event: UserEvent) => void
  onConnected: () => void
  onStatusChange: () => void
}
export type UserChannel = {
  transport: { kind: "active"; channel: RealtimeChannel } | { kind: "closing" }
  status: ConnectionStatus
  listeners: Set<UserEventListener>
}

export type DashboardSubscription = {
  topic: string
  close: () => void
  previous: DashboardSubscription | null
}
