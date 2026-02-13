"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

type Event = {
  readonly id: string
  readonly title: string
  readonly time: string
  readonly description: string
  readonly type: "meeting" | "personal" | "work" | "important"
}

type EventTooltipProps = {
  readonly event: Event
  readonly position: { readonly x: number; readonly y: number }
}

export function EventTooltip({ event, position }: EventTooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState(position)

  useEffect(() => {
    const updatePosition = () => {
      const tooltip = document.getElementById("event-tooltip")
      if (!tooltip) return

      const rect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x = position.x - rect.width / 2 // Center horizontally
      let y = position.y + 20 // Position below the event

      // Adjust if tooltip goes off screen horizontally
      if (x < 10) {
        x = 10
      } else if (x + rect.width > viewportWidth - 10) {
        x = viewportWidth - rect.width - 10
      }

      // Adjust if tooltip goes off screen vertically (show above if needed)
      if (y + rect.height > viewportHeight - 10) {
        y = position.y - rect.height - 10 // Position above the event
      }

      setTooltipPosition({ x, y })
    }

    updatePosition()
  }, [position])

  const getEventTypeLabel = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "Reunión"
      case "important":
        return "Importante"
      case "personal":
        return "Personal"
      case "work":
        return "Trabajo"
      default:
        return "Evento"
    }
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-primary/10 text-primary border-primary/20"
      case "important":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "personal":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "work":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div
      id="event-tooltip"
      className="fixed z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      }}
    >
      <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl max-w-sm">
        <div className="p-5 space-y-4">
          {/* Header with title and type badge */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-base leading-tight text-foreground">
                {event.title}
              </h4>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}
              >
                {getEventTypeLabel(event.type)}
              </span>
            </div>

            {/* Time with icon */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{event.time}</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
