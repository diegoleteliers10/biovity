"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
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
        "flex flex-col border border-border/80 bg-white",
        onClick &&
          "cursor-pointer transition-all duration-150 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:border-border active:scale-[0.99]"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.5}
            className={iconColor === "accent" ? "text-accent" : "text-secondary"}
          />
          <CardTitle className="text-base text-foreground">{title}</CardTitle>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1">
        {children || <p className="text-sm text-muted-foreground">Proximamente: {description}</p>}
      </CardContent>
    </Card>
  )
}
