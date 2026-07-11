"use client"

import { Location05Icon, VideoCameraAiIcon } from "@hugeicons/core-free-icons"
import { useState, useTransition } from "react"
import { Sheet, SheetContent } from "@/components/animate-ui/components/radix/sheet"
import { Input } from "@/components/ui/input"
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "@/lib/api/use-events"
import { useProfessionalUsers } from "@/lib/api/use-talent"
import type { Event, EventType } from "@/lib/types/events"
import { DateTimeInput } from "./DateTimeInput"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { EventFormError } from "./EventFormError"
import { EventFormFooter } from "./EventFormFooter"
import { EventFormHeader } from "./EventFormHeader"
import { EventTypeSelect } from "./EventTypeSelect"
import { FormField } from "./FormField"
import { IconInput } from "./IconInput"

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "interview", label: "Entrevista" },
  { value: "task_deadline", label: "Tarea / Deadline" },
  { value: "announcement", label: "Anuncio" },
  { value: "onboarding", label: "Onboarding" },
]

export type EventFormModalProps = {
  isOpen: boolean
  onClose: () => void
  organizerId: string
  organizationId?: string
  candidateId?: string
  applicationId?: string
  lockedType?: EventType
  editEvent?: Event
  onSuccess?: (eventId: string) => void
  onDelete?: (eventId: string) => void
}

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

  const parsedStartDate = editEvent ? new Date(editEvent.startAt) : null
  const parsedEndDate = editEvent?.endAt ? new Date(editEvent.endAt) : null

  const effectiveTitle = editEvent?.title ?? ""
  const effectiveDescription = editEvent?.description ?? ""
  const effectiveType = editEvent?.type ?? lockedType ?? "interview"
  const effectiveStartDate = parsedStartDate ? parsedStartDate.toISOString().split("T")[0] : ""
  const effectiveStartTime = parsedStartDate ? parsedStartDate.toTimeString().slice(0, 5) : ""
  const effectiveEndDate = parsedEndDate ? parsedEndDate.toISOString().split("T")[0] : ""
  const effectiveEndTime = parsedEndDate ? parsedEndDate.toTimeString().slice(0, 5) : ""
  const effectiveLocation = editEvent?.location ?? ""
  const effectiveMeetingUrl = editEvent?.meetingUrl ?? ""

  const [title, setTitle] = useState(effectiveTitle)
  const [description, setDescription] = useState(effectiveDescription)
  const [type, setType] = useState<EventType>(effectiveType)
  const [startDate, setStartDate] = useState(effectiveStartDate)
  const [startTime, setStartTime] = useState(effectiveStartTime)
  const [endDate, setEndDate] = useState(effectiveEndDate)
  const [endTime, setEndTime] = useState(effectiveEndTime)
  const [location, setLocation] = useState(effectiveLocation)
  const [meetingUrl, setMeetingUrl] = useState(effectiveMeetingUrl)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(candidateId)
  const [candidateSearch, setCandidateSearch] = useState("")
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false)

  const { data: candidateResults } = useProfessionalUsers(1, candidateSearch.trim() || undefined)

  const [isPending, startTransition] = useTransition()
  const isLoading =
    isPending || createEvent.isPending || updateEvent.isPending || deleteEvent.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !startDate || !startTime) return

    const startAtISO = new Date(`${startDate}T${startTime}:00`).toISOString()
    const endAtISO =
      endDate && endTime ? new Date(`${endDate}T${endTime}:00`).toISOString() : undefined

    startTransition(async () => {
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
            ...(selectedCandidateId && { candidateId: selectedCandidateId }),
            ...(applicationId && { applicationId }),
          })
          onSuccess?.(result.id)
        }
      } finally {
        handleClose()
      }
    })
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
    setSelectedCandidateId(candidateId)
    setCandidateSearch("")
    setShowCandidateDropdown(false)
    onClose()
  }

  const isValid = !!(title.trim() && startDate && startTime)

  const eventError =
    createEvent.error instanceof Error
      ? createEvent.error
      : updateEvent.error instanceof Error
        ? updateEvent.error
        : null

  const lockedTypeLabel = lockedType
    ? EVENT_TYPES.find((t) => t.value === lockedType)?.label
    : undefined

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      key={editEvent?.id ?? "new"}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-lg [&_[data-slot=content]]:sm:max-w-lg"
      >
        <EventFormHeader
          isEditMode={isEditMode}
          lockedType={lockedType}
          eventTypeLabel={lockedTypeLabel}
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4"
        >
          <FormField
            id="event-title"
            label="Título"
            required
            value={title}
            onChange={setTitle}
            placeholder={
              lockedType === "interview"
                ? "Ej: Entrevista técnica - React Developer"
                : lockedType === "onboarding"
                  ? "Ej: Onboarding - Nuevo empleado"
                  : "Ej: Reunión de equipo"
            }
          />

          {!lockedType && (
            <EventTypeSelect value={type} onChange={setType} EVENT_TYPES={EVENT_TYPES} />
          )}

          <FormField
            id="event-description"
            label="Descripción"
            value={description}
            onChange={setDescription}
            placeholder="Detalles adicionales sobre el evento..."
            type="textarea"
            rows={3}
          />

          <DateTimeInput
            startLabel="Fecha y hora de inicio"
            endLabel="Fecha y hora de fin"
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            onStartDateChange={setStartDate}
            onStartTimeChange={setStartTime}
            onEndDateChange={setEndDate}
            onEndTimeChange={setEndTime}
            requiredFields
          />

          <IconInput
            id="event-location"
            label="Ubicación"
            icon={Location05Icon}
            value={location}
            onChange={setLocation}
            placeholder="Oficina central, Sala A, Remoto..."
          />

          <IconInput
            id="event-meeting-url"
            label="Link de reunión"
            icon={VideoCameraAiIcon}
            value={meetingUrl}
            onChange={setMeetingUrl}
            placeholder="https://meet.google.com/..."
            type="url"
          />

          {!candidateId && (
            <div className="space-y-1.5">
              <label
                htmlFor="event-participant"
                className="text-xs font-medium text-muted-foreground"
              >
                Participante
              </label>
              <div className="relative">
                <Input
                  id="event-participant"
                  placeholder="Buscar por nombre..."
                  value={candidateSearch}
                  onChange={(e) => {
                    const v = e.target.value
                    setCandidateSearch(v)
                    if (!candidateId && v.trim()) setShowCandidateDropdown(true)
                  }}
                  onFocus={() => {
                    if (candidateResults?.data && candidateResults.data.length > 0) {
                      setShowCandidateDropdown(true)
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowCandidateDropdown(false), 200)}
                />
                {showCandidateDropdown &&
                  candidateResults?.data &&
                  candidateResults.data.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-border/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {candidateResults.data.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            selectedCandidateId === user.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setSelectedCandidateId(user.id)
                            setCandidateSearch(user.name ?? "")
                            setShowCandidateDropdown(false)
                          }}
                        >
                          {user.name}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              {selectedCandidateId && candidateSearch && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Seleccionado: {candidateSearch}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidateId(undefined)
                      setCandidateSearch("")
                    }}
                    className="text-destructive hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          )}

          <EventFormError error={eventError} />

          <EventFormFooter
            isEditMode={isEditMode}
            isLoading={isLoading}
            isValid={isValid}
            onCancel={handleClose}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </form>
      </SheetContent>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
      />
    </Sheet>
  )
}
