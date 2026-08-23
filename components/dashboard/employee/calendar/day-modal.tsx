"use client"

import { Calendar01Icon, Clock03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDateChilean } from "@/lib/utils"

type CalendarEvent = {
  readonly id: string
  readonly title: string
  readonly startAt: string
  readonly description?: string
  readonly type: "interview" | "task_deadline" | "announcement" | "onboarding"
}

type DayModalProps = {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly day: number
  readonly dayName: string
  readonly events: readonly CalendarEvent[]
}

export function DayModal({ isOpen, onClose, day, dayName, events }: DayModalProps) {
  const formatEventTime = (iso: string) => {
    return formatDateChilean(iso, "p")
  }

  const getEventTypeInfo = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "interview":
        return { color: "bg-primary/10 text-primary", label: "Entrevista" }
      case "onboarding":
        return {
          color: "bg-secondary/10 text-secondary",
          label: "Onboarding",
        }
      case "task_deadline":
        return { color: "bg-accent/10 text-accent", label: "Tarea" }
      case "announcement":
        return { color: "bg-surface-container-highest text-muted-foreground", label: "Anuncio" }
      default:
        return { color: "bg-surface-container-highest text-muted-foreground", label: "Evento" }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-surface-container-lowest ring-ring/20 shadow-none">
        <DialogTitle className="sr-only">
          Eventos del {day} {dayName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Lista de eventos programados para este día
        </DialogDescription>
        <DialogHeader className="p-5 border-b border-border/40 bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-surface-container-lowest border border-border/40 rounded-xl shrink-0">
              <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight tabular-nums text-foreground">
                {day}
              </h2>
              <p className="text-xs text-muted-foreground">{dayName}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {events.length === 0 ? (
            <div className="bg-surface-container-low border border-border/40 rounded-xl py-8 px-6 text-center">
              <div className="size-10 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-3">
                <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Sin eventos</p>
              <p className="text-xs text-muted-foreground">
                No hay eventos programados para este día.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs leading-4 font-medium text-foreground">
                  {events.length} {events.length === 1 ? "evento" : "eventos"}
                </h3>
              </div>

              <div className="space-y-3">
                {events.map((event) => {
                  const typeInfo = getEventTypeInfo(event.type)
                  return (
                    <div
                      key={event.id}
                      className="p-4 rounded-xl border border-border/40 bg-surface-container-low hover:bg-surface-container-highest/40 transition-colors duration-150 shadow-none"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="text-sm font-medium text-foreground leading-tight">
                          {event.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs leading-4 font-medium shrink-0 ${typeInfo.color}`}
                        >
                          {typeInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock03Icon} className="size-4" />
                          <span className="font-medium">{formatEventTime(event.startAt)}</span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
