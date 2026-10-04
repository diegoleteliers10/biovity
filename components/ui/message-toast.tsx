"use client"

import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Notification } from "@/lib/types/dashboard"

type MessageToastData = {
  chatId?: unknown
  senderName?: unknown
  senderAvatar?: unknown
  preview?: unknown
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Toast for an incoming message. Headless on purpose: it brings its own
 * surfaces so it uses the biovity palette instead of the sonner info blue.
 * Sonner keeps positioning, stacking and swipe dismissal.
 */
function MessageToast({
  notification,
  onOpen,
}: {
  notification: Notification
  onOpen: () => void
}) {
  const data = (notification.data ?? {}) as MessageToastData
  const senderName = readString(data.senderName)
  const preview = readString(data.preview)
  const avatar = readString(data.senderAvatar)
  const label = senderName ?? "Nuevo mensaje"

  return (
    // No role or aria-live here. The Toaster already renders a polite live
    // region around every toast, so nesting another one makes screen readers
    // announce the same message twice.
    <div className="pointer-events-auto flex w-[22rem] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-3 shadow-lg shadow-black/5">
      <Avatar className="size-10">
        {avatar ? <AvatarImage src={avatar} alt="" /> : null}
        <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
          {initialsOf(label)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{label}</p>
        {preview ? (
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {preview}
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-muted-foreground">{notification.body}</p>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 rounded-md text-sm font-medium text-secondary outline-none transition-colors hover:text-secondary/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          Ver mensaje
        </button>
      </div>
    </div>
  )
}

/**
 * Single entry point for message toasts so the design lives in one file.
 * The caller decides whether the toast is shown at all: a user already reading
 * the conversation does not need one.
 */
export function showMessageToast(notification: Notification, onOpen: () => void) {
  return toast.custom(
    (id) => (
      <MessageToast
        notification={notification}
        onOpen={() => {
          onOpen()
          toast.dismiss(id)
        }}
      />
    ),
    {
      id: notification.id,
      duration: 8000,
    }
  )
}
