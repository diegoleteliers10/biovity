"use client"

import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"
import { useState } from "react"
import { DEFAULT_EVENT_TIME_ZONE } from "@/lib/event-time"
import type { Event } from "@/lib/types/events"

import { EventDetailModal } from "./event-detail-modal"

type WeekViewEvent = {
  readonly id: string
  readonly title: string
  readonly startAt: string
  readonly timeZone?: string
  readonly endAt?: string
  readonly description?: string
  readonly type: "interview" | "task_deadline" | "announcement" | "onboarding"
}

type WeekViewProps = {
  readonly currentDate: Date
  currentUserId?: string
  currentUserRole?: "professional" | "organization"
  events?: Event[]
  isLoading?: boolean
  onCreateEvent?: (date: Date) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const SLOT_HEIGHT = 48
const EMPTY_WEEK_EVENTS: Event[] = []

const getEventTypeColor = (type: WeekViewEvent["type"]) => {
  switch (type) {
    case "interview":
      return "bg-primary text-primary-foreground dark:bg-secondary-container dark:text-on-secondary-container dark:border-secondary-soft/35"
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
  currentUserId,
  currentUserRole,
  events = EMPTY_WEEK_EVENTS,
  isLoading,
  onCreateEvent,
}: WeekViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const eventsByDay: Record<string, WeekViewEvent[]> = {}
  for (const event of events) {
    const localDate = new Date(event.startAt)
    const dateKey = format(localDate, "yyyy-MM-dd")
    if (!eventsByDay[dateKey]) {
      eventsByDay[dateKey] = []
    }
    eventsByDay[dateKey].push({
      id: event.id,
      title: event.title,
      startAt: event.startAt,
      timeZone: event.timeZone,
      endAt: event.endAt,
      description: event.description,
      type: event.type,
    })
  }

  const getEventPosition = (event: WeekViewEvent) => {
    const localDate = new Date(event.startAt)
    const hours = localDate.getHours() + localDate.getMinutes() / 60
    const top = hours * SLOT_HEIGHT

    let height = SLOT_HEIGHT
    if (event.endAt) {
      const duration = (Date.parse(event.endAt) - Date.parse(event.startAt)) / 3_600_000
      height = Math.max(SLOT_HEIGHT, duration * SLOT_HEIGHT)
    }

    return { top, height: Math.min(height, (24 - hours) * SLOT_HEIGHT) }
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

  const localNow = new Date()
  const currentHour = localNow.getHours()
  const currentMinute = localNow.getMinutes()

  return (
    <div className="relative">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/30">
        <div />
        {weekDays.map((day) => {
          const isToday = isSameDay(day, localNow)
          return (
            <div key={day.toISOString()} className="p-2 text-center border-l border-border/30">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                {format(day, "EEE", { locale: es })}
              </div>
              <div
                className={`text-sm font-semibold tabular-nums ${isToday ? "text-secondary" : "text-foreground"}`}
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
              <span className="text-xs font-mono text-muted-foreground -mt-2 tabular-nums">
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
                  disabled={!onCreateEvent}
                  className="block w-full border-b border-border/30 hover:bg-surface-container-highest/40 transition-colors"
                  style={{ height: SLOT_HEIGHT }}
                  onClick={() => handleSlotClick(day, hour)}
                  aria-label={`Crear evento ${format(day, "d 'de' MMMM", { locale: es })} a las ${String(hour).padStart(2, "0")}:00`}
                />
              ))}

              {isLoading && (
                <div className="absolute inset-x-1 top-1 space-y-1 z-10 pointer-events-none">
                  <div className="h-10 rounded-md bg-surface-container-highest/60 animate-pulse" />
                  <div className="h-10 rounded-md bg-surface-container-highest/60 animate-pulse" />
                </div>
              )}

              {/* Current time indicator */}
              {isSameDay(day, localNow) && (
                <div
                  className="absolute left-0 right-0 z-20 pointer-events-none"
                  style={{
                    top: currentHour * SLOT_HEIGHT + (currentMinute / 60) * SLOT_HEIGHT,
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-destructive -ml-1" />
                    <div className="flex-1 h-px bg-destructive" />
                  </div>
                </div>
              )}

              {/* Events */}
              {!isLoading &&
                dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event)
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={`absolute left-1 right-1 rounded px-2 py-1 text-xs overflow-hidden cursor-pointer transition-opacity duration-150 hover:opacity-90 z-10 ${getEventTypeColor(event.type)}`}
                      style={{ top, height: Math.max(height - 2, 20) }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="opacity-80 text-[10px] tabular-nums">
                        {format(new Date(event.startAt), "HH:mm")} ·{" "}
                        {event.timeZone ?? DEFAULT_EVENT_TIME_ZONE}
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
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  )
}
