"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlaceholderCardProps {
  title: string
  description?: string
  icon: IconSvgElement
  children?: React.ReactNode
}

export function PlaceholderCard({ title, description, icon, children }: PlaceholderCardProps) {
  return (
    <Card className="flex flex-col border border-border/80 bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.5}
            className="text-secondary"
          />
          <CardTitle className="text-base text-foreground">{title}</CardTitle>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1">
        {children || <p className="text-sm text-muted-foreground">Próximamente: {description}</p>}
      </CardContent>
    </Card>
  )
}
