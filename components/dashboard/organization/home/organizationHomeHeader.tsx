"use client"

import { Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense } from "react"
import { AgentSheetTrigger } from "@/components/ai/AgentSheetTrigger"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import type { Notification } from "@/lib/types/dashboard"

type OrganizationHomeHeaderProps = {
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
          <Skeleton className="h-9 w-full max-w-[280px] sm:max-w-[320px]" />
          <Skeleton className="h-5 w-full max-w-[240px] sm:max-w-[384px]" />
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-wide text-foreground">
          ¡Bienvenido/a de vuelta, {firstName}!
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Aquí está el resumen de tu actividad como empleador hoy.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: menu + notification on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <div className="flex items-center gap-1">
          <AgentSheetTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted/50 active:scale-90 transition-all duration-150"
              >
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

      {/* Desktop: notification top-right, title below */}
      <div className="space-y-1">
        <div className="hidden lg:flex justify-end items-center gap-1">
          <AgentSheetTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted/50 active:scale-90 transition-all duration-150"
              >
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
        <Suspense
          fallback={
            <div className="space-y-2">
              <Skeleton className="h-9 w-full max-w-[280px] sm:max-w-[320px]" />
              <Skeleton className="h-5 w-full max-w-[240px] sm:max-w-[384px]" />
            </div>
          }
        >
          <HeaderContent />
        </Suspense>
      </div>
    </div>
  )
}
