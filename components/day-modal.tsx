"use client"
import { X, Clock, CalendarIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  time: string
  description: string
  type: "meeting" | "personal" | "work" | "important"
}

interface DayModalProps {
  isOpen: boolean
  onClose: () => void
  day: number
  dayName: string
  events: Event[]
}

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function DayModal({ isOpen, onClose, day, dayName, events }: DayModalProps) {
  if (!isOpen) return null

  const getEventTypeInfo = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return { color: "bg-primary/10 text-primary border-primary/20", label: "Reunión" }
      case "important":
        return { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Importante" }
      case "personal":
        return { color: "bg-secondary/10 text-secondary-foreground border-secondary/20", label: "Personal" }
      case "work":
        return { color: "bg-accent/10 text-accent-foreground border-accent/20", label: "Trabajo" }
      default:
        return { color: "bg-muted/10 text-muted-foreground border-muted/20", label: "Evento" }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">{day}</h2>
              <p className="text-sm text-muted-foreground">{dayName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
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
                      className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-medium text-card-foreground leading-tight">{event.title}</h4>
                        <span
                          className={`
                          px-2 py-1 rounded-md text-xs font-medium border shrink-0
                          ${typeInfo.color}
                        `}
                        >
                          {typeInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">{event.time}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
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
