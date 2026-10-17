"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchJson } from "@/lib/result"
import { formatFechaRelativa } from "@/lib/utils"

type QueueType =
  | "all"
  | "expired_job"
  | "application_follow_up"
  | "organization_without_active_jobs"
  | "organization_onboarding"
  | "offer_response_email"
  | "application_status_notification"
  | "application_created_notification"
  | "event_change_notification"
  | "event_lifecycle_notification"
  | "message_notification"
  | "interview_reminder_notification"
  | "system_broadcast_notification"
  | "saved_search_alert"
  | "saved_search_match"
  | "ai_explanation"
type AssignmentFilter = "all" | "assigned" | "unassigned"
type AssignmentAction = "claim" | "schedule_follow_up" | "release"
type AssignmentResult = {
  status:
    | "claimed"
    | "already_assigned"
    | "released"
    | "assigned_elsewhere"
    | "not_assigned"
    | "not_assigned_to_you"
    | "case_closed"
    | "follow_up_scheduled"
    | "invalid_follow_up"
  assignedAt?: string
}
type QueueItem = {
  id: string
  kind:
    | "expired_job"
    | "application_follow_up"
    | "organization_without_active_jobs"
    | "organization_onboarding"
    | "offer_response_email"
    | "application_status_notification"
    | "application_created_notification"
    | "event_change_notification"
    | "event_lifecycle_notification"
    | "message_notification"
    | "interview_reminder_notification"
    | "system_broadcast_notification"
    | "saved_search_alert"
    | "saved_search_match"
    | "ai_explanation"
  reason:
    | "expired_job"
    | "missing_action"
    | "overdue_action"
    | "no_active_jobs"
    | "incomplete_onboarding"
    | "offer_response_email_dead"
    | "application_status_notification_dead"
    | "application_created_notification_dead"
    | "event_change_notification_dead"
    | "event_lifecycle_notification_dead"
    | "message_notification_dead"
    | "interview_reminder_notification_dead"
    | "system_broadcast_notification_dead"
    | "saved_search_alert_dead"
    | "saved_search_match_dead"
    | "ai_explanation_dead"
  title: string
  organizationId: string | null
  organizationName: string | null
  candidateId: string | null
  candidateName: string | null
  applicationId: string | null
  status: string | null
  statusLabel: string | null
  attemptCount: number | null
  stageName: string | null
  nextAction: string | null
  targetDate: string | null
  expiresAt: string | null
  createdAt: string
  onboardingSteps: {
    corporateEmailVerified: boolean
    profileComplete: boolean
    legalReviewApproved: boolean
    firstJobCreated: boolean
  } | null
  missingProfileFields: string[]
  assignedAdminId: string | null
  assignedAdminName: string | null
  assignedAdminEmail: string | null
  assignedAt: string | null
  isAssignedToMe: boolean
  assignmentActivityAction: "claimed" | "released" | "follow_up_scheduled" | null
  assignmentActivityEmail: string | null
  assignmentActivityAt: string | null
}
type QueuePage = {
  data: QueueItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const PAGE_SIZE = 20
const queueLabels: Record<QueueType, string> = {
  all: "Todos",
  expired_job: "Vacantes vencidas",
  application_follow_up: "Postulaciones",
  organization_without_active_jobs: "Sin vacantes activas",
  organization_onboarding: "Activación de empresas",
  offer_response_email: "Avisos de oferta fallidos",
  application_status_notification: "Avisos de postulaciones fallidos",
  application_created_notification: "Avisos de nuevas postulaciones fallidos",
  event_change_notification: "Avisos de entrevistas fallidos",
  event_lifecycle_notification: "Avisos de eventos fallidos",
  message_notification: "Avisos de mensajes fallidos",
  interview_reminder_notification: "Recordatorios de entrevista fallidos",
  system_broadcast_notification: "Avisos administrativos fallidos",
  saved_search_alert: "Alertas de búsqueda fallidas",
  saved_search_match: "Matching de perfiles fallido",
  ai_explanation: "Explicaciones de IA fallidas",
}
type EmailRetryResult = { status: "requeued" | "not_retryable" }
type StatusNotificationRetryResult = { status: "requeued" | "not_retryable" }
type ApplicationCreatedNotificationRetryResult = {
  status: "requeued" | "not_retryable"
}
type EventChangeNotificationRetryResult = {
  status: "requeued" | "not_retryable"
}
type EventLifecycleNotificationRetryResult = {
  status: "requeued" | "not_retryable"
}
type MessageNotificationRetryResult = { status: "requeued" | "not_retryable" }
type InterviewReminderNotificationRetryResult = {
  status: "requeued" | "not_retryable"
}
type SystemBroadcastNotificationRetryResult = {
  status: "requeued" | "not_retryable"
}
type SavedSearchRetryResult = { status: "requeued" | "not_retryable" }

function OnboardingAssignmentControls({
  item,
  disabled,
  onSave,
  onRelease,
}: {
  item: QueueItem
  disabled: boolean
  onSave: (input: {
    action: "claim" | "schedule_follow_up"
    nextAction: string
    targetDate: string
  }) => void
  onRelease: () => void
}) {
  const [nextAction, setNextAction] = useState(item.nextAction ?? "")
  const [targetDate, setTargetDate] = useState(item.targetDate ?? "")
  const canSave = nextAction.trim().length > 0 && targetDate.length > 0
  const actionInputId = `onboarding-action-${item.organizationId}`
  const dateInputId = `onboarding-date-${item.organizationId}`

  return (
    <div className="space-y-2">
      {(item.assignedAdminName || item.assignedAdminEmail) && (
        <p className="text-xs text-muted-foreground">
          {item.assignedAdminName || item.assignedAdminEmail}
        </p>
      )}
      {item.assignedAt && (
        <p className="text-xs text-muted-foreground">
          Tomado {formatFechaRelativa(item.assignedAt)}
        </p>
      )}
      {item.assignmentActivityAt && (
        <p className="text-xs text-muted-foreground">
          {item.assignmentActivityAction === "claimed"
            ? "Tomó"
            : item.assignmentActivityAction === "released"
              ? "Liberó"
              : "Actualizó seguimiento"}{" "}
          {item.assignmentActivityEmail} · {formatFechaRelativa(item.assignmentActivityAt)}
        </p>
      )}
      {item.assignedAdminId && !item.isAssignedToMe ? (
        <span className="text-xs text-muted-foreground">Asignado</span>
      ) : (
        <>
          <label htmlFor={actionInputId} className="block text-xs text-muted-foreground">
            Próxima acción
            <Input
              id={actionInputId}
              value={nextAction}
              maxLength={160}
              onChange={(event) => setNextAction(event.target.value)}
              className="mt-1 h-9"
            />
          </label>
          <label htmlFor={dateInputId} className="block text-xs text-muted-foreground">
            Fecha objetivo
            <Input
              id={dateInputId}
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="mt-1 h-9"
            />
          </label>
          <Button
            size="sm"
            disabled={disabled || !canSave}
            onClick={() =>
              onSave({
                action: item.isAssignedToMe ? "schedule_follow_up" : "claim",
                nextAction: nextAction.trim(),
                targetDate,
              })
            }
          >
            {item.isAssignedToMe ? "Guardar seguimiento" : "Tomar caso"}
          </Button>
          {item.isAssignedToMe && (
            <Button variant="outline" size="sm" disabled={disabled} onClick={onRelease}>
              Liberar caso
            </Button>
          )}
        </>
      )}
    </div>
  )
}

const onboardingStepLabels = [
  {
    key: "corporateEmailVerified",
    label: "Correo confirmado y dominio coincidente",
  },
  { key: "profileComplete", label: "Perfil de empresa completo" },
  { key: "legalReviewApproved", label: "Revisión legal aprobada" },
  { key: "firstJobCreated", label: "Primera vacante creada" },
] satisfies {
  key: keyof NonNullable<QueueItem["onboardingSteps"]>
  label: string
}[]

const profileFieldLabels: Record<string, string> = {
  name: "Nombre",
  website: "Sitio web",
  description: "Descripción",
  industry: "Industria",
  size: "Tamaño",
  city: "Ciudad",
  country: "País",
}

export const getOnboardingGaps = (
  item: Pick<QueueItem, "onboardingSteps" | "missingProfileFields">
) => [
  ...onboardingStepLabels
    .filter(({ key }) => !item.onboardingSteps?.[key])
    .map(({ label }) => label),
  ...item.missingProfileFields.map((field) => profileFieldLabels[field] ?? field),
]

export const buildOperationsQueueUrl = (input: {
  type: QueueType
  page: number
  limit: number
  search: string
  assignment?: AssignmentFilter
}) => {
  const query = new URLSearchParams({
    type: input.type,
    page: String(input.page),
    limit: String(input.limit),
  })
  if (input.search.trim()) query.set("search", input.search.trim())
  if (input.assignment && input.assignment !== "all") query.set("assignment", input.assignment)
  return `/api/admin/operations-queue?${query}`
}

export const buildOnboardingAssignmentUrl = (organizationId: string) =>
  `/api/admin/operations-queue/${encodeURIComponent(organizationId)}/assignment`

export const buildAdminTaskAssignmentUrl = (
  kind: "expired_job" | "organization_without_active_jobs",
  sourceId: string
) => `/api/admin/operations-queue/${kind}/${encodeURIComponent(sourceId)}/assignment`

const buildAssignmentUrl = (
  kind: "organization_onboarding" | "expired_job" | "organization_without_active_jobs",
  sourceId: string
) => {
  if (kind === "organization_onboarding") return buildOnboardingAssignmentUrl(sourceId)
  return buildAdminTaskAssignmentUrl(kind, sourceId)
}

const getAssignmentIdentity = (
  item: QueueItem
): {
  kind: "organization_onboarding" | "expired_job" | "organization_without_active_jobs"
  sourceId: string
} | null => {
  if (item.kind === "organization_onboarding") {
    if (!item.organizationId) return null
    return { kind: item.kind, sourceId: item.organizationId }
  }
  if (item.kind === "expired_job" || item.kind === "organization_without_active_jobs") {
    return { kind: item.kind, sourceId: item.id }
  }
  return null
}

export const buildOfferResponseEmailRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/offer-response-email/${encodeURIComponent(intentId)}/retry`

export const buildApplicationStatusNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/application-status-notification/${encodeURIComponent(intentId)}/retry`

export const buildApplicationCreatedNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/application-created-notification/${encodeURIComponent(intentId)}/retry`

export const buildEventChangeNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/event-change-notification/${encodeURIComponent(intentId)}/retry`

export const buildEventLifecycleNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/event-lifecycle-notification/${encodeURIComponent(intentId)}/retry`

export const buildMessageNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/message-notification/${encodeURIComponent(intentId)}/retry`

export const buildInterviewReminderNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/interview-reminder-notification/${encodeURIComponent(intentId)}/retry`

export const buildSystemBroadcastNotificationRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/system-broadcast-notification/${encodeURIComponent(intentId)}/retry`

export const buildSavedSearchAlertRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/saved-search-alert/${encodeURIComponent(intentId)}/retry`

export const buildSavedSearchMatchRetryUrl = (intentId: string) =>
  `/api/admin/operations-queue/saved-search-match/${encodeURIComponent(intentId)}/retry`

export const buildAiExplanationRetryUrl = (revisionId: string) =>
  `/api/admin/operations-queue/ai-explanation/${encodeURIComponent(revisionId)}/retry`

export function AdminOperationsQueue() {
  const [type, setType] = useState<QueueType>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [assignment, setAssignment] = useState<AssignmentFilter>("all")
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ["admin-operations-queue", type, search, page, assignment],
    queryFn: async () => {
      return fetchJson<QueuePage>(
        buildOperationsQueueUrl({
          type,
          page,
          limit: PAGE_SIZE,
          search,
          assignment,
        })
      )
    },
  })
  const assignmentMutation = useMutation({
    mutationFn: (input: {
      kind: "organization_onboarding" | "expired_job" | "organization_without_active_jobs"
      sourceId: string
      action: AssignmentAction
      nextAction?: string
      targetDate?: string
    }) =>
      fetchJson<AssignmentResult>(buildAssignmentUrl(input.kind, input.sourceId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: input.action,
          ...(input.nextAction ? { nextAction: input.nextAction } : {}),
          ...(input.targetDate ? { targetDate: input.targetDate } : {}),
        }),
      }),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const emailRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<EmailRetryResult>(buildOfferResponseEmailRetryUrl(intentId), {
        method: "POST",
      }),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const statusNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<StatusNotificationRetryResult>(
        buildApplicationStatusNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const applicationCreatedNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<ApplicationCreatedNotificationRetryResult>(
        buildApplicationCreatedNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const eventChangeNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<EventChangeNotificationRetryResult>(
        buildEventChangeNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const eventLifecycleNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<EventLifecycleNotificationRetryResult>(
        buildEventLifecycleNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const messageNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<MessageNotificationRetryResult>(buildMessageNotificationRetryUrl(intentId), {
        method: "POST",
      }),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const interviewReminderNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<InterviewReminderNotificationRetryResult>(
        buildInterviewReminderNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const systemBroadcastNotificationRetryMutation = useMutation({
    mutationFn: (intentId: string) =>
      fetchJson<SystemBroadcastNotificationRetryResult>(
        buildSystemBroadcastNotificationRetryUrl(intentId),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({
          queryKey: ["admin-operations-queue"],
        })
      }
    },
  })
  const savedSearchRetryMutation = useMutation({
    mutationFn: (input: { kind: "saved_search_alert" | "saved_search_match"; id: string }) =>
      fetchJson<SavedSearchRetryResult>(
        input.kind === "saved_search_alert"
          ? buildSavedSearchAlertRetryUrl(input.id)
          : buildSavedSearchMatchRetryUrl(input.id),
        { method: "POST" }
      ),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({ queryKey: ["admin-operations-queue"] })
      }
    },
  })
  const aiExplanationRetryMutation = useMutation({
    mutationFn: (revisionId: string) =>
      fetchJson<SavedSearchRetryResult>(buildAiExplanationRetryUrl(revisionId), {
        method: "POST",
      }),
    onSuccess: async (response) => {
      if (response.isOk()) {
        await queryClient.invalidateQueries({ queryKey: ["admin-operations-queue"] })
      }
    },
  })
  const queue = result.data?.isOk() ? result.data.value : undefined
  const error = result.data?.isErr() ? result.data.error.message : undefined
  const assignmentError = assignmentMutation.data?.isErr()
    ? assignmentMutation.data.error.message
    : undefined
  const assignmentStatus = assignmentMutation.data?.isOk()
    ? assignmentMutation.data.value.status
    : undefined
  const emailRetryError = emailRetryMutation.data?.isErr()
    ? emailRetryMutation.data.error.message
    : undefined
  const emailRetryStatus = emailRetryMutation.data?.isOk()
    ? emailRetryMutation.data.value.status
    : undefined
  const statusNotificationRetryError = statusNotificationRetryMutation.data?.isErr()
    ? statusNotificationRetryMutation.data.error.message
    : undefined
  const statusNotificationRetryStatus = statusNotificationRetryMutation.data?.isOk()
    ? statusNotificationRetryMutation.data.value.status
    : undefined
  const applicationCreatedNotificationRetryError =
    applicationCreatedNotificationRetryMutation.data?.isErr()
      ? applicationCreatedNotificationRetryMutation.data.error.message
      : undefined
  const applicationCreatedNotificationRetryStatus =
    applicationCreatedNotificationRetryMutation.data?.isOk()
      ? applicationCreatedNotificationRetryMutation.data.value.status
      : undefined
  const eventChangeNotificationRetryError = eventChangeNotificationRetryMutation.data?.isErr()
    ? eventChangeNotificationRetryMutation.data.error.message
    : undefined
  const eventChangeNotificationRetryStatus = eventChangeNotificationRetryMutation.data?.isOk()
    ? eventChangeNotificationRetryMutation.data.value.status
    : undefined
  const eventLifecycleNotificationRetryError = eventLifecycleNotificationRetryMutation.data?.isErr()
    ? eventLifecycleNotificationRetryMutation.data.error.message
    : undefined
  const eventLifecycleNotificationRetryStatus = eventLifecycleNotificationRetryMutation.data?.isOk()
    ? eventLifecycleNotificationRetryMutation.data.value.status
    : undefined
  const messageNotificationRetryError = messageNotificationRetryMutation.data?.isErr()
    ? messageNotificationRetryMutation.data.error.message
    : undefined
  const messageNotificationRetryStatus = messageNotificationRetryMutation.data?.isOk()
    ? messageNotificationRetryMutation.data.value.status
    : undefined
  const interviewReminderNotificationRetryError =
    interviewReminderNotificationRetryMutation.data?.isErr()
      ? interviewReminderNotificationRetryMutation.data.error.message
      : undefined
  const interviewReminderNotificationRetryStatus =
    interviewReminderNotificationRetryMutation.data?.isOk()
      ? interviewReminderNotificationRetryMutation.data.value.status
      : undefined
  const systemBroadcastNotificationRetryError =
    systemBroadcastNotificationRetryMutation.data?.isErr()
      ? systemBroadcastNotificationRetryMutation.data.error.message
      : undefined
  const systemBroadcastNotificationRetryStatus =
    systemBroadcastNotificationRetryMutation.data?.isOk()
      ? systemBroadcastNotificationRetryMutation.data.value.status
      : undefined
  const savedSearchRetryError = savedSearchRetryMutation.data?.isErr()
    ? savedSearchRetryMutation.data.error.message
    : undefined
  const savedSearchRetryStatus = savedSearchRetryMutation.data?.isOk()
    ? savedSearchRetryMutation.data.value.status
    : undefined
  const aiExplanationRetryError = aiExplanationRetryMutation.data?.isErr()
    ? aiExplanationRetryMutation.data.error.message
    : undefined
  const aiExplanationRetryStatus = aiExplanationRetryMutation.data?.isOk()
    ? aiExplanationRetryMutation.data.value.status
    : undefined

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Operaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa seguimientos pendientes y avisos que requieren una acción.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Buscar vacante, organización o candidato"
          aria-label="Buscar operaciones"
          className="h-10 max-w-sm"
        />
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Tipo de tarea</legend>
          {(Object.keys(queueLabels) as QueueType[]).map((item) => (
            <Button
              key={item}
              variant={type === item ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setType(item)
                if (item !== "organization_onboarding") setAssignment("all")
                setPage(1)
              }}
            >
              {queueLabels[item]}
            </Button>
          ))}
        </fieldset>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Asignación admin</span>
          <select
            className="h-10 rounded-lg border border-border/40 bg-background px-3 text-sm text-foreground"
            value={assignment}
            onChange={(event) => {
              const next = event.currentTarget.value
              if (next !== "all" && next !== "assigned" && next !== "unassigned") return
              setAssignment(next)
              setType("all")
              setPage(1)
            }}
          >
            <option value="all">Todos</option>
            <option value="assigned">Asignados</option>
            <option value="unassigned">Sin asignar</option>
          </select>
        </label>
      </div>

      {(assignmentError || assignmentStatus) && (
        <p role={assignmentError ? "alert" : "status"} className="text-sm text-muted-foreground">
          {assignmentError ??
            (assignmentStatus === "claimed"
              ? "Tomaste el caso."
              : assignmentStatus === "already_assigned"
                ? "El caso ya está asignado a tu usuario."
                : assignmentStatus === "released"
                  ? "Liberaste el caso."
                  : assignmentStatus === "assigned_elsewhere"
                    ? "Otro admin tomó el caso. Actualiza la cola."
                    : assignmentStatus === "not_assigned"
                      ? "El caso ya estaba libre."
                      : assignmentStatus === "not_assigned_to_you"
                        ? "Solo quien tomó el caso puede cambiar su seguimiento o liberarlo."
                        : assignmentStatus === "follow_up_scheduled"
                          ? "Actualizaste el seguimiento."
                          : assignmentStatus === "invalid_follow_up"
                            ? "Completa la acción y la fecha objetivo."
                            : "La alerta ya no cumple sus condiciones. Actualicé la cola.")}
        </p>
      )}
      {(emailRetryError || emailRetryStatus) && (
        <p role={emailRetryError ? "alert" : "status"} className="text-sm text-muted-foreground">
          {emailRetryError ??
            (emailRetryStatus === "requeued"
              ? "El aviso volvió a la cola."
              : "El aviso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(statusNotificationRetryError || statusNotificationRetryStatus) && (
        <p
          role={statusNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {statusNotificationRetryError ??
            (statusNotificationRetryStatus === "requeued"
              ? "El aviso volvió a la cola."
              : "El aviso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(applicationCreatedNotificationRetryError || applicationCreatedNotificationRetryStatus) && (
        <p
          role={applicationCreatedNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {applicationCreatedNotificationRetryError ??
            (applicationCreatedNotificationRetryStatus === "requeued"
              ? "Aviso agregado a la cola de reintentos"
              : "El aviso ya no se puede reintentar")}
        </p>
      )}
      {(eventChangeNotificationRetryError || eventChangeNotificationRetryStatus) && (
        <p
          role={eventChangeNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {eventChangeNotificationRetryError ??
            (eventChangeNotificationRetryStatus === "requeued"
              ? "El aviso volvió a la cola."
              : "El aviso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(messageNotificationRetryError || messageNotificationRetryStatus) && (
        <p
          role={messageNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {messageNotificationRetryError ??
            (messageNotificationRetryStatus === "requeued"
              ? "El aviso volvió a la cola."
              : "El aviso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(eventLifecycleNotificationRetryError || eventLifecycleNotificationRetryStatus) && (
        <p
          role={eventLifecycleNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {eventLifecycleNotificationRetryError ??
            (eventLifecycleNotificationRetryStatus === "requeued"
              ? "El aviso volvió a la cola."
              : "El evento o su respuesta ya no admite este aviso. Actualicé la cola.")}
        </p>
      )}
      {(interviewReminderNotificationRetryError || interviewReminderNotificationRetryStatus) && (
        <p
          role={interviewReminderNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {interviewReminderNotificationRetryError ??
            (interviewReminderNotificationRetryStatus === "requeued"
              ? "El recordatorio volvió a la cola."
              : "El recordatorio ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(systemBroadcastNotificationRetryError || systemBroadcastNotificationRetryStatus) && (
        <p
          role={systemBroadcastNotificationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {systemBroadcastNotificationRetryError ??
            (systemBroadcastNotificationRetryStatus === "requeued"
              ? "El aviso administrativo volvió a la cola."
              : "El aviso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(savedSearchRetryError || savedSearchRetryStatus) && (
        <p
          role={savedSearchRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {savedSearchRetryError ??
            (savedSearchRetryStatus === "requeued"
              ? "El proceso volvió a la cola."
              : "El proceso ya no admite reintento. Actualicé la cola.")}
        </p>
      )}
      {(aiExplanationRetryError || aiExplanationRetryStatus) && (
        <p
          role={aiExplanationRetryError ? "alert" : "status"}
          className="text-sm text-muted-foreground"
        >
          {aiExplanationRetryError ??
            (aiExplanationRetryStatus === "requeued"
              ? "La explicación volvió a la cola."
              : "La explicación ya no está disponible para reintento.")}
        </p>
      )}

      {queue && <p className="text-sm text-muted-foreground">{queue.total} tareas</p>}
      <div className="overflow-x-auto rounded-lg border">
        {result.isLoading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="p-8 text-sm text-destructive">{error}</p>
        ) : queue?.data.length ? (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Caso</th>
                <th className="px-4 py-3 font-medium">Organización</th>
                <th className="px-4 py-3 font-medium">Motivo</th>
                <th className="px-4 py-3 font-medium">Fecha objetivo</th>
                <th className="px-4 py-3 font-medium">ID de registro</th>
                <th className="px-4 py-3 font-medium">Responsable</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {queue.data.map((item) => (
                <tr key={`${item.kind}-${item.id}`}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{item.title}</p>
                    {item.candidateName && (
                      <p className="mt-1 text-xs text-muted-foreground">{item.candidateName}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">{item.organizationName || "Sin organización"}</td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary">
                      {item.reason === "incomplete_onboarding"
                        ? "Activación incompleta"
                        : item.reason === "offer_response_email_dead"
                          ? "Aviso de respuesta fallido"
                          : item.reason === "application_status_notification_dead"
                            ? "Aviso de cambio de postulación fallido"
                            : item.reason === "event_change_notification_dead"
                              ? "Aviso de cambio de entrevista fallido"
                              : item.reason === "message_notification_dead"
                                ? "Aviso de mensaje fallido"
                                : item.reason === "interview_reminder_notification_dead"
                                  ? "Recordatorio de entrevista fallido"
                                  : item.reason === "system_broadcast_notification_dead"
                                    ? "Aviso administrativo fallido"
                                    : item.reason === "ai_explanation_dead"
                                      ? "Explicación de IA fallida"
                                      : item.reason === "expired_job"
                                        ? "Vacante vencida"
                                        : item.reason === "no_active_jobs"
                                          ? "Sin vacantes activas"
                                          : item.reason === "missing_action"
                                            ? "Sin próxima acción"
                                            : "Fecha de seguimiento vencida"}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.kind === "organization_onboarding"
                        ? "Pendientes"
                        : item.kind === "application_status_notification"
                          ? `Estado comunicado: ${item.statusLabel ?? "Sin etiqueta"} · Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                          : item.kind === "application_created_notification"
                            ? `Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                            : item.kind === "event_change_notification"
                              ? `${item.statusLabel === "cancelled" ? "Cancelación" : "Cambio"} · Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                              : item.kind === "event_lifecycle_notification"
                                ? `${item.statusLabel === "event_rsvp" ? "Respuesta a invitación" : "Evento agendado"} · Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                                : item.kind === "message_notification"
                                  ? `Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                                  : item.kind === "interview_reminder_notification"
                                    ? `Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                                    : item.kind === "system_broadcast_notification"
                                      ? `Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                                      : item.kind === "saved_search_alert" ||
                                          item.kind === "saved_search_match"
                                        ? `Intento ${item.attemptCount ?? 0} · Error: ${item.nextAction ?? "sin código"}`
                                        : item.kind === "ai_explanation"
                                          ? `Error: ${item.nextAction ?? "sin código"}`
                                          : item.kind === "offer_response_email"
                                            ? item.nextAction
                                              ? `Último error: ${item.nextAction}`
                                              : "Superó el límite automático de 8 intentos"
                                            : item.nextAction ||
                                              item.stageName ||
                                              (item.expiresAt
                                                ? `Venció ${formatFechaRelativa(item.expiresAt)}`
                                                : "Sin próxima acción")}
                    </p>
                    {item.kind === "organization_onboarding" && (
                      <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                        {getOnboardingGaps(item).map((gap) => (
                          <li key={gap}>{gap}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {item.targetDate || item.expiresAt || "Sin fecha"}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                    <span className="mr-2 font-sans">
                      {item.kind === "expired_job"
                        ? "Oferta"
                        : item.kind === "offer_response_email"
                          ? "Intento"
                          : item.kind === "application_status_notification"
                            ? "Aviso de estado"
                            : item.kind === "application_created_notification"
                              ? "Nueva postulación"
                              : item.kind === "event_change_notification"
                                ? "Aviso de entrevista"
                                : item.kind === "event_lifecycle_notification"
                                  ? "Aviso de evento"
                                  : item.kind === "message_notification"
                                    ? "Aviso de mensaje"
                                    : item.kind === "interview_reminder_notification"
                                      ? "Recordatorio de entrevista"
                                      : item.kind === "system_broadcast_notification"
                                        ? "Aviso administrativo"
                                        : item.kind === "saved_search_alert"
                                          ? "Alerta de búsqueda"
                                          : item.kind === "saved_search_match"
                                            ? "Cambio de perfil"
                                            : item.kind === "ai_explanation"
                                              ? "Explicación IA"
                                              : item.kind === "organization_without_active_jobs" ||
                                                  item.kind === "organization_onboarding"
                                                ? "Organización"
                                                : "Postulación"}
                    </span>
                    {item.applicationId ?? item.id}
                  </td>
                  <td className="px-4 py-4">
                    {item.kind === "organization_onboarding" ||
                    item.kind === "expired_job" ||
                    item.kind === "organization_without_active_jobs" ? (
                      <OnboardingAssignmentControls
                        item={item}
                        disabled={assignmentMutation.isPending}
                        onSave={(input) => {
                          const identity = getAssignmentIdentity(item)
                          if (identity)
                            assignmentMutation.mutate({
                              ...identity,
                              ...input,
                            })
                        }}
                        onRelease={() => {
                          const identity = getAssignmentIdentity(item)
                          if (identity)
                            assignmentMutation.mutate({
                              ...identity,
                              action: "release",
                            })
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {item.kind === "offer_response_email" ? (
                      <Button
                        size="sm"
                        disabled={emailRetryMutation.isPending}
                        onClick={() => emailRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "application_status_notification" ? (
                      <Button
                        size="sm"
                        disabled={statusNotificationRetryMutation.isPending}
                        onClick={() => statusNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "application_created_notification" ? (
                      <Button
                        size="sm"
                        disabled={applicationCreatedNotificationRetryMutation.isPending}
                        onClick={() => applicationCreatedNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "event_change_notification" ? (
                      <Button
                        size="sm"
                        disabled={eventChangeNotificationRetryMutation.isPending}
                        onClick={() => eventChangeNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "event_lifecycle_notification" ? (
                      <Button
                        size="sm"
                        disabled={eventLifecycleNotificationRetryMutation.isPending}
                        onClick={() => eventLifecycleNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "message_notification" ? (
                      <Button
                        size="sm"
                        disabled={messageNotificationRetryMutation.isPending}
                        onClick={() => messageNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "interview_reminder_notification" ? (
                      <Button
                        size="sm"
                        disabled={interviewReminderNotificationRetryMutation.isPending}
                        onClick={() => interviewReminderNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "system_broadcast_notification" ? (
                      <Button
                        size="sm"
                        disabled={systemBroadcastNotificationRetryMutation.isPending}
                        onClick={() => systemBroadcastNotificationRetryMutation.mutate(item.id)}
                      >
                        Reintentar aviso
                      </Button>
                    ) : item.kind === "saved_search_alert" || item.kind === "saved_search_match" ? (
                      <Button
                        size="sm"
                        disabled={savedSearchRetryMutation.isPending}
                        onClick={() =>
                          savedSearchRetryMutation.mutate({
                            kind:
                              item.kind === "saved_search_alert"
                                ? "saved_search_alert"
                                : "saved_search_match",
                            id: item.id,
                          })
                        }
                      >
                        Reintentar proceso
                      </Button>
                    ) : item.kind === "ai_explanation" ? (
                      <Button
                        size="sm"
                        disabled={aiExplanationRetryMutation.isPending}
                        onClick={() => aiExplanationRetryMutation.mutate(item.id)}
                      >
                        Reintentar explicación
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No hay tareas para estos filtros.
          </p>
        )}
      </div>

      {queue && queue.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {queue.page} de {queue.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= queue.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
