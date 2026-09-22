"use client"

import { Notification03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/**
 * Static replica of the ConnectedNotificationBell slot in dashboard page
 * headers: same position and affordance, no realtime wiring.
 */
export function DemoBell({ unread = 0 }: { unread?: number }) {
  return (
    <span
      className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground"
      title="Notificaciones (demo)"
    >
      <HugeiconsIcon icon={Notification03Icon} size={20} strokeWidth={1.5} />
      {unread > 0 && (
        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground tabular-nums">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </span>
  )
}

/**
 * Mirrors the dashboard page headers (HomeHeader / SearchContent header rows):
 * notification bell top-right on desktop, title + subtitle below.
 */
export function DemoHeader({
  title,
  subtitle,
  unreadNotifications = 0,
}: {
  title: string
  subtitle: string
  unreadNotifications?: number
}) {
  return (
    <div className="space-y-1">
      <div className="hidden justify-end lg:flex">
        <DemoBell unread={unreadNotifications} />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
