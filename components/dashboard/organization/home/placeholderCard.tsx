"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PlaceholderCardProps = {
  title: string
  description?: string
  icon: IconSvgElement
  iconColor?: "secondary" | "accent"
  children?: React.ReactNode
  onClick?: () => void
}

export function PlaceholderCard({
  title,
  description,
  icon,
  iconColor = "secondary",
  children,
  onClick,
}: PlaceholderCardProps) {
  return (
    <Card
      className={cn(
        dashboardRaisedCardClass,
        "flex flex-col",
        onClick &&
          "cursor-pointer transition-colors duration-150 hover:bg-surface-container-highest/40"
      )}
      onClick={onClick}
    >
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.5}
            className={iconColor === "accent" ? "text-accent" : "text-secondary"}
          />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <p className="text-xs text-muted-foreground text-pretty">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1 px-4 sm:px-5 pb-4 sm:pb-5">
        {children || (
          <p className="text-xs leading-4 text-muted-foreground">Proximamente: {description}</p>
        )}
      </CardContent>
    </Card>
  )
}
