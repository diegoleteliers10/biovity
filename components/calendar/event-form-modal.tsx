"use client"

import { useState } from "react"
import { Calendar04Icon, Clock03Icon, Location05Icon, VideoCameraAiIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useCreateEvent } from "@/lib/api/use-events"
import type { EventType } from "@/lib/types/events"
import { cn } from "@/lib/utils"

type EventFormModalProps = {
  isOpen: boolean
  onClose: () => void
  organizerId: string
  candidateId?: string
  applicationId?: string
  /** Si se pasa, el tipo está bloqueado */
  lockedType?: EventType
  onSuccess?: (eventId: string) => void
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
  candidateId,
  applicationId,
  lockedType,
  onSuccess,
}: EventFormModalProps) {
  const createEvent = useCreateEvent()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<EventType>(lockedType ?? "interview")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [meetingUrl, setMeetingUrl] = useState("")

  const isLoading = createEvent.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !startDate || !startTime) return

    const startAt = new Date(`${startDate}T${startTime}:00`).toISOString()
    const endAt = endDate && endTime ? new Date(`${endDate}T${endTime}:00`).toISOString() : undefined

    try {
      const result = await createEvent.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        startAt,
        endAt,
        location: location.trim() || undefined,
        meetingUrl: meetingUrl.trim() || undefined,
        organizerId,
        candidateId,
        applicationId,
      })

      onSuccess?.(result.id)
    } finally {
      handleClose()
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

  const isValid = title.trim() && startDate && startTime

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {lockedType ? EVENT_TYPES.find((t) => t.value === lockedType)?.label : "Crear Evento"}
          </SheetTitle>
          <SheetDescription>
            {lockedType
              ? `Programar ${EVENT_TYPES.find((t) => t.value === lockedType)?.label.toLowerCase()} para el candidato`
              : "Crear un nuevo evento en el calendario"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
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
          {createEvent.isError && (
            <p className="text-sm text-destructive">
              {createEvent.error instanceof Error
                ? createEvent.error.message
                : "Error al crear el evento"}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto flex gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading} className="flex-1">
              {isLoading ? "Creando..." : "Crear evento"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
