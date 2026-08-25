"use client"

import {
  Briefcase01Icon,
  Calendar04Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Message01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/lib/api/use-notifications"
import type { NotificationType } from "@/lib/types/dashboard"
import { cn, formatFechaRelativa } from "@/lib/utils"

const ALLOWED_LINK_PREFIX = "/"

function isInternalLink(link: string): boolean {
  return link.startsWith(ALLOWED_LINK_PREFIX)
}

type FilterTab = "all" | "unread"

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "unread", label: "No leídas" },
]

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "interview":
      return Calendar04Icon
    case "application":
      return Briefcase01Icon
    case "message":
      return Message01Icon
    case "job_alert":
      return Notification01Icon
    case "system":
    default:
      return CheckmarkCircle02Icon
  }
}

export function NotificationsPageContent() {
  const { data, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const router = useRouter()
  const [filter, setFilter] = useState<FilterTab>("all")

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {/* Top row: menu on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <ConnectedNotificationBell showAgentTrigger />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Notificaciones
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {unreadCount > 0 ? (
              <span>
                Tienes{" "}
                <strong className="font-semibold text-foreground font-mono tabular-nums">
                  {unreadCount}
                </strong>{" "}
                {unreadCount === 1 ? "notificación no leída" : "notificaciones no leídas"}
              </span>
            ) : (
              "Todas tus notificaciones están al día"
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="h-9 px-3.5 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors shadow-none cursor-pointer self-start sm:self-auto"
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-surface-container-low border border-border/40 rounded-xl shadow-none w-fit">
        {FILTER_TABS.map((tab) => {
          const count = tab.id === "all" ? notifications.length : unreadCount
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "h-9 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                filter === tab.id
                  ? "bg-surface-container-lowest text-foreground border border-border/50 shadow-none font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-container-highest/50"
              )}
            >
              <span>{tab.label}</span>
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground px-1.5 py-0.5 rounded-full bg-surface-container-highest">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List / Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="rounded-xl bg-surface-container-lowest border border-border/50 p-4 sm:p-5 flex items-start gap-3.5 shadow-none"
            >
              <div className="size-9 rounded-lg bg-surface-container-highest/60 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-48 rounded bg-surface-container-highest/60 animate-pulse" />
                <div className="h-3 w-72 rounded bg-surface-container-highest/40 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none space-y-3">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto text-muted-foreground">
            <HugeiconsIcon icon={Notification01Icon} size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {filter === "unread"
                ? "No tienes notificaciones no leídas"
                : "No tienes notificaciones"}
            </p>
            <p className="text-xs text-muted-foreground">
              {filter === "unread"
                ? "Has revisado todas tus alertas recientes."
                : "Te avisaremos cuando ocurran eventos relevantes en tu cuenta."}
            </p>
          </div>
          {filter === "unread" && notifications.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilter("all")}
              className="h-9 px-3.5 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium"
            >
              Ver todas las notificaciones
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            return (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!notification.isRead) markRead.mutate(notification.id)
                  if (notification.link && isInternalLink(notification.link)) {
                    router.push(notification.link)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    if (!notification.isRead) markRead.mutate(notification.id)
                    if (notification.link && isInternalLink(notification.link)) {
                      router.push(notification.link)
                    }
                  }
                }}
                className={cn(
                  "rounded-xl bg-surface-container-lowest border border-border/50 p-4 sm:p-5 shadow-none flex items-start gap-3.5 transition-colors cursor-pointer hover:border-border/80",
                  !notification.isRead && "border-l-4 border-l-secondary"
                )}
              >
                <div className="size-9 rounded-lg bg-surface-container-low border border-border/40 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                  <HugeiconsIcon icon={Icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p
                      className={cn(
                        "text-sm leading-snug truncate",
                        notification.isRead
                          ? "font-normal text-muted-foreground"
                          : "font-semibold text-foreground"
                      )}
                    >
                      {notification.title}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono tabular-nums shrink-0">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={13}
                        className="text-muted-foreground"
                      />
                      {formatFechaRelativa(notification.createdAt)}
                    </span>
                  </div>
                  {notification.body && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {notification.body}
                    </p>
                  )}
                </div>
                {!notification.isRead && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 rounded-md border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 shadow-none"
                    onClick={(e) => {
                      e.stopPropagation()
                      markRead.mutate(notification.id)
                    }}
                  >
                    Marcar leída
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
