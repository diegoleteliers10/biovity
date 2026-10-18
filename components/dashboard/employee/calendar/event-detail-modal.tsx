"use client"

import {
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Location05Icon,
  VideoCameraAiIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEventChangeHistory, useParticipantStatusHistory } from "@/lib/api/use-events"
import { DEFAULT_EVENT_TIME_ZONE, formatParticipantTime } from "@/lib/event-time"
import type { Event, EventParticipant, ParticipantStatus } from "@/lib/types/events"

const PARTICIPANT_STATUS_LABELS: Record<ParticipantStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptado",
  declined: "Rechazado",
}

const PARTICIPANT_STATUS_COLORS: Record<ParticipantStatus, string> = {
  pending: "bg-surface-container-highest text-muted-foreground",
  accepted: "bg-secondary/10 text-secondary",
  declined: "bg-destructive/10 text-destructive",
}

type EventDetailModalProps = {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
  currentUserRole?: "professional" | "organization"
  participants?: EventParticipant[]
  rsvpStatus?: ParticipantStatus
  onRSVP?: (eventId: string, status: ParticipantStatus) => void
  isUpdating?: boolean
}

const EVENT_TYPE_LABELS: Record<Event["type"], string> = {
  interview: "Entrevista",
  onboarding: "Onboarding",
  task_deadline: "Tarea / Deadline",
  announcement: "Anuncio",
}

const EVENT_TYPE_COLORS: Record<Event["type"], string> = {
  interview:
    "bg-primary/10 text-primary dark:bg-secondary-container dark:text-on-secondary-container dark:border-secondary-soft/35",
  onboarding: "bg-secondary/10 text-secondary",
  task_deadline: "bg-accent/10 text-accent",
  announcement: "bg-surface-container-highest text-muted-foreground",
}

const STATUS_LABELS: Record<Event["status"], string> = {
  scheduled: "Programado",
  completed: "Completado",
  cancelled: "Cancelado",
}

const STATUS_COLORS: Record<Event["status"], string> = {
  scheduled:
    "bg-primary/10 text-primary dark:bg-secondary-container dark:text-on-secondary-container dark:border-secondary-soft/35",
  completed: "bg-secondary/10 text-secondary",
  cancelled: "bg-destructive/10 text-destructive",
}

