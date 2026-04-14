"use client"

import { Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { Notification } from "@/lib/types/dashboard"

interface OrganizationHomeHeaderProps {
  firstName: string
  isPending: boolean
  notifications: Notification[]
  unreadCount: number
  onNotificationClick: (id: number) => void
}

export function OrganizationHomeHeader({
  firstName,
  isPending,
  notifications,
  unreadCount,
  onNotificationClick,
}: OrganizationHomeHeaderProps) {
  const HeaderContent = () => {
    if (isPending) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold tracking-wide text-foreground">
          ¡Bienvenido/a de vuelta, {firstName}!
        </h1>
        <p className="text-muted-foreground">
          Aquí está el resumen de tu actividad como empleador hoy.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <Suspense
        fallback={
          <div className="space-y-2">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-5 w-96" />
          </div>
        }
      >
        <HeaderContent />
      </Suspense>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <HugeiconsIcon icon={Notification01Icon} size={24} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onNotificationClick(notification.id)}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
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
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
