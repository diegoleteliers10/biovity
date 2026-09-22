"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

export type DemoNavItem = {
  id: string
  title: string
  icon: IconSvgElement
  badge?: number
  /** Item switches to a demo view when present; otherwise it renders inert. */
  view?: string
}

type DemoSidebarProps = {
  items: DemoNavItem[]
  exploreItems?: DemoNavItem[]
  activeView: string | null
  onSelect: (view: string) => void
  user: { name: string; title: string }
  avatarGradient?: "blue" | "purple"
  profileProgress?: {
    percentage: number
    title: string
    subtitle: string
    actionText: string
  }
}

/**
 * Static replica of the live dashboard sidebar (components/dashboard/shared/DashboardSidebar)
 * for the public demos: same visual language, but navigation switches demo views
 * locally instead of routing, and there is no session, logout, or featurebase wiring.
 */
export function DemoSidebar({
  items,
  exploreItems = [],
  activeView,
  onSelect,
  user,
  avatarGradient = "blue",
  profileProgress,
}: DemoSidebarProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const renderItem = (item: DemoNavItem) => {
    const isActive = item.view != null && item.view === activeView
    const isInteractive = item.view != null

    return (
      <button
        key={item.title}
        type="button"
        onClick={() => item.view && onSelect(item.view)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors duration-150",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : isInteractive
              ? "cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent/50"
              : "cursor-default text-sidebar-foreground"
        )}
      >
        <HugeiconsIcon icon={item.icon} size={24} strokeWidth={1.5} className="shrink-0" />
        <span className="truncate">{item.title}</span>
        {item.badge != null && (
          <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full tabular-nums">
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header — mirrors SidebarHeader */}
      <div className="flex items-center p-2">
        <Logo size="sm" showText textSize="md" />
      </div>

      {/* Content — mirrors SidebarContent */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 py-1">
        <div>{items.map(renderItem)}</div>

        {profileProgress && (
          <div className="mx-2 mb-2 shrink-0 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-card-foreground">
                  {profileProgress.title}
                </h3>
                <p className="text-xs text-muted-foreground">{profileProgress.subtitle}</p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xs font-bold tabular-nums text-primary">
                  {profileProgress.percentage}%
                </span>
              </div>
            </div>
            <div className="relative mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80"
                style={{ width: `${profileProgress.percentage}%` }}
              />
            </div>
            <span className="block px-1 text-xs font-medium text-primary">
              {profileProgress.actionText}
            </span>
          </div>
        )}

        {exploreItems.length > 0 && (
          <div>
            <p className="px-2 pb-1 text-xs font-medium text-sidebar-foreground/60">Explorar</p>
            {exploreItems.map(renderItem)}
          </div>
        )}
      </div>

      {/* Footer — mirrors SidebarFooter user card */}
      <div className="flex items-center gap-2 p-2">
        <Avatar className="size-8 rounded-lg">
          <AvatarFallback
            className={cn(
              "rounded-lg bg-gradient-to-br font-semibold",
              avatarGradient === "blue"
                ? "from-blue-500 to-purple-600"
                : "from-purple-500 to-blue-600"
            )}
          >
            <span className="text-sm font-semibold text-white">{initials}</span>
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
          <span className="truncate text-xs text-sidebar-foreground/60">{user.title}</span>
        </div>
      </div>
    </aside>
  )
}
