"use client"

import { useSearchParams } from "next/navigation"

const MESSAGES_PATH = "/dashboard/messages"

/**
 * The active conversation lives in the `chat` query param, which both the
 * professional and the organization message views read through nuqs.
 *
 * The plain readers below take `window.location` on purpose. The realtime
 * handler runs on the client after an event arrives, so reading the location at
 * that moment is always current and needs no hook or subscription.
 */
function currentLocation(): Location | null {
  return typeof window === "undefined" ? null : window.location
}

function normalizePathname(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
}

function normalizeChatId(value: string | null | undefined): string | null {
  return value?.trim() ? value : null
}

export function activeChatId(): string | null {
  const location = currentLocation()
  if (!location) return null
  return normalizeChatId(new URLSearchParams(location.search).get("chat"))
}

export function isReadingMessages(): boolean {
  const location = currentLocation()
  if (!location) return false
  return normalizePathname(location.pathname) === MESSAGES_PATH
}

/** True when the user has the conversation this message belongs to on screen. */
export function isReadingChat(chatId: string): boolean {
  return isReadingMessages() && activeChatId() === chatId
}

/**
 * Reactive open chat for rendering. Use this instead of `activeChatId()` in a
 * component, so the value updates when the user switches conversation and any
 * memo that depends on it recomputes.
 */
export function useOpenChatId(): string | null {
  const params = useSearchParams()
  return normalizeChatId(params.get("chat"))
}
