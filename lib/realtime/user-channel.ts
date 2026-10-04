import type { SupabaseClient } from "@supabase/supabase-js"
import { Result } from "better-result"
import type { UserChannel, UserEventListener } from "./types"

const clients = new WeakMap<SupabaseClient, Map<string, UserChannel>>()

export function userChannelStatus(client: SupabaseClient | null, topic: string | undefined) {
  return client && topic ? (clients.get(client)?.get(topic)?.status ?? "CONNECTING") : "CLOSED"
}

function openChannel(client: SupabaseClient, topic: string, entry: UserChannel) {
  const channel = client.channel(topic, { config: { private: true } })
  entry.transport = { kind: "active", channel }
  entry.status = "CONNECTING"
  for (const event of ["message_insert", "notification_insert", "resource_changed"] as const) {
    channel.on("broadcast", { event }, (payload) => {
      if (entry.transport.kind !== "active" || entry.transport.channel !== channel) return
      for (const observer of entry.listeners) observer.onEvent({ event, payload })
    })
  }
  channel.subscribe((status) => {
    if (entry.transport.kind !== "active" || entry.transport.channel !== channel) return
    entry.status = status
    for (const observer of entry.listeners) {
      observer.onStatusChange()
      if (status === "SUBSCRIBED") observer.onConnected()
    }
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
      console.warn("[Realtime] Connection unavailable", { status })
    }
  })
}

async function closeChannel(
  client: SupabaseClient,
  topic: string,
  entry: UserChannel,
  channels: Map<string, UserChannel>
) {
  if (entry.transport.kind !== "active") return
  const channel = entry.transport.channel
  entry.transport = { kind: "closing" }
  const removed = await Result.tryPromise({
    try: () => client.removeChannel(channel),
    catch: () => new Error("Realtime channel removal failed"),
  })
  if (entry.listeners.size === 0) {
    channels.delete(topic)
    return
  }
  if (removed.isErr()) {
    entry.status = "CHANNEL_ERROR"
    for (const observer of entry.listeners) observer.onStatusChange()
    return
  }
  openChannel(client, topic, entry)
  for (const observer of entry.listeners) observer.onStatusChange()
}

export function subscribeUserChannel(
  client: SupabaseClient,
  topic: string,
  listener: UserEventListener
): () => void {
  let channels = clients.get(client)
  if (!channels) {
    channels = new Map()
    clients.set(client, channels)
  }
  let entry = channels.get(topic)
  if (!entry) {
    entry = { transport: { kind: "closing" }, status: "CONNECTING", listeners: new Set([listener]) }
    channels.set(topic, entry)
    openChannel(client, topic, entry)
  } else {
    entry.listeners.add(listener)
    if (entry.transport.kind === "active" && entry.status === "SUBSCRIBED") listener.onConnected()
    if (entry.transport.kind === "closing") entry.status = "CONNECTING"
  }
  const current = entry
  const currentChannels = channels
  return () => {
    current.listeners.delete(listener)
    queueMicrotask(() => {
      if (current.listeners.size > 0 || currentChannels.get(topic) !== current) return
      void closeChannel(client, topic, current, currentChannels)
    })
  }
}
