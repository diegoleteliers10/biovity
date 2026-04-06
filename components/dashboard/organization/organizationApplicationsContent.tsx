"use client"

import { File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import type { Application } from "@/lib/api/applications"
import { formatJobLocation } from "@/lib/api/jobs"
import {
  applicationsKeys,
  useApplicationsByJob,
  useUpdateApplicationStatusMutation,
} from "@/lib/api/use-applications"
import { useJobs } from "@/lib/api/use-jobs"
import { authClient } from "@/lib/auth-client"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import { cn, formatDateChilean } from "@/lib/utils"
import { ApplicationsKanban } from "./ApplicationsKanban"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import type { EventType } from "@/lib/types/events"

function applicationToApplicant(app: Application): Applicant {
  return {
    id: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidate?.name ?? "Sin nombre",
    position: app.candidate?.profession ?? app.job?.title ?? "—",
    dateApplied: app.createdAt ? formatDateChilean(app.createdAt, "d MMM yyyy") : "—",
    stage: app.status as ApplicationStage,
  }
}

export function OrganizationApplicationsContent() {
  const queryClient = useQueryClient()
  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const organizationId = (session?.user as { organizationId?: string })?.organizationId
  const recruiterId = (session?.user as { id?: string })?.id

  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useJobs(organizationId)
  const jobList = jobs ?? []
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const { data: applications, isLoading: appsLoading } = useApplicationsByJob(
    selectedJobId ?? undefined
  )
  const updateStatusMutation = useUpdateApplicationStatusMutation(selectedJobId ?? "")

  // Modal de evento
  const [eventModal, setEventModal] = useState<{
    isOpen: boolean
    applicant: Applicant | null
    lockedType: EventType | null
  }>({ isOpen: false, applicant: null, lockedType: null })

  const selectedJob = useMemo(
    () => jobList.find((j) => j.id === selectedJobId) ?? null,
    [jobList, selectedJobId]
  )

  const applicants = useMemo(() => (applications ?? []).map(applicationToApplicant), [applications])

  const handleStatusChange = useCallback(
    (applicationId: string, newStage: ApplicationStage) => {
      if (!selectedJobId) return
      updateStatusMutation.mutate(
        { id: applicationId, status: newStage },
        {
          onError: () => {
            queryClient.invalidateQueries({
              queryKey: applicationsKeys.byJob(selectedJobId),
            })
          },
        }
      )
    },
    [selectedJobId, updateStatusMutation, queryClient]
  )

  const handleCreateEvent = useCallback(
    (applicant: Applicant, eventType: "interview" | "onboarding") => {
      setEventModal({
        isOpen: true,
        applicant,
        lockedType: eventType,
      })
    },
    []
  )

  const handleEventSuccess = useCallback(
    async (eventId: string) => {
      if (!eventModal.applicant) return
      // Actualizar el estado de la postulación
      const newStage: ApplicationStage = eventModal.lockedType === "interview" ? "entrevista" : "contratado"
      handleStatusChange(eventModal.applicant.id, newStage)
    },
    [eventModal.applicant, eventModal.lockedType, handleStatusChange]
  )

  if (sessionPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-5 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h1 className="text-balance text-[28px] font-bold tracking-wide">Aplicaciones</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Revisa las postulaciones de candidatos a tus ofertas.
          </p>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">
            No tienes una organización asociada. Completa tu perfil para ver aplicaciones.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-balance text-[28px] font-bold tracking-wide">Aplicaciones</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Revisa las postulaciones de candidatos a tus ofertas.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-64 shrink-0 flex-col gap-2 overflow-y-auto rounded-lg border bg-muted/20 p-2">
          <p className="px-2 text-muted-foreground text-xs font-medium">Ofertas</p>
          {jobsLoading ? (
            <div className="flex justify-center py-4">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : jobsError ? (
            <p className="px-2 text-destructive text-sm">{jobsError.message}</p>
          ) : !jobList.length ? (
            <p className="px-2 text-muted-foreground text-sm">No hay ofertas publicadas.</p>
          ) : (
            jobList.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJobId(job.id)}
                className={cn(
                  "flex flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors",
                  selectedJobId === job.id ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
                )}
                aria-pressed={selectedJobId === job.id}
                aria-label={`Ver aplicaciones de ${job.title}`}
              >
                <span className="truncate font-medium text-sm">{job.title}</span>
              </button>
            ))
          )}
        </aside>

        <section className="min-w-0 max-w-dvw flex-1 overflow-hidden rounded-lg border bg-card">
          {selectedJob ? (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b px-4 py-3">
                <h2 className="font-semibold">{selectedJob.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {formatJobLocation(selectedJob.location)} · {applicants.length} postulantes
                </p>
              </div>
              <div className="flex-1 p-4">
                {appsLoading ? (
                  <div className="flex flex-1 items-center justify-center py-12">
                    <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                      <HugeiconsIcon
                        icon={File02Icon}
                        size={44}
                        strokeWidth={1.5}
                        className="h-11 w-11 text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sin postulantes en esta oferta.</p>
                      <p className="text-muted-foreground text-xs">
                        Las aplicaciones aparecerán aquí cuando los candidatos se postulen.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ApplicationsKanban
                  applicants={applicants}
                  onStatusChange={handleStatusChange}
                  onCreateEvent={handleCreateEvent}
                />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <HugeiconsIcon
                  icon={File02Icon}
                  size={44}
                  strokeWidth={1.5}
                  className="h-11 w-11 text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Selecciona una oferta</p>
                <p className="text-muted-foreground text-xs">
                  Elige una oferta de la lista para ver y gestionar las postulaciones en el tablero.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Event Form Modal */}
      {eventModal.applicant && recruiterId && (
        <EventFormModal
          isOpen={eventModal.isOpen}
          onClose={() => setEventModal({ isOpen: false, applicant: null, lockedType: null })}
          organizerId={recruiterId}
          candidateId={eventModal.applicant.candidateId}
          applicationId={eventModal.applicant.id}
          lockedType={eventModal.lockedType ?? undefined}
          onSuccess={handleEventSuccess}
        />
      )}
    </div>
  )
}
