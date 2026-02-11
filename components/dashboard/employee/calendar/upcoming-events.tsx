"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

type Event = {
  readonly id: string
  readonly title: string
  readonly date: string
  readonly time: string
  readonly location?: string
  readonly type: "meeting" | "personal" | "work" | "important"
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Reunión de equipo",
    date: "15 Dic",
    time: "10:00 AM",
    location: "Sala de conferencias",
    type: "meeting",
  },
  {
    id: "2",
    title: "Presentación cliente",
    date: "18 Dic",
    time: "2:00 PM",
    location: "Oficina principal",
    type: "important",
  },
  {
    id: "3",
    title: "Cita médica",
    date: "20 Dic",
    time: "11:30 AM",
    location: "Hospital Central",
    type: "personal",
  },
  {
    id: "4",
    title: "Entrega proyecto",
    date: "22 Dic",
    time: "5:00 PM",
    type: "work",
  },
  {
    id: "5",
    title: "Llamada con cliente",
    date: "23 Dic",
    time: "9:00 AM",
    type: "meeting",
  },
]

export function UpcomingEvents() {
  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "border-l-primary bg-primary/5"
      case "important":
        return "border-l-destructive bg-destructive/5"
      case "personal":
        return "border-l-secondary bg-secondary/5"
      case "work":
        return "border-l-accent bg-accent/5"
      default:
        return "border-l-muted bg-muted/5"
    }
  }

  const getEventTypeDot = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-primary"
      case "important":
        return "bg-destructive"
      case "personal":
        return "bg-secondary"
      case "work":
        return "bg-accent"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="bg-sidebar border-sidebar-border h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-sidebar-primary" />
          <h3 className="text-lg font-semibold text-sidebar-foreground">Próximos Eventos</h3>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`
                relative p-4 rounded-lg border-l-4 transition-colors duration-200
                cursor-pointer
                ${getEventTypeColor(event.type)}
              `}
            >
              {/* Event indicator dot */}
              <div
                className={`
                absolute -left-2 top-6 w-3 h-3 rounded-full border-2 border-sidebar
                ${getEventTypeDot(event.type)}
              `}
              />

              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sidebar-foreground text-sm leading-tight">{event.title}</h4>
                  {index === 0 && (
                    <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-1 rounded-full font-medium">
                      Próximo
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-sidebar-foreground/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <button className="w-full text-sm text-sidebar-primary hover:text-sidebar-primary/80 font-medium transition-colors">
            Ver todos los eventos →
          </button>
        </div>
      </div>
    </Card>
  )
}
