"use client"

import type React from "react"

import { useState } from "react"
import { EventTooltip } from "./event-tooltip"
import { DayModal } from "./day-modal"

type Event = {
  readonly id: string
  readonly title: string
  readonly time: string
  readonly description: string
  readonly type: "meeting" | "personal" | "work" | "important"
}

const sampleEvents: Record<string, Event[]> = {
  "2025-09-20": [
    {
      id: "today-1",
      title: "Reunión de proyecto",
      time: "9:00 AM",
      description:
        "Revisión del progreso del proyecto y definición de próximos pasos con el equipo de desarrollo",
      type: "meeting",
    },
    {
      id: "today-2",
      title: "Presentación importante",
      time: "3:30 PM",
      description: "Presentación de resultados trimestrales a la junta directiva",
      type: "important",
    },
    {
      id: "today-3",
      title: "Llamada con cliente",
      time: "5:00 PM",
      description: "Seguimiento del proyecto y resolución de dudas técnicas",
      type: "work",
    },
  ],
  "2024-12-15": [
    {
      id: "1",
      title: "Reunión de equipo",
      time: "10:00 AM",
      description: "Revisión semanal del proyecto y planificación de tareas",
      type: "meeting",
    },
  ],
  "2024-12-18": [
    {
      id: "2",
      title: "Presentación cliente",
      time: "2:00 PM",
      description: "Presentación final del proyecto al cliente principal",
      type: "important",
    },
  ],
  "2024-12-20": [
    {
      id: "3",
      title: "Cita médica",
      time: "11:30 AM",
      description: "Chequeo médico anual",
      type: "personal",
    },
  ],
  "2024-12-22": [
    {
      id: "4",
      title: "Entrega proyecto",
      time: "5:00 PM",
      description: "Fecha límite para la entrega del proyecto Q4",
      type: "work",
    },
  ],
}

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

type CalendarProps = {
  readonly currentDate: Date
}

export function Calendar({ currentDate }: CalendarProps) {
  const [hoveredEvent, setHoveredEvent] = useState<{
    event: Event
    position: { x: number; y: number }
  } | null>(null)
  const [selectedDay, setSelectedDay] = useState<{
    day: number
    dayName: string
    events: Event[]
  } | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-primary text-primary-foreground"
      case "important":
        return "bg-destructive text-destructive-foreground"
      case "personal":
        return "bg-secondary text-secondary-foreground"
      case "work":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleEventHover = (event: Event, mouseEvent: React.MouseEvent) => {
    setHoveredEvent({
      event,
      position: { x: mouseEvent.clientX, y: mouseEvent.clientY },
    })
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  const handleDayClick = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEvents = sampleEvents[dateKey] || []
    const date = new Date(year, month, day)
    const dayName = dayNames[date.getDay()]

    setSelectedDay({ day, dayName, events: dayEvents })
  }

  const handleCloseModal = () => {
    setSelectedDay(null)
  }

  return (
    <div className="relative">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {days.map((day, index) => {
          const dateKey = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null
          const dayEvents = dateKey ? sampleEvents[dateKey] || [] : []
          const isToday =
            day &&
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year

          return (
            <div
              key={index}
              className={`
                min-h-[120px] bg-card p-2 flex flex-col
                ${day ? "hover:bg-muted/50 transition-colors cursor-pointer" : ""}
                ${isToday ? "ring-2 ring-primary ring-inset" : ""}
              `}
              onClick={() => day && handleDayClick(day)}
            >
              {day && (
                <>
                  <div
                    className={`
                    text-sm font-medium mb-2 relative
                    ${isToday ? "text-primary font-bold" : "text-card-foreground"}
                  `}
                  >
                    {day}
                    {dayEvents.length > 2 && (
                      <span className="absolute -top-1 -right-1 text-secondary/50 text-[10px] w-6 h-6 flex items-center justify-center font-medium">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`
                          text-xs px-2 py-1 rounded-md cursor-pointer
                          transition-all duration-200 hover:scale-105
                          ${getEventTypeColor(event.type)}
                        `}
                        onMouseEnter={(e) => handleEventHover(event, e)}
                        onMouseLeave={handleEventLeave}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-80">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Event Tooltip */}
      {hoveredEvent && <EventTooltip event={hoveredEvent.event} position={hoveredEvent.position} />}

      {/* DayModal component */}
      {selectedDay && (
        <DayModal
          isOpen={true}
          onClose={handleCloseModal}
          day={selectedDay.day}
          dayName={selectedDay.dayName}
          events={selectedDay.events}
        />
      )}
    </div>
  )
}
