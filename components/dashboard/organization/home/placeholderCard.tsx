"use client"

import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlaceholderCardProps {
  title: string
  description: string
  icon: IconSvgElement
}

export function PlaceholderCard({ title, description, icon }: PlaceholderCardProps) {
  return (
    <Card className="opacity-90">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={icon}
            size={20}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Próximamente: {description}</p>
      </CardContent>
    </Card>
  )
}
