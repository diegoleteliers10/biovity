"use client"

import { Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AgentSheetTrigger } from "@/components/ai/AgentSheetTrigger"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/lib/types/dashboard"

type NotificationBellProps = {
  notifications: Notification[]
  unreadCount?: number
  onNotificationClick?: (id: number) => void
  showAgentTrigger?: boolean
}

const EMPTY_NOTIFICATIONS: Notification[] = []

export function NotificationBell({
  notifications = EMPTY_NOTIFICATIONS,
  unreadCount = 0,
  onNotificationClick,
  showAgentTrigger = false,
}: NotificationBellProps) {
  return (
    <div className="flex items-center gap-1">
      {showAgentTrigger ? <AgentSheetTrigger /> : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <HugeiconsIcon icon={Notification01Icon} size={24} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 size-2 bg-destructive rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
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
                    className={`size-2 rounded-full mt-2 shrink-0 ${
                      notification.isRead
                        ? "bg-muted-foreground/30"
                        : notification.type === "application"
                          ? "bg-secondary"
                          : notification.type === "interview"
                            ? "bg-primary"
                            : "bg-accent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${notification.isRead ? "font-normal text-muted-foreground" : "font-medium text-foreground"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
