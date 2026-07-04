"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { addWeeks, endOfWeek, startOfWeek } from "date-fns"
import { useMemo, useRef, useState } from "react"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import {
  useDeleteEvent,
  useEvent,
  useEvents,
  useParticipantStatuses,
  useUpdateEvent,
  useUpdateParticipantStatus,
} from "@/lib/api/use-events"
import { authClient } from "@/lib/auth-client"
import type { Event, EventStatus, EventType, ParticipantStatus } from "@/lib/types/events"
import { getChileanDate } from "@/lib/utils"
import { Calendar } from "./calendar"
import { EventDetailModal } from "./event-detail-modal"
import { FilterBar } from "./filter-bar"
import { UpcomingEvents } from "./upcoming-events"
import { WeekView } from "./week-view"

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
  const [view, setView] = useState<"month" | "week">("month")
  const [activeType, setActiveType] = useState<EventType | undefined>()
  const [activeStatus, setActiveStatus] = useState<EventStatus | undefined>()
  const [selectedEventDetail, setSelectedEventDetail] = useState<Event | null>(null)
  const [rsvpStatuses, setRsvpStatuses] = useState<Record<string, ParticipantStatus>>({})

  const { useSession } = authClient
  const { data: session } = useSession()
  const organizerId = (session?.user as { id?: string })?.id
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { from, to } = (() => {
    if (view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return { from: weekStart.toISOString(), to: weekEnd.toISOString() }
    }
    return {
      from: new Date(year, month, 1).toISOString(),
      to: new Date(year, month + 1, 0, 23, 59, 59).toISOString(),
    }
  })()

  const { events = [], isLoading } = useEvents({
    userId: userId ?? (userRole === "professional" ? organizerId : undefined),
    organizerId: userRole === "organization" ? organizerId : undefined,
    from,
    to,
    limit: 100,
    ...(activeType && { type: activeType }),
    ...(activeStatus && { status: activeStatus }),
  })

  const participantEventIds = useMemo(() => {
    return events
      .filter((e) => organizerId && e.candidateId === organizerId)
      .map((e) => e.id)
  }, [events, organizerId])
  const { statuses: serverStatuses } = useParticipantStatuses(participantEventIds)
  const mergedStatuses: Record<string, ParticipantStatus> = { ...serverStatuses, ...rsvpStatuses }
  const deleteEvent = useDeleteEvent()
  const updateEvent = useUpdateEvent()
  const updateParticipantStatus = useUpdateParticipantStatus()
  const { event: selectedEventDetailData } = useEvent(selectedEventDetail?.id)

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

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => addWeeks(prev, direction === "prev" ? -1 : 1))
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

  const handleRSVP = (eventId: string, status: ParticipantStatus) => {
    setRsvpStatuses((prev) => ({ ...prev, [eventId]: status }))
    if (organizerId) {
      updateParticipantStatus.mutate({ eventId, userId: organizerId, status })
    }
  }

  const displayEvents =
    userRole === "organization" ? events.filter((e) => e.organizerId === organizerId) : events

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <ConnectedNotificationBell />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide">Calendario</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-border/10">
            <div className="flex flex-col gap-3 border-b border-border/10 px-0 py-4 lg:py-6 lg:pr-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg sm:text-2xl font-semibold text-card-foreground tracking-tight">
                  {view === "month"
                    ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : "Vista semanal"}
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
                  <div className="flex rounded-md border border-border/30">
                    <Button
                      variant={view === "month" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("month")}
                      className="rounded-r-none text-xs"
                    >
                      Mes
                    </Button>
                    <Button
                      variant={view === "week" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setView("week")}
                      className="rounded-l-none text-xs"
                    >
                      Semana
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      view === "month" ? navigateMonth("prev") : navigateWeek("prev")
                    }
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
                    Hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      view === "month" ? navigateMonth("next") : navigateWeek("next")
                    }
                    className="size-8 p-0"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Button>
                </div>
              </div>
              <FilterBar
                activeType={activeType}
                activeStatus={activeStatus}
                onTypeChange={setActiveType}
                onStatusChange={setActiveStatus}
              />
            </div>

            <div className="px-0 pt-3 pb-3 lg:pt-3 lg:pr-6 lg:pb-6">
              {view === "month" ? (
                <Calendar
                  currentDate={currentDate}
                  events={displayEvents}
                  isLoading={isLoading}
                  onCreateEvent={userRole === "organization" ? handleCreateEvent : undefined}
                  onSelectEvent={setSelectedEventDetail}
                />
              ) : (
                <WeekView
                  currentDate={currentDate}
                  events={displayEvents}
                  isLoading={isLoading}
                  onCreateEvent={userRole === "organization" ? handleCreateEvent : undefined}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <UpcomingEvents
            events={displayEvents}
            isLoading={isLoading}
            userRole={userRole}
            currentUserId={organizerId}
            rsvpStatuses={mergedStatuses}
            onEdit={handleEditEvent}
            onDelete={(eventId) => deleteEvent.mutate(eventId)}
            onStatusChange={(eventId, status) =>
              updateEvent.mutate({ id: eventId, input: { status } })
            }
            onRSVP={handleRSVP}
            isUpdating={updateParticipantStatus.isPending}
          />
        </div>
      </div>

      {organizerId && (
        <EventFormModal
          key={showEventModal ? (editingEvent?.id ?? "new") : "closed"}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
          }}
          organizerId={organizerId}
          organizationId={organizationId ?? ""}
          lockedType={undefined}
          editEvent={editingEvent ?? undefined}
          onSuccess={() => {}}
          onDelete={() => {}}
        />
      )}
      {selectedEventDetail && (
        <EventDetailModal
          event={selectedEventDetail}
          isOpen={true}
          onClose={() => setSelectedEventDetail(null)}
          currentUserId={organizerId}
          participants={selectedEventDetailData?.participants}
          rsvpStatus={mergedStatuses[selectedEventDetail.id]}
          onRSVP={handleRSVP}
          isUpdating={updateParticipantStatus.isPending}
        />
      )}
    </div>
  )
}
