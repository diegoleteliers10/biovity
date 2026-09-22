"use client"

import type { ReactNode } from "react"

/**
 * Neutralizes click navigation of embedded dashboard components inside the
 * public demos. Capture-phase stop prevents the wrapped component's own
 * React onClick handlers (which route to /dashboard) from firing, without
 * altering its rendered markup.
 */
export function StopClick({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onClickCapture={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      {children}
    </div>
  )
}
