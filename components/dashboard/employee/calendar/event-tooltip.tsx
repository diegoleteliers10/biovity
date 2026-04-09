"use client"

import { Clock01Icon, Location05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { formatDateChilean } from "@/lib/utils"

type Event = {
  readonly id: string
  readonly title: string
  readonly startAt: string
  readonly description?: string
  readonly type: "interview" | "task_deadline" | "announcement" | "onboarding"
}

type EventTooltipProps = {
  readonly event: Event
  readonly position: { readonly x: number; readonly y: number }
}

export function EventTooltip({ event, position }: EventTooltipProps) {
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null)
  const tooltipPosition = adjustedPosition ?? position

  useEffect(() => {
    const updatePosition = () => {
      const tooltip = document.getElementById("event-tooltip")
      if (!tooltip) return

      const rect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x = position.x - rect.width / 2
      let y = position.y + 20

      if (x < 10) {
        x = 10
      } else if (x + rect.width > viewportWidth - 10) {
        x = viewportWidth - rect.width - 10
      }

      if (y + rect.height > viewportHeight - 10) {
        y = position.y - rect.height - 10
      }

      setAdjustedPosition({ x, y })
    }

    updatePosition()
  }, [position])

  const formatEventDateTime = (iso: string) => {
    return formatDateChilean(iso, "EEE d MMM, HH:mm")
  }

  const getEventTypeLabel = (type: Event["type"]) => {
    switch (type) {
      case "interview":
        return "Entrevista"
      case "onboarding":
        return "Onboarding"
      case "task_deadline":
        return "Tarea"
      case "announcement":
        return "Anuncio"
      default:
        return "Evento"
    }
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "interview":
        return "bg-primary/10 text-primary border-primary/20"
      case "onboarding":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "task_deadline":
        return "bg-accent/10 text-accent border-accent/20"
      case "announcement":
        return "bg-muted/10 text-muted-foreground border-muted/20"
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
      <Card className="bg-white/95 backdrop-blur-sm border border-border/10 shadow-ambient max-w-sm">
        <div className="p-5 space-y-4">
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

            <div className="flex items-center gap-2 text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{formatEventDateTime(event.startAt)}</span>
            </div>
          </div>

          {event.description && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
