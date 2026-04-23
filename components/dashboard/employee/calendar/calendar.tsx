"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"
import { useState } from "react"
import type { Event } from "@/lib/types/events"
import { getChileanDate } from "@/lib/utils"
import { DayModal } from "./day-modal"
import { EventTooltip } from "./event-tooltip"

type CalendarEvent = {
  readonly id: string
  readonly title: string
  readonly startAt: string
  readonly description?: string
  readonly type: "interview" | "task_deadline" | "announcement" | "onboarding"
}

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

type CalendarProps = {
  readonly currentDate: Date
  events?: Event[]
  isLoading?: boolean
  onCreateEvent?: (date: Date) => void
}

export function Calendar({ currentDate, events = [], isLoading, onCreateEvent }: CalendarProps) {
  const [hoveredEvent, setHoveredEvent] = useState<{
    event: CalendarEvent
    position: { x: number; y: number }
  } | null>(null)
  const [selectedDay, setSelectedDay] = useState<{
    day: number
    dayName: string
    date: Date
    events: CalendarEvent[]
  } | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days: (number | null)[] = []

  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  // Agrupar eventos por fecha (en zona horaria Chile)
  const eventsByDate: Record<string, CalendarEvent[]> = {}
  for (const event of events) {
    const chileDate = getChileanDate(event.startAt)
    const dateKey = format(chileDate, "yyyy-MM-dd")
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = []
    }
    eventsByDate[dateKey].push({
      id: event.id,
      title: event.title,
      startAt: event.startAt,
      description: event.description,
      type: event.type,
    })
  }

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "interview":
        return "bg-primary text-primary-foreground"
      case "onboarding":
        return "bg-secondary text-secondary-foreground"
      case "task_deadline":
        return "bg-accent text-accent-foreground"
      case "announcement":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatEventTime = (iso: string) => {
    try {
      const chileDate = getChileanDate(iso)
      return format(chileDate, "HH:mm")
    } catch {
      return ""
    }
  }

  const handleEventHover = (event: CalendarEvent, mouseEvent: React.MouseEvent) => {
    setHoveredEvent({
      event,
      position: { x: mouseEvent.clientX, y: mouseEvent.clientY },
    })
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day)
    const dayName = dayNames[date.getDay()]
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEvents = eventsByDate[dateKey] || []

    setSelectedDay({ day, dayName, date, events: dayEvents })
  }

  const handleCloseModal = () => {
    setSelectedDay(null)
  }

  const handleDayDoubleClick = (day: number) => {
    if (!onCreateEvent) return
    const date = new Date(year, month, day)
    onCreateEvent(date)
  }

  return (
    <div className="relative">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-px mb-1 lg:mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-1.5 lg:p-3 text-center text-xs lg:text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden lg:gap-[1.5px]">
        {days.map((day, index) => {
          const dateKey = day
            ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : null
          const dayEvents = dateKey ? eventsByDate[dateKey] || [] : []
          const nowChile = getChileanDate()
          const isToday =
            day &&
            nowChile.getDate() === day &&
            nowChile.getMonth() === month &&
            nowChile.getFullYear() === year

          return (
            <div
              key={dateKey ?? `empty-${index}`}
              role={day ? "button" : "presentation"}
              tabIndex={day ? 0 : undefined}
              className={`
                min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] bg-card p-1.5 lg:p-2 flex flex-col
                ${day ? "hover:bg-[#f3f3f5] transition-colors cursor-pointer" : ""}
                ${isToday ? "ring-2 ring-secondary ring-inset" : ""}
              `}
              onClick={day ? () => handleDayClick(day) : undefined}
              onDoubleClick={day ? () => handleDayDoubleClick(day) : undefined}
              onKeyDown={
                day
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleDayClick(day)
                      }
                    }
                  : undefined
              }
            >
              {day && (
                <>
                  <div
                    className={`
                    text-sm font-medium mb-2 relative
                    ${isToday ? "text-secondary font-bold" : "text-foreground"}
                  `}
                  >
                    {day}
                    {dayEvents.length > 2 && (
                      <span className="absolute -top-1 -right-1 text-accent/60 text-[10px] w-6 h-6 flex items-center justify-center font-medium">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        role="button"
                        tabIndex={0}
                        className={`
                          text-xs px-2 py-1 rounded-md cursor-pointer
                          transition-all duration-200 hover:scale-105
                          ${getEventTypeColor(event.type)}
                        `}
                        onMouseEnter={(e) => handleEventHover(event, e)}
                        onMouseLeave={handleEventLeave}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-80">{formatEventTime(event.startAt)}</div>
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
