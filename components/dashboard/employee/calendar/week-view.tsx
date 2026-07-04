"use client"

import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"
import { useState } from "react"
import type { Event } from "@/lib/types/events"
import { getChileanDate } from "@/lib/utils"
import { EventDetailModal } from "./event-detail-modal"

type WeekViewEvent = {
  readonly id: string
  readonly title: string
  readonly startAt: string
  readonly endAt?: string
  readonly description?: string
  readonly type: "interview" | "task_deadline" | "announcement" | "onboarding"
}

type WeekViewProps = {
  readonly currentDate: Date
  events?: Event[]
  isLoading?: boolean
  onCreateEvent?: (date: Date) => void
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const SLOT_HEIGHT = 48
const EMPTY_WEEK_EVENTS: Event[] = []

const getEventTypeColor = (type: WeekViewEvent["type"]) => {
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

export function WeekView({
  currentDate,
  events = EMPTY_WEEK_EVENTS,
  onCreateEvent,
}: WeekViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const eventsByDay: Record<string, WeekViewEvent[]> = {}
  for (const event of events) {
    const chileDate = getChileanDate(event.startAt)
    const dateKey = format(chileDate, "yyyy-MM-dd")
    if (!eventsByDay[dateKey]) {
      eventsByDay[dateKey] = []
    }
    eventsByDay[dateKey].push({
      id: event.id,
      title: event.title,
      startAt: event.startAt,
      endAt: event.endAt,
      description: event.description,
      type: event.type,
    })
  }

  const getEventPosition = (event: WeekViewEvent) => {
    const chileDate = getChileanDate(event.startAt)
    const hours = chileDate.getHours() + chileDate.getMinutes() / 60
    const startOffset = Math.max(0, hours - 8)
    const top = startOffset * SLOT_HEIGHT

    let height = SLOT_HEIGHT
    if (event.endAt) {
      const endChile = getChileanDate(event.endAt)
      const endHours = endChile.getHours() + endChile.getMinutes() / 60
      const duration = endHours - hours
      height = Math.max(SLOT_HEIGHT, duration * SLOT_HEIGHT)
    }

    return { top, height }
  }

  const handleSlotClick = (day: Date, hour: number) => {
    if (!onCreateEvent) return
    const date = new Date(day)
    date.setHours(hour, 0, 0, 0)
    onCreateEvent(date)
  }

  const handleEventClick = (event: WeekViewEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    const fullEvent = events.find((ev) => ev.id === event.id)
    if (fullEvent) {
      setSelectedEvent(fullEvent)
    }
  }

  const nowChile = getChileanDate()
  const currentHour = nowChile.getHours()
  const currentMinute = nowChile.getMinutes()
  const showCurrentTime = currentHour >= 8 && currentHour <= 20

  return (
    <div className="relative">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/30">
        <div />
        {weekDays.map((day) => {
          const isToday = isSameDay(day, nowChile)
          return (
            <div key={day.toISOString()} className="p-2 text-center border-l border-border/30">
              <div className="text-xs text-muted-foreground">
                {format(day, "EEE", { locale: es })}
              </div>
              <div
                className={`text-lg font-semibold ${isToday ? "text-secondary" : "text-foreground"}`}
              >
                {format(day, "d")}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] max-h-[600px] overflow-y-auto">
        {/* Time labels */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="border-b border-border/30 flex items-start justify-end pr-2"
              style={{ height: SLOT_HEIGHT }}
            >
              <span className="text-xs text-muted-foreground -mt-2">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDay[dateKey] || []

          return (
            <div key={day.toISOString()} className="relative border-l border-border/30">
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  style={{ height: SLOT_HEIGHT }}
                  onClick={() => handleSlotClick(day, hour)}
                  aria-label={`Crear evento ${format(day, "d 'de' MMMM", { locale: es })} a las ${String(hour).padStart(2, "0")}:00`}
                />
              ))}

              {/* Current time indicator */}
              {showCurrentTime && isSameDay(day, nowChile) && (
                <div
                  className="absolute left-0 right-0 z-20 pointer-events-none"
                  style={{
                    top: (currentHour - 8) * SLOT_HEIGHT + (currentMinute / 60) * SLOT_HEIGHT,
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                    <div className="flex-1 h-px bg-red-500" />
                  </div>
                </div>
              )}

              {/* Events */}
              {dayEvents.map((event) => {
                const { top, height } = getEventPosition(event)
                return (
                  <button
                    key={event.id}
                    type="button"
                    className={`absolute left-1 right-1 rounded px-2 py-1 text-xs overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] z-10 ${getEventTypeColor(event.type)}`}
                    style={{ top, height: Math.max(height - 2, 20) }}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="opacity-80 text-[10px]">
                      {format(getChileanDate(event.startAt), "HH:mm")}
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
