"use client"

import { Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { AgentSheetTrigger } from "@/components/ai/AgentSheetTrigger"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/lib/types/dashboard"
import { formatFechaRelativa, notificationDotColor } from "@/lib/utils"

type NotificationBellProps = {
  notifications: Notification[]
  unreadCount?: number
  onNotificationClick?: (id: string) => void
  onMarkAllRead?: () => void
  showAgentTrigger?: boolean
}

const EMPTY_NOTIFICATIONS: Notification[] = []

export function NotificationBell({
  notifications = EMPTY_NOTIFICATIONS,
  unreadCount = 0,
  onNotificationClick,
  onMarkAllRead,
  showAgentTrigger = false,
}: NotificationBellProps) {
  const { push } = useRouter()
  return (
    <div className="flex items-center gap-1">
      {showAgentTrigger ? <AgentSheetTrigger /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <HugeiconsIcon icon={Notification01Icon} size={24} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground animate-in zoom-in-50 duration-200">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/20">
            <span className="font-semibold text-sm">Notificaciones</span>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                className="text-xs text-primary hover:underline transition-colors"
                onClick={onMarkAllRead}
                id="mark-all-read-btn"
              >
                Marcar leídas
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No hay notificaciones
            </div>
          ) : (
            <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors w-full text-left"
                  onClick={() => onNotificationClick?.(notification.id)}
                >
                  <div
                    className={`size-2 rounded-full mt-2 shrink-0 ${notificationDotColor(
                      notification.type,
                      notification.isRead
                    )}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${notification.isRead ? "font-normal text-muted-foreground" : "font-medium text-foreground"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFechaRelativa(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-border/50 p-2">
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5 transition-colors"
              onClick={() => push("/dashboard/notifications")}
            >
              Ver todas
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
