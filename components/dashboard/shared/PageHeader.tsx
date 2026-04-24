"use client"

import type { ReactNode } from "react"
import { MobileMenuButton } from "./MobileMenuButton"

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        {title}
        {description}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <MobileMenuButton />
        {actions}
      </div>
    </div>
  )
}
