"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { Button } from "@/components/ui/button"
import { useEvents } from "@/lib/api/use-events"
import { authClient } from "@/lib/auth-client"
import type { Event } from "@/lib/types/events"
import { getChileanDate } from "@/lib/utils"
import { Calendar } from "./calendar"
import { UpcomingEvents } from "./upcoming-events"

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

type CalendarSectionProps = {
  userId?: string
  userRole?: "professional" | "organization"
}

export function CalendarSection({ userId, userRole }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(getChileanDate())
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { useSession } = authClient
  const { data: session } = useSession()
  const organizerId = (session?.user as { id?: string })?.id
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

  // Calcular rango de fechas para el mes actual
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const from = new Date(year, month, 1).toISOString()
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

  const { events = [], isLoading } = useEvents({
    userId,
    from,
    to,
    limit: 100,
  })

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleCreateEvent = (date?: Date) => {
    setEditingEvent(null)
    setSelectedDate(date ?? null)
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  // Para profesionales, usan su propio ID
  // Para organizaciones, pueden ver eventos donde fueron organizadores o participantes
  const displayEvents =
    userRole === "organization" ? events.filter((e) => e.organizerId === organizerId) : events

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl border border-border/10">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/10">
            <h2 className="text-2xl font-semibold text-card-foreground">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              {userRole === "organization" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleCreateEvent()}
                  className="gap-1.5"
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
                  Crear evento
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="h-8 w-8 p-0"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(getChileanDate())}
                className="text-sm px-3"
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="h-8 w-8 p-0"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <Calendar
              currentDate={currentDate}
              events={displayEvents}
              isLoading={isLoading}
              onCreateEvent={userRole === "organization" ? handleCreateEvent : undefined}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="lg:col-span-1">
        <UpcomingEvents
          events={displayEvents}
          isLoading={isLoading}
          onEdit={handleEditEvent}
          onDelete={(eventId) => console.log("Delete event:", eventId)}
        />
      </div>

      {/* Create/Edit Event Modal */}
      {organizerId && (
        <EventFormModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
            setSelectedDate(null)
          }}
          organizerId={organizerId}
          organizationId={organizationId ?? ""}
          lockedType={undefined}
          editEvent={editingEvent ?? undefined}
          onSuccess={(eventId) => {
            console.log(editingEvent ? "Evento actualizado:" : "Evento creado:", eventId)
          }}
          onDelete={(eventId) => {
            console.log("Evento eliminado:", eventId)
          }}
        />
      )}
    </div>
  )
}
