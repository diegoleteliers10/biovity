"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { OrganizationPageHeader } from "@/components/dashboard/organization/OrganizationPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMarkNotificationRead, useNotifications } from "@/lib/api/use-notifications"
import { formatFechaRelativa, notificationDotColor } from "@/lib/utils"

const ALLOWED_LINK_PREFIX = "/"

function isInternalLink(link: string): boolean {
  return link.startsWith(ALLOWED_LINK_PREFIX)
}

type FilterTab = "all" | "unread"

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "unread", label: "No leídas" },
]

export function NotificationsPageContent() {
  const { data } = useNotifications()
  const markRead = useMarkNotificationRead()
  const router = useRouter()
  const [filter, setFilter] = useState<FilterTab>("all")

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <OrganizationPageHeader title="Notificaciones" description={`${unreadCount} no leídas`} />

      <div className="flex items-center gap-2 border-b border-border/60">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === tab.id
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.id === "unread" && unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {filter === "unread"
              ? "No tienes notificaciones no leídas"
              : "No tienes notificaciones"}
          </p>
        ) : (
          filteredNotifications.map((notification) => (
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
              className="flex items-start gap-3 w-full text-left p-4 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div
                className={`size-2.5 rounded-full mt-1.5 shrink-0 ${notificationDotColor(
                  notification.type,
                  notification.isRead
                )}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${notification.isRead ? "text-muted-foreground" : "font-medium text-foreground"}`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatFechaRelativa(notification.createdAt)}
                  </span>
                </div>
                {notification.body && (
                  <p className="text-xs text-muted-foreground mt-1">{notification.body}</p>
                )}
              </div>
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    markRead.mutate(notification.id)
                  }}
                >
                  Marcar leida
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
