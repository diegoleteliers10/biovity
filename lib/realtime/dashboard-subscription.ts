import type { SupabaseClient } from "@supabase/supabase-js"
import type { DashboardSubscription, UserEventListener } from "./types"
import { subscribeUserChannel } from "./user-channel"

const clients = new WeakMap<SupabaseClient, Map<string, DashboardSubscription>>()

function closeSubscription(entry: DashboardSubscription) {
  entry.close()
  if (entry.previous) closeSubscription(entry.previous)
  entry.previous = null
}

export function subscribeDashboardChannel(
  client: SupabaseClient,
  scope: string,
  topic: string,
  listener: UserEventListener
) {
  let subscriptions = clients.get(client)
  if (!subscriptions) {
    subscriptions = new Map()
    clients.set(client, subscriptions)
  }
  const entries = subscriptions
  const previous = entries.get(scope) ?? null
  const entry: DashboardSubscription = { topic, close: () => {}, previous }
  entries.set(scope, entry)
  entry.close = subscribeUserChannel(client, topic, {
    ...listener,
    onConnected: () => {
      if (entries.get(scope) !== entry) return
      if (entry.previous) closeSubscription(entry.previous)
      entry.previous = null
      listener.onConnected()
    },
  })
  return () => {
    queueMicrotask(() => {
      if (entries.get(scope) !== entry) return
      entries.delete(scope)
      closeSubscription(entry)
    })
  }
}
