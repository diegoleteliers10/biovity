"use client"

import {
  Calendar04Icon,
  Clock03Icon,
  Location05Icon,
  VideoCameraAiIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "@/lib/api/use-events"
import type { Event, EventType } from "@/lib/types/events"
import { cn } from "@/lib/utils"

type EventFormModalProps = {
  isOpen: boolean
  onClose: () => void
  organizerId: string
  organizationId?: string
  candidateId?: string
  applicationId?: string
  /** Si se pasa, el tipo está bloqueado */
  lockedType?: EventType
  /** Si se pasa, el modal está en modo edición */
  editEvent?: Event
  onSuccess?: (eventId: string) => void
  onDelete?: (eventId: string) => void
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "interview", label: "Entrevista" },
  { value: "task_deadline", label: "Tarea / Deadline" },
  { value: "announcement", label: "Anuncio" },
  { value: "onboarding", label: "Onboarding" },
]

export function EventFormModal({
  isOpen,
  onClose,
  organizerId,
  organizationId,
  candidateId,
  applicationId,
  lockedType,
  editEvent,
  onSuccess,
  onDelete,
}: EventFormModalProps) {
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  const isEditMode = Boolean(editEvent)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<EventType>(lockedType ?? "interview")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [meetingUrl, setMeetingUrl] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isLoading = createEvent.isPending || updateEvent.isPending || deleteEvent.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !startDate || !startTime) return

    const startAtISO = new Date(`${startDate}T${startTime}:00`).toISOString()
    const endAtISO =
      endDate && endTime ? new Date(`${endDate}T${endTime}:00`).toISOString() : undefined

    try {
      if (isEditMode && editEvent) {
        const result = await updateEvent.mutateAsync({
          id: editEvent.id,
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            type,
            startAt: startAtISO,
            endAt: endAtISO,
            location: location.trim() || undefined,
            meetingUrl: meetingUrl.trim() || undefined,
          },
        })
        onSuccess?.(result.id)
      } else {
        const result = await createEvent.mutateAsync({
          title: title.trim(),
          description: description.trim() || undefined,
          type,
          startAt: startAtISO,
          endAt: endAtISO,
          location: location.trim() || undefined,
          meetingUrl: meetingUrl.trim() || undefined,
          organizerId,
          ...(organizationId && { organizationId }),
          ...(candidateId && { candidateId }),
          ...(applicationId && { applicationId }),
        })
        onSuccess?.(result.id)
      }
    } finally {
      handleClose()
    }
  }

  const handleDelete = async () => {
    if (!editEvent) return
    setShowDeleteConfirm(false)

    try {
      await deleteEvent.mutateAsync(editEvent.id)
      onDelete?.(editEvent.id)
      handleClose()
    } catch {
      // error handled by mutation
    }
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setType(lockedType ?? "interview")
    setStartDate("")
    setStartTime("")
    setEndDate("")
    setEndTime("")
    setLocation("")
    setMeetingUrl("")
    onClose()
  }

  useEffect(() => {
    if (editEvent) {
      const start = new Date(editEvent.startAt)
      const end = editEvent.endAt ? new Date(editEvent.endAt) : null
      setTitle(editEvent.title)
      setDescription(editEvent.description ?? "")
      setType(editEvent.type)
      setStartDate(start.toISOString().split("T")[0])
      setStartTime(start.toTimeString().slice(0, 5))
      setEndDate(end ? end.toISOString().split("T")[0] : "")
      setEndTime(end ? end.toTimeString().slice(0, 5) : "")
      setLocation(editEvent.location ?? "")
      setMeetingUrl(editEvent.meetingUrl ?? "")
    }
  }, [editEvent])

  const isValid = title.trim() && startDate && startTime

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-lg [&_[data-slot=content]]:sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>
            {isEditMode
              ? "Editar Evento"
              : lockedType
                ? EVENT_TYPES.find((t) => t.value === lockedType)?.label
                : "Crear Evento"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Actualiza los detalles del evento"
              : lockedType
                ? `Programar ${EVENT_TYPES.find((t) => t.value === lockedType)?.label.toLowerCase()} para el candidato`
                : "Crear un nuevo evento en el calendario"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4"
        >
          {/* Título */}
          <div className="space-y-1.5">
            <label htmlFor="event-title" className="text-sm font-medium text-foreground">
              Título <span className="text-destructive">*</span>
            </label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                lockedType === "interview"
                  ? "Ej: Entrevista técnica - React Developer"
                  : lockedType === "onboarding"
                    ? "Ej: Onboarding - Nuevo empleado"
                    : "Ej: Reunión de equipo"
              }
              required
            />
          </div>

          {/* Tipo (solo si no está bloqueado) */}
          {!lockedType && (
            <div className="space-y-1.5">
              <label htmlFor="event-type" className="text-sm font-medium text-foreground">
                Tipo de evento
              </label>
              <select
                id="event-type"
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-1.5">
            <label htmlFor="event-description" className="text-sm font-medium text-foreground">
              Descripción
            </label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales sobre el evento..."
              rows={3}
            />
          </div>

          {/* Fecha y hora de inicio */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Fecha y hora de inicio <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HugeiconsIcon
                  icon={Calendar04Icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative flex-1">
                <HugeiconsIcon
                  icon={Clock03Icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fecha y hora de fin (opcional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Fecha y hora de fin{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HugeiconsIcon
                  icon={Calendar04Icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1">
                <HugeiconsIcon
                  icon={Clock03Icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-1.5">
            <label htmlFor="event-location" className="text-sm font-medium text-foreground">
              Ubicación
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={Location05Icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Oficina central, Sala A, Remoto..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Link de reunión */}
          <div className="space-y-1.5">
            <label htmlFor="event-meeting-url" className="text-sm font-medium text-foreground">
              Link de reunión
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={VideoCameraAiIcon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="event-meeting-url"
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Error */}
          {(createEvent.isError || updateEvent.isError) && (
            <p className="text-sm text-destructive">
              {createEvent.error instanceof Error
                ? createEvent.error.message
                : updateEvent.error instanceof Error
                  ? updateEvent.error.message
                  : "Error en el evento"}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto flex gap-2 pt-4 border-t">
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
                className="flex-1"
              >
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading} className="flex-1">
              {isLoading
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                  ? "Guardar"
                  : "Crear evento"}
            </Button>
          </div>
        </form>
      </SheetContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  )
}
