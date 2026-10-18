"use client"

import { Location05Icon, VideoCameraAiIcon } from "@hugeicons/core-free-icons"
import { Result } from "better-result"
import { useState, useTransition } from "react"
import { Sheet, SheetContent } from "@/components/animate-ui/components/radix/sheet"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApplicationDetail } from "@/lib/api/use-applications"
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "@/lib/api/use-events"
import { useOrganizationMembers } from "@/lib/api/use-organization-members"
import { usePipelineStageRubric } from "@/lib/api/use-pipeline-stages"
import { useProfessionalUsers } from "@/lib/api/use-talent"
import { DEFAULT_EVENT_TIME_ZONE, eventWallTime, organizerInstant } from "@/lib/event-time"
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

export function EventFormModal(props: EventFormModalProps) {
  if (!props.isOpen) return null
  return (
    <EventFormFields
      key={`${props.editEvent?.id ?? "new"}:${props.editEvent?.updatedAt ?? ""}`}
      {...props}
    />
  )
}

function EventFormFields({
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

  const initialTimeZone = editEvent?.timeZone ?? DEFAULT_EVENT_TIME_ZONE
  const parsedStartDate = editEvent ? eventWallTime(editEvent.startAt, initialTimeZone) : ""
  const parsedEndDate = editEvent?.endAt ? eventWallTime(editEvent.endAt, initialTimeZone) : ""

  const effectiveTitle = editEvent?.title ?? ""
  const effectiveDescription = editEvent?.description ?? ""
  const effectiveType = editEvent?.type ?? lockedType ?? "interview"
  const effectiveStartDate = parsedStartDate ? parsedStartDate.split("T")[0] : ""
  const effectiveStartTime = parsedStartDate ? parsedStartDate.split("T")[1] : ""
  const effectiveEndDate = parsedEndDate ? parsedEndDate.split("T")[0] : ""
  const effectiveEndTime = parsedEndDate ? parsedEndDate.split("T")[1] : ""
  const effectiveLocation = editEvent?.location ?? ""
  const effectiveMeetingUrl = editEvent?.meetingUrl ?? ""

  const [timeZone, setTimeZone] = useState(initialTimeZone)
  const [timeError, setTimeError] = useState<Error | null>(null)
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
  const organizationMembers = useOrganizationMembers(organizationId)
  const application = useApplicationDetail(applicationId)
  const rubric = usePipelineStageRubric(application.data?.pipelineStageId ?? "")
  const generalRole = {
    id: "00000000-0000-4000-8000-000000000001",
    label: "General",
  }
  const interviewerRoles = rubric.data?.roles ?? [generalRole]
  const [selectedInterviewerRoles, setSelectedInterviewerRoles] = useState<Record<string, string>>(
    {}
  )
  const selectedInterviewerIds = Object.keys(selectedInterviewerRoles)

  const [isPending, startTransition] = useTransition()
  const isLoading =
    isPending || createEvent.isPending || updateEvent.isPending || deleteEvent.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !startDate || !startTime) return

    setTimeError(null)
    const originalStart = timeZone === initialTimeZone ? editEvent?.startAt : undefined
    const originalEnd = timeZone === initialTimeZone ? editEvent?.endAt : undefined
    const start = organizerInstant(`${startDate}T${startTime}`, timeZone, originalStart)
    const end =
      endDate && endTime
        ? organizerInstant(`${endDate}T${endTime}`, timeZone, originalEnd)
        : Result.ok(undefined)
    if (start.isErr()) {
      setTimeError(start.error)
      return
    }
    if (end.isErr()) {
      setTimeError(end.error)
      return
    }
    if (Boolean(endDate) !== Boolean(endTime)) {
      setTimeError(new Error("Completa la fecha y hora de fin."))
      return
    }
    const startAtISO = start.value
    const endAtISO = end.value
    if (endAtISO && Date.parse(endAtISO) <= Date.parse(startAtISO)) {
      setTimeError(new Error("La hora de fin debe ser posterior al inicio."))
      return
    }

    startTransition(async () => {
      const saved = await Result.tryPromise(async () => {
        if (isEditMode && editEvent) {
          const result = await updateEvent.mutateAsync({
            id: editEvent.id,
            input: {
              title: title.trim(),
              description: description.trim() || undefined,
              type,
              startAt: startAtISO,
              timeZone,
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
            timeZone,
            endAt: endAtISO,
            location: location.trim() || undefined,
            meetingUrl: meetingUrl.trim() || undefined,
            organizerId,
            ...(organizationId && { organizationId }),
            ...(selectedCandidateId && { candidateId: selectedCandidateId }),
            ...(applicationId && { applicationId }),
            ...(type === "interview" &&
              selectedInterviewerIds.length > 0 && {
                interviewerAssignments: selectedInterviewerIds.map((userId) => ({
                  userId,
                  roleId: selectedInterviewerRoles[userId],
                })),
              }),
          })
          onSuccess?.(result.id)
        }
      })
      if (saved.isOk()) handleClose()
    })
  }

  const handleDelete = async () => {
    if (!editEvent) return
    setShowDeleteConfirm(false)

    const deleted = await Result.tryPromise(() => deleteEvent.mutateAsync(editEvent.id))
    if (deleted.isOk()) {
      onDelete?.(editEvent.id)
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
    setSelectedCandidateId(candidateId)
    setSelectedInterviewerRoles({})
    setCandidateSearch("")
    setShowCandidateDropdown(false)
    onClose()
  }

  const handleTypeChange = (nextType: EventType) => {
    setType(nextType)
    if (nextType !== "interview") setSelectedInterviewerRoles({})
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
            <EventTypeSelect value={type} onChange={handleTypeChange} EVENT_TYPES={EVENT_TYPES} />
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

          <FormField
            id="event-time-zone"
            label="Zona horaria del evento (IANA)"
            value={timeZone}
            onChange={setTimeZone}
            placeholder="America/Santiago"
            required
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
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                            setSelectedInterviewerRoles((current) =>
                              Object.fromEntries(
                                Object.entries(current).filter(([userId]) => userId !== user.id)
                              )
                            )
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

          {!isEditMode && type === "interview" && organizationId && (
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-muted-foreground">Entrevistadores</legend>
              {organizationMembers.isLoading && (
                <p className="text-xs text-muted-foreground" role="status">
                  Cargando equipo...
                </p>
              )}
              {organizationMembers.isError && (
                <p className="text-xs text-destructive" role="alert">
                  No se pudo cargar el equipo.
                </p>
              )}
              {organizationMembers.data
                ?.filter(
                  (member) =>
                    (member.role === "admin" || member.role === "recruiter") &&
                    member.userId !== organizerId &&
                    member.userId !== selectedCandidateId
                )
                .map((member) => {
                  const memberName = member.user?.name ?? member.user?.email ?? "Miembro"
                  const selectedRoleId = selectedInterviewerRoles[member.userId]
                  return (
                    <div
                      key={member.userId}
                      className="space-y-2 rounded-md border border-border/40 px-3 py-2"
                    >
                      <label
                        htmlFor={`event-interviewer-${member.userId}`}
                        className="flex min-h-8 items-center gap-2 text-sm"
                      >
                        <input
                          id={`event-interviewer-${member.userId}`}
                          type="checkbox"
                          checked={selectedRoleId !== undefined}
                          onChange={(event) =>
                            setSelectedInterviewerRoles((current) => {
                              if (!event.target.checked) {
                                return Object.fromEntries(
                                  Object.entries(current).filter(
                                    ([userId]) => userId !== member.userId
                                  )
                                )
                              }
                              return { ...current, [member.userId]: generalRole.id }
                            })
                          }
                          className="accent-primary"
                        />
                        <span>{memberName}</span>
                      </label>
                      {selectedRoleId !== undefined && (
                        <Select
                          value={selectedRoleId}
                          onValueChange={(value) =>
                            setSelectedInterviewerRoles((current) => ({
                              ...current,
                              [member.userId]: value,
                            }))
                          }
                        >
                          <SelectTrigger
                            className="h-8 w-full bg-background text-xs"
                            aria-label={`Función de ${memberName}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {interviewerRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )
                })}
              {!organizationMembers.isLoading &&
                !organizationMembers.isError &&
                (organizationMembers.data?.filter(
                  (member) =>
                    (member.role === "admin" || member.role === "recruiter") &&
                    member.userId !== organizerId &&
                    member.userId !== selectedCandidateId
                ).length ?? 0) === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No hay otros reclutadores en el equipo.
                  </p>
                )}
            </fieldset>
          )}

          <EventFormError error={timeError ?? eventError} />

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
