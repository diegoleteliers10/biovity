"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ProductShotProps = {
  /** URL shown in the faux address bar. */
  url: string
  children: ReactNode
  /** Tailwind height class for the shot body (content clips/scrolls inside). */
  height?: string
  /** Honest-labeling caption rendered under the frame. */
  caption?: string
  /** Lets the inner content scroll (chat threads) instead of clipping. */
  scroll?: boolean
  className?: string
}

/**
 * Slim browser-chrome frame for landing showcase sections: same visual
 * language as DemoFrame, minus the interactive chrome (sidebar, tabs, badge).
 * Product register inside: tonal surfaces, no shadows.
 */
export function ProductShot({
  url,
  children,
  height = "h-[480px]",
  caption,
  scroll = false,
  className,
}: ProductShotProps) {
  return (
    <figure className={cn("m-0", className)}>
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
          <span className="w-10 shrink-0" aria-hidden="true" />
        </div>

        {/* Shot body — mirrors the live inset */}
        <div className={cn(height, "bg-sidebar p-2")}>
          <div
            className={cn(
              "h-full overflow-hidden rounded-tl-lg border border-sidebar-border bg-background",
              scroll && "overflow-y-auto"
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
