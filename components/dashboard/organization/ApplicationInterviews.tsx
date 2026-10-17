"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEvents } from "@/lib/api/use-events"
import { formatParticipantTime, DEFAULT_EVENT_TIME_ZONE } from "@/lib/event-time"
import { EventInterviewRecords } from "./EventInterviewRecords"

type ApplicationInterviewsProps = {
  applicationId: string
  organizationId: string
}

const statusLabels = {
  scheduled: "Programada",
  completed: "Realizada",
  cancelled: "Cancelada",
} as const

export function ApplicationInterviews({
  applicationId,
  organizationId,
}: ApplicationInterviewsProps) {
  const { events, isLoading, isError } = useEvents({
    applicationId,
    organizationId,
    type: "interview",
    limit: 20,
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Entrevistas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando entrevistas...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">No se pudieron cargar las entrevistas.</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay entrevistas vinculadas a esta postulación.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatParticipantTime(event.startAt)} ·{" "}
                  {event.timeZone ?? DEFAULT_EVENT_TIME_ZONE}
                </p>
                {event.meetingUrl && (
                  <a
                    className="text-sm text-primary underline-offset-4 hover:underline"
                    href={event.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir reunión
                  </a>
                )}
              </div>
              <Badge variant={event.status === "cancelled" ? "secondary" : "outline"}>
                {statusLabels[event.status]}
              </Badge>
              {event.status === "completed" && <EventInterviewRecords eventId={event.id} />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
