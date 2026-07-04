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
import type { Event, EventParticipant, ParticipantStatus } from "@/lib/types/events"
import { formatDateChilean } from "@/lib/utils"

const PARTICIPANT_STATUS_LABELS: Record<ParticipantStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptado",
  declined: "Rechazado",
}

const PARTICIPANT_STATUS_COLORS: Record<ParticipantStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-red-50 text-red-600 border-red-200",
}

type EventDetailModalProps = {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
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
  interview: "bg-primary/10 text-primary border-primary/20",
  onboarding: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  task_deadline: "bg-accent/10 text-accent-foreground border-accent/20",
  announcement: "bg-muted/40 text-muted-foreground border-border/30",
}

const STATUS_LABELS: Record<Event["status"], string> = {
  scheduled: "Programado",
  completed: "Completado",
  cancelled: "Cancelado",
}

const STATUS_COLORS: Record<Event["status"], string> = {
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-50 text-red-600",
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  currentUserId,
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
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">{event.title}</DialogTitle>
        <DialogDescription className="sr-only">Detalle del evento {event.title}</DialogDescription>
        <DialogHeader className="p-6 pb-4 border-b border-border/10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium border ${EVENT_TYPE_COLORS[event.type]}`}
                >
                  {EVENT_TYPE_LABELS[event.type]}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[event.status]}`}
                >
                  {STATUS_LABELS[event.status]}
                </span>
              </div>
              <DialogTitle className="text-xl font-semibold text-card-foreground leading-tight">
                {event.title}
              </DialogTitle>
            </div>
            <div className="flex items-center justify-center size-10 bg-secondary/10 rounded-xl shrink-0">
              <HugeiconsIcon icon={Calendar01Icon} className="size-5 text-secondary" />
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3 text-sm">
            <HugeiconsIcon icon={Clock01Icon} className="size-4 text-muted-foreground shrink-0" />
            <div>
              <span className="font-medium text-card-foreground">
                {formatDateChilean(event.startAt, "EEEE d 'de' MMMM, yyyy")}
              </span>
              <span className="text-muted-foreground ml-2">
                {formatDateChilean(event.startAt, "HH:mm")}
                {event.endAt && ` - ${formatDateChilean(event.endAt, "HH:mm")}`}
              </span>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-sm">
              <HugeiconsIcon
                icon={Location05Icon}
                className="size-4 text-muted-foreground shrink-0"
              />
              <span className="text-card-foreground">{event.location}</span>
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
            <div className="pt-2 border-t border-border/10">
              <p className="text-xs font-medium text-muted-foreground mb-1">Descripcion</p>
              <p className="text-sm text-card-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="pt-2 border-t border-border/10">
            <p className="text-xs text-muted-foreground">
              Creado {formatDateChilean(event.createdAt, "d 'de' MMMM, yyyy")}
            </p>
          </div>

          {currentUserId && showRSVP && myStatus && (
            <div className="pt-3 border-t border-border/10">
              <p className="text-xs font-medium text-muted-foreground mb-2">Tu respuesta</p>
              {myStatus === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRSVP?.(event.id, "accepted")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5" />
                    Aceptar
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRSVP?.(event.id, "declined")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                    Rechazar
                  </button>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${PARTICIPANT_STATUS_COLORS[myStatus]}`}
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
