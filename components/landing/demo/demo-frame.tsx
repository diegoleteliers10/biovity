"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type DemoViewTab = {
  id: string
  label: string
}

type DemoFrameProps = {
  /** URL shown in the faux address bar. */
  url: string
  sidebar: ReactNode
  /** Views offered on mobile (desktop uses the sidebar). */
  views: DemoViewTab[]
  activeView: string
  onViewChange: (view: string) => void
  /** Inset scrolls its content (default). Kanban-style views manage their own scroll. */
  scroll?: boolean
  children: ReactNode
}

/**
 * Browser-chrome wrapper for the public dashboard demos. Replicates the live
 * shell geometry (bg-sidebar padding, rounded inset) so the embedded product
 * components render at their real proportions. Product register: no shadows,
 * tonal surfaces only.
 */
export function DemoFrame({
  url,
  sidebar,
  views,
  activeView,
  onViewChange,
  scroll = true,
  children,
}: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-surface-container-lowest shadow-none">
      {/* Chrome top bar */}
      <div className="flex items-center gap-3 border-b border-border/40 bg-surface-container-low px-3 py-2 sm:px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-surface-container-highest" />
          <span className="size-2.5 rounded-full bg-surface-container-highest" />
          <span className="size-2.5 rounded-full bg-surface-container-highest" />
        </div>

        <div className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center">
          <span className="truncate rounded-md border border-border/40 bg-surface-container-lowest px-3 py-1 font-mono text-xs text-muted-foreground">
            {url}
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-secondary">
          Datos de demostración
        </span>
      </div>

      {/* Shell — mirrors SidebarProvider geometry */}
      <div className="bg-sidebar">
        <div className="flex h-[560px] gap-0 overflow-hidden p-2 lg:h-[620px]">
          {sidebar}

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-lg border border-sidebar-border bg-background">
            {/* Mobile view switcher (desktop navigates from the sidebar) */}
            <div className="flex shrink-0 items-center gap-1 border-b border-border/40 bg-surface-container-low px-3 py-2 lg:hidden">
              {views.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => onViewChange(view.id)}
                  aria-pressed={view.id === activeView}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
                    view.id === activeView
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className={cn("min-h-0 flex-1", scroll ? "overflow-y-auto" : "overflow-hidden")}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