function ParticipantStatusHistory({ eventId, userId }: { eventId: string; userId: string }) {
  const { history, isLoading, isError, refetch } = useParticipantStatusHistory(eventId, userId)

  return (
    <section
      className="space-y-2 border-t border-border/40 pt-3"
      aria-label="Historial de respuesta"
    >
      <h3 className="text-xs font-medium text-foreground">Historial de respuesta</h3>
      {isLoading && <p className="text-xs text-muted-foreground">Cargando historial.</p>}
      {isError && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>No se pudo cargar el historial.</span>
          <button type="button" onClick={() => void refetch()} className="text-primary underline">
            Reintentar
          </button>
        </div>
      )}
      {!isLoading && !isError && history.length === 0 && (
        <p className="text-xs text-muted-foreground">No hay cambios de respuesta.</p>
      )}
      {!isLoading && !isError && history.length > 0 && (
        <ol className="space-y-2">
          {history.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground">
                {PARTICIPANT_STATUS_LABELS[entry.fromStatus]} →{" "}
                {PARTICIPANT_STATUS_LABELS[entry.toStatus]}
              </span>
              <time dateTime={entry.changedAt} className="shrink-0 text-muted-foreground">
                {formatParticipantTime(entry.changedAt, "d MMM yyyy, HH:mm")}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

const eventChangeLabel = (field: string): string => {
  switch (field) {
    case "title":
      return "Título"
    case "description":
      return "Descripción"
    case "type":
      return "Tipo"
    case "timeZone":
      return "Zona horaria"
    case "startAt":
      return "Inicio"
    case "endAt":
      return "Término"
    case "location":
      return "Ubicación"
    case "meetingUrl":
      return "Enlace de reunión"
    case "status":
      return "Estado"
    default:
      return field
  }
}

function EventChangeHistory({ eventId, enabled }: { eventId: string; enabled: boolean }) {
  const { history, isLoading, isError, refetch } = useEventChangeHistory(eventId, enabled)

  return (
    <section className="space-y-2 border-t border-border/40 pt-3" aria-label="Historial del evento">
      <h3 className="text-xs font-medium text-foreground">Historial del evento</h3>
      {isLoading && <p className="text-xs text-muted-foreground">Cargando historial.</p>}
      {isError && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>No se pudo cargar el historial.</span>
          <button type="button" onClick={() => void refetch()} className="text-primary underline">
            Reintentar
          </button>
        </div>
      )}
      {!isLoading && !isError && history.length === 0 && (
        <p className="text-xs text-muted-foreground">No hay cambios registrados.</p>
      )}
      {!isLoading && !isError && history.length > 0 && (
        <ol className="space-y-3">
          {history.map((entry) => (
            <li key={entry.id} className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-foreground">
                  {entry.action === "cancelled" ? "Evento cancelado" : "Evento actualizado"}
                </span>
                <time dateTime={entry.createdAt} className="shrink-0 text-muted-foreground">
                  {formatParticipantTime(entry.createdAt, "d MMM yyyy, HH:mm")}
                </time>
              </div>
              <p className="text-muted-foreground">
                {entry.actorUserId ? `Usuario ${entry.actorUserId}` : "Usuario eliminado"}
              </p>
              <ul className="space-y-1 text-muted-foreground">
                {Object.entries(entry.changes).map(([field, change]) => (
                  <li key={field}>
                    {eventChangeLabel(field)}: {change.from ?? "—"} → {change.to ?? "—"}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  currentUserId,
  currentUserRole,
  participants,
  rsvpStatus,
  onRSVP,
  isUpdating,
}: EventDetailModalProps) {
  if (!event) return null

  const myParticipant = currentUserId
    ? participants?.find((p) => p.userId === currentUserId)
    : undefined
  const isCandidate = Boolean(currentUserId && event.candidateId === currentUserId)
  const myStatus = rsvpStatus ?? myParticipant?.status
  const showRSVP = isCandidate && myStatus != null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-surface-container-lowest ring-ring/20 shadow-none">
        <DialogTitle className="sr-only">{event.title}</DialogTitle>
        <DialogDescription className="sr-only">Detalle del evento {event.title}</DialogDescription>
        <DialogHeader className="p-5 border-b border-border/40 bg-surface-container-low">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${EVENT_TYPE_COLORS[event.type]}`}
                >
                  {EVENT_TYPE_LABELS[event.type]}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[event.status]}`}
                >
                  {STATUS_LABELS[event.status]}
                </span>
              </div>
              <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                {event.title}
              </DialogTitle>
            </div>
            <div className="flex items-center justify-center size-10 bg-surface-container-lowest border border-border/40 rounded-xl shrink-0">
              <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-secondary" />
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3 text-sm">
            <HugeiconsIcon icon={Clock01Icon} className="size-4 text-muted-foreground shrink-0" />
            <div>
              <span className="font-medium text-foreground">
                {formatParticipantTime(event.startAt, "EEEE d 'de' MMMM, yyyy")}
              </span>
              <span className="text-muted-foreground ml-2">
                {formatParticipantTime(event.startAt, "HH:mm")}
                {event.endAt && ` - ${formatParticipantTime(event.endAt, "HH:mm")}`} ·{" "}
                {event.timeZone ?? DEFAULT_EVENT_TIME_ZONE}
              </span>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon
                icon={Location05Icon}
                className="size-4 text-muted-foreground shrink-0"
              />
              <span className="text-foreground">{event.location}</span>
            </div>
          )}

          {event.meetingUrl && (
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon
                icon={VideoCameraAiIcon}
                className="size-4 text-muted-foreground shrink-0"
              />
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {event.meetingUrl}
              </a>
            </div>
          )}

          {event.description && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-xs leading-4 font-medium text-foreground mb-1">Descripcion</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              Creado {formatParticipantTime(event.createdAt, "d 'de' MMMM, yyyy")}
            </p>
          </div>

          {isOpen &&
            event.candidateId &&
            currentUserId &&
            (currentUserId === event.candidateId ||
              currentUserId === event.organizerId ||
              currentUserRole === "organization") && (
              <ParticipantStatusHistory eventId={event.id} userId={event.candidateId} />
            )}

          {isOpen && currentUserRole === "organization" && (
            <EventChangeHistory eventId={event.id} enabled={isOpen} />
          )}

          {currentUserId && showRSVP && myStatus && (
            <div className="pt-3 border-t border-border/40">
              <p className="text-xs leading-4 font-medium text-foreground mb-2">Tu respuesta</p>
              {myStatus === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRSVP?.(event.id, "accepted")}
                    className="flex h-8 items-center gap-1.5 px-3 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5" />
                    Aceptar
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRSVP?.(event.id, "declined")}
                    className="flex h-8 items-center gap-1.5 px-3 text-xs font-medium rounded-md border border-destructive/30 bg-surface-container-lowest text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                    Rechazar
                  </button>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md ${PARTICIPANT_STATUS_COLORS[myStatus]}`}
                >
                  <HugeiconsIcon
                    icon={myStatus === "accepted" ? CheckmarkCircle01Icon : Cancel01Icon}
                    className="size-3.5"
                  />
                  {PARTICIPANT_STATUS_LABELS[myStatus]}
                </span>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
