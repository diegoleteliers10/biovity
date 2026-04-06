"use client"

import { Calendar01Icon, Cancel01Icon, Clock03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
  if (!isOpen) return null

  const formatEventTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return ""
    }
  }

  const getEventTypeInfo = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "interview":
        return { color: "bg-primary/10 text-primary border-primary/20", label: "Entrevista" }
      case "onboarding":
        return { color: "bg-secondary/10 text-secondary-foreground border-secondary/20", label: "Onboarding" }
      case "task_deadline":
        return { color: "bg-accent/10 text-accent-foreground border-accent/20", label: "Tarea" }
      case "announcement":
        return { color: "bg-muted/10 text-muted-foreground border-muted/20", label: "Anuncio" }
      default:
        return { color: "bg-muted/10 text-muted-foreground border-muted/20", label: "Evento" }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm border-none p-0 cursor-pointer"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") {
            onClose()
          }
        }}
        aria-label="Cerrar modal"
      />

      {/* Modal */}
      <div className="relative bg-white border border-border/10 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl">
              <HugeiconsIcon icon={Calendar01Icon} className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">{day}</h2>
              <p className="text-sm text-muted-foreground">{dayName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HugeiconsIcon icon={Calendar01Icon} className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No hay eventos programados para este día</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">
                  {events.length} {events.length === 1 ? "evento" : "eventos"}
                </h3>
              </div>

              <div className="space-y-3">
                {events.map((event) => {
                  const typeInfo = getEventTypeInfo(event.type)
                  return (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg bg-[#f3f3f5] hover:bg-[#e2e2e4] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-medium text-card-foreground leading-tight">
                          {event.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border shrink-0 ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock03Icon} className="w-4 h-4" />
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
      </div>
    </div>
  )
}
