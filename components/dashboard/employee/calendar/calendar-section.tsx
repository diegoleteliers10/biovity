"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
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
  const [currentDate, setCurrentDate] = useState(() => getChileanDate())
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const selectedDateRef = useRef<Date | null>(null)

  const { useSession } = authClient
  const { data: session } = useSession()
  const organizerId = (session?.user as { id?: string })?.id
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

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
    selectedDateRef.current = date ?? null
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const displayEvents =
    userRole === "organization" ? events.filter((e) => e.organizerId === organizerId) : events

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <NotificationBell notifications={[]} />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <NotificationBell notifications={[]} />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide">Calendario</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-border/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/10 px-0 py-4 lg:py-6 lg:pr-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-card-foreground tracking-tight">
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
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    <span className="hidden sm:inline">Crear evento</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="size-8 p-0"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(getChileanDate())}
                  className="text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Hoy</span>
                  <span className="sm:hidden">Hoy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="size-8 p-0"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
              </div>
            </div>

            <div className="px-0 pt-3 pb-3 lg:pt-3 lg:pr-6 lg:pb-6">
              <Calendar
                currentDate={currentDate}
                events={displayEvents}
                isLoading={isLoading}
                onCreateEvent={userRole === "organization" ? handleCreateEvent : undefined}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <UpcomingEvents
            events={displayEvents}
            isLoading={isLoading}
            onEdit={handleEditEvent}
            onDelete={(eventId) => console.log("Delete event:", eventId)}
          />
        </div>
      </div>

      {organizerId && (
        <EventFormModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
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
