"use client"

import {
  Briefcase01Icon,
  Calendar04Icon,
  CheckmarkCircle02Icon,
  Message01Icon,
  Notification01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { AgentSheetTrigger } from "@/components/ai/AgentSheetTrigger"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification, NotificationType } from "@/lib/types/dashboard"
import { cn, formatFechaRelativa } from "@/lib/utils"

type NotificationBellProps = {
  notifications: Notification[]
  unreadCount?: number
  onNotificationClick?: (id: string) => void
  onMarkAllRead?: () => void
  showAgentTrigger?: boolean
}

const EMPTY_NOTIFICATIONS: Notification[] = []

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

export function NotificationBell({
  notifications = EMPTY_NOTIFICATIONS,
  unreadCount = 0,
  onNotificationClick,
  onMarkAllRead,
  showAgentTrigger = false,
}: NotificationBellProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-1.5">
      {showAgentTrigger ? <AgentSheetTrigger /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-lg hover:bg-surface-container-high text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Abrir notificaciones"
          >
            <HugeiconsIcon icon={Notification01Icon} size={20} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-mono font-bold text-secondary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 sm:w-96 rounded-xl border border-border/50 bg-surface-container-lowest shadow-none p-0 overflow-hidden"
          align="end"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-surface-container-low/60">
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Notificaciones
            </span>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                className="text-xs font-medium text-secondary hover:underline cursor-pointer transition-colors"
                onClick={onMarkAllRead}
                id="mark-all-read-btn"
              >
                Marcar leídas
              </button>
            )}
          </div>

          {/* List or Empty State */}
          {notifications.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <div className="size-9 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto text-muted-foreground">
                <HugeiconsIcon icon={Notification01Icon} size={18} />
              </div>
              <p className="text-xs text-muted-foreground">No tienes notificaciones pendientes</p>
            </div>
          ) : (
            <div className="p-1.5 space-y-1 max-h-[340px] overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <button
                    key={notification.id}
                    type="button"
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors w-full text-left cursor-pointer",
                      notification.isRead
                        ? "hover:bg-surface-container-low/70 opacity-75"
                        : "bg-surface-container-low/40 hover:bg-surface-container-low border-l-2 border-l-secondary"
                    )}
                    onClick={() => onNotificationClick?.(notification.id)}
                  >
                    <div className="size-7 rounded-md bg-surface-container-highest flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <HugeiconsIcon icon={Icon} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs leading-snug truncate",
                          notification.isRead
                            ? "font-normal text-muted-foreground"
                            : "font-semibold text-foreground"
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.body && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.body}
                        </p>
                      )}
                      <p className="text-[11px] font-mono text-muted-foreground tabular-nums mt-1">
                        {formatFechaRelativa(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border/40 p-2 bg-surface-container-low/40">
            <button
              type="button"
              className="w-full h-8 flex items-center justify-center rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/notifications")}
            >
              Ver todas las notificaciones
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
