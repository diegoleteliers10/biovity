"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { AIScoreModal } from "@/components/ai/AIScoreModal"
import { AnalyzeButton } from "@/components/ai/AnalyzeButton"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useEvaluationBatch } from "@/hooks/use-evaluations"
import { useKanbanAIScoring } from "@/hooks/useKanbanAIScoring"
import type { JobOfferContext } from "@/lib/ai/types"
import type { Application } from "@/lib/api/applications"
import { getOrganizationVerification } from "@/lib/api/organizations"
import { useLogActivityMutation } from "@/lib/api/use-activity-logs"
import {
  useApplicationsByJob,
  useUpdateApplicationPipelineStageMutation,
} from "@/lib/api/use-applications"
import { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import { useJobs } from "@/lib/api/use-jobs"
import { useOrganizationMembers } from "@/lib/api/use-organization-members"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import { usePipelineStages } from "@/lib/api/use-pipeline-stages"
import { latestEvaluationByApplication } from "@/lib/evaluations"
import { isHiringPlanOverdue } from "@/lib/hiring-plan"
import { resolveApplicantPipelineStageId } from "@/lib/pipeline-stage-board"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import type { EventType } from "@/lib/types/events"
import { formatDateChilean } from "@/lib/utils"
import { useDashboardSession } from "../DashboardSessionContext"
import { dashboardRaisedCardClass } from "../shared/surface-classes"
import { ApplicationsKanban } from "./ApplicationsKanban"
import { JobSelector, NoApplicantsEmptyState, NoJobSelectedState } from "./applicationsUtils"
import { OfferLetterEditorDialog } from "./offer-letter/OfferLetterEditorDialog"
import { PipelineToolbar } from "./PipelineToolbar"

function applicationToApplicant(app: Application, memberNames: Map<string, string>): Applicant {
  return {
    id: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidate?.name ?? "Sin nombre",
    position: app.candidate?.profession ?? app.job?.title ?? "—",
    dateApplied: app.createdAt ? formatDateChilean(app.createdAt, "d MMM yyyy") : "—",
    stage: app.status as ApplicationStage,
    pipelineStageId: app.pipelineStageId,
    assigneeId: app.assigneeId,
    assigneeName:
      app.assigneeName ?? (app.assigneeId ? (memberNames.get(app.assigneeId) ?? null) : null),
    nextAction: app.nextAction,
    targetDate: app.targetDate,
    stageChangedAt: app.stageChangedAt,
    avatar: app.candidate?.avatar,
    candidateEducation: app.candidate?.education ?? undefined,
    candidateSkills: app.candidate?.skills ?? undefined,
    candidateYearsOfExperience: app.candidate?.yearsOfExperience ?? undefined,
    candidateBio: app.candidate?.bio ?? undefined,
  }
}

export function OrganizationApplicationsContent() {
  const router = useRouter()
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined
  const recruiterId = session?.user?.id ?? undefined
  const verificationQuery = useQuery({
    queryKey: ["organization-verification", organizationId],
    queryFn: () => getOrganizationVerification(organizationId ?? ""),
    enabled: Boolean(organizationId),
  })
  const canManageHiring =
    verificationQuery.data?.isOk() && verificationQuery.data.value.status === "verified"

  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useJobs(organizationId)
  const jobList = jobs ?? []
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [offerDialogApp, setOfferDialogApp] = useState<Applicant | null>(null)
  const { data: organization } = useOrganization(organizationId)
  const { data: organizationMembers = [] } = useOrganizationMembers(organizationId)

  const { data: applications, isLoading: appsLoading } = useApplicationsByJob(
    selectedJobId ?? undefined
  )
  const pipelineStagesQuery = usePipelineStages(selectedJobId ?? undefined)
  const pipelineStages = pipelineStagesQuery.data ?? []
  const updatePipelineStageMutation = useUpdateApplicationPipelineStageMutation(selectedJobId ?? "")
  const logActivityMutation = useLogActivityMutation(organizationId ?? "")

  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [overdueOnly, setOverdueOnly] = useState(false)
  const [evaluationFilter, setEvaluationFilter] = useState("all")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleSelectJob = useCallback((jobId: string | null) => {
    setSelectedJobId(jobId)
    setStageFilter("all")
    setAssigneeFilter("all")
    setOverdueOnly(false)
    setSelectedIds(new Set())
  }, [])

  const [eventModal, setEventModal] = useState<{
    isOpen: boolean
    applicant: Applicant | null
    lockedType: EventType | null
  }>({ isOpen: false, applicant: null, lockedType: null })

  const selectedJob = useMemo(
    () => jobList.find((j) => j.id === selectedJobId) ?? null,
    [jobList, selectedJobId]
  )

  const memberNames = useMemo(
    () =>
      new Map(organizationMembers.map((member) => [member.userId, member.user?.name ?? "Miembro"])),
    [organizationMembers]
  )
  const applicants = useMemo(
    () =>
      (applications ?? []).map((application) => applicationToApplicant(application, memberNames)),
    [applications, memberNames]
  )

  const evaluationQuery = useEvaluationBatch(
    applicants.map((applicant) => applicant.id),
    canManageHiring
  )
  const evaluationsByApplication = useMemo(() => {
    const grouped = new Map<string, NonNullable<typeof evaluationQuery.data>>()
    for (const evaluation of evaluationQuery.data ?? []) {
      const items = grouped.get(evaluation.application_id) ?? []
      grouped.set(evaluation.application_id, [...items, evaluation])
    }
    return grouped
  }, [evaluationQuery.data])
  const getEvaluations = useCallback(
    (applicationId: string) =>
      !canManageHiring || evaluationQuery.isLoading || evaluationQuery.isError
        ? null
        : (evaluationsByApplication.get(applicationId) ?? []),
    [canManageHiring, evaluationQuery.isLoading, evaluationQuery.isError, evaluationsByApplication]
  )

  const filteredApplicants = useMemo(() => {
    let result = applicants
    if (stageFilter !== "all") {
      result = result.filter(
        (applicant) => resolveApplicantPipelineStageId(applicant, pipelineStages) === stageFilter
      )
    }
    if (assigneeFilter !== "all") {
      result = result.filter((applicant) =>
        assigneeFilter === "unassigned"
          ? !applicant.assigneeId
          : applicant.assigneeId === assigneeFilter
      )
    }
    if (overdueOnly) {
      result = result.filter((applicant) =>
        isHiringPlanOverdue(applicant.targetDate, applicant.stage)
      )
    }
    if (evaluationFilter !== "all" && canManageHiring) {
      result =
        evaluationQuery.isLoading || evaluationQuery.isError
          ? []
          : result.filter((applicant) => {
              const evaluations = evaluationsByApplication.get(applicant.id) ?? []
              const latest = latestEvaluationByApplication(evaluations).get(applicant.id)
              return evaluationFilter === "unevaluated"
                ? !latest
                : latest?.rating === evaluationFilter
            })
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.candidateName.toLowerCase().includes(q) ||
          a.nextAction?.toLowerCase().includes(q) ||
          a.assigneeName?.toLowerCase().includes(q)
      )
    }
    return result
  }, [
    applicants,
    pipelineStages,
    stageFilter,
    assigneeFilter,
    overdueOnly,
    searchQuery,
    evaluationFilter,
    canManageHiring,
    evaluationsByApplication,
    evaluationQuery.isLoading,
    evaluationQuery.isError,
  ])

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setSelectionMode(false)
  }, [])

  const {
    analyze,
    getScore,
    isAnalyzing,
    analyzedAt,
    error: scoreError,
  } = useKanbanAIScoring(selectedJobId)

  const createChatMutation = useCreateOrFindChatMutation(recruiterId, organizationId)

  const handleViewProfile = useCallback(
    (candidateId: string) => {
      router.push(`/dashboard/talent?view=${candidateId}`)
    },
    [router]
  )

  const handleViewDetail = useCallback(
    (applicationId: string) => {
      if (!selectedJobId) return
      router.push(`/dashboard/offers/${selectedJobId}/applications/${applicationId}`)
    },
    [router, selectedJobId]
  )

  const handleSendMessage = useCallback(
    (candidateId: string) => {
      createChatMutation.mutate(candidateId, {
        onSuccess: (chatId) => {
          router.push(`/dashboard/messages?chat=${chatId}`)
        },
      })
    },
    [createChatMutation, router]
  )
  const jobOfferContext = useMemo<JobOfferContext | null>(() => {
    if (!selectedJob) return null

    return {
      title: selectedJob.title,
      description: selectedJob.description,
      requiredSkills: selectedJob.requiredSkills ?? [],
      minExperience: selectedJob.minExperience ?? 0,
      area: selectedJob.employmentType,
      contractType: selectedJob.employmentType,
      modality: selectedJob.location?.isRemote ? "remoto" : "presencial",
    }
  }, [selectedJob])

  const [scoreModal, setScoreModal] = useState<{
    isOpen: boolean
    applicationId: string | null
    score: CandidateScore | null
  }>({ isOpen: false, applicationId: null, score: null })

  const handleScoreClick = useCallback(
    (applicationId: string) => {
      const entry = getScore(applicationId)
      if (entry) {
        setScoreModal({
          isOpen: true,
          applicationId,
          score: entry.score,
        })
      }
    },
    [getScore]
  )

  const handleStageChange = useCallback(
    async (
      applicationId: string,
      stageId: string,
      rejectionNote?: string,
      rejectionReasonId?: string
    ): Promise<boolean> => {
      if (!selectedJobId) return false
      const result = await Result.tryPromise(() =>
        updatePipelineStageMutation.mutateAsync({
          id: applicationId,
          stageId,
          rejectionNote,
          rejectionReasonId,
        })
      )
      if (result.isErr()) return false

      if (organizationId && recruiterId) {
        const candidateName =
          result.value.candidate?.name ||
          applications?.find((application) => application.id === applicationId)?.candidate?.name ||
          "un candidato"
        const jobTitle = jobList.find((job) => job.id === selectedJobId)?.title || "la oferta"
        const stageName = pipelineStages.find((stage) => stage.id === stageId)?.name ?? "la etapa"
        logActivityMutation.mutate({
          userId: recruiterId,
          action: "candidate.stage_changed",
          description: `Cambió la etapa de ${candidateName} a "${stageName}" en la oferta "${jobTitle}"`,
        })
      }
      return true
    },
    [
      selectedJobId,
      updatePipelineStageMutation,
      organizationId,
      recruiterId,
      applications,
      jobList,
      pipelineStages,
      logActivityMutation.mutate,
    ]
  )

  const handleBulkReject = useCallback(async (rejectionReasonId: string, rejectionNote?: string) => {
    const rejectStage =
      pipelineStages.find((stage) => !stage.isArchived && stage.systemKey === "rechazado") ??
      pipelineStages.find((stage) => !stage.isArchived && stage.statusProjection === "rechazado")
    if (!rejectStage) {
      toast.error("Esta oferta no tiene una etapa activa de rechazo")
      return
    }
    const results = await Promise.all(
      [...selectedIds].map((id) =>
        handleStageChange(id, rejectStage.id, rejectionNote, rejectionReasonId)
      )
    )
    if (results.some((result) => !result))
      toast.error("No se pudieron mover todas las postulaciones")
    handleClearSelection()
  }, [pipelineStages, selectedIds, handleStageChange, handleClearSelection])

  const handleBulkMessage = useCallback(() => {
    const firstId = selectedIds.values().next().value
    if (!firstId) return
    const applicant = applicants.find((a) => a.id === firstId)
    if (applicant) {
      handleSendMessage(applicant.candidateId)
    }
    if (selectedIds.size > 1) {
      toast.info(
        `Abriendo chat con ${applicant?.candidateName ?? "candidato"}. Los demas quedan pendientes.`
      )
    }
    handleClearSelection()
  }, [selectedIds, applicants, handleSendMessage, handleClearSelection])

  const handleBulkAdvance = useCallback(
    async (targetStageId: string) => {
      const results = await Promise.all(
        [...selectedIds].map((id) => handleStageChange(id, targetStageId))
      )
      if (results.some((result) => !result))
        toast.error("No se pudieron mover todas las postulaciones")
      handleClearSelection()
    },
    [selectedIds, handleStageChange, handleClearSelection]
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
    async (_eventId: string) => {
      if (!eventModal.applicant) return
      const projection = eventModal.lockedType === "interview" ? "entrevista" : "contratado"
      const targetStage =
        pipelineStages.find((stage) => !stage.isArchived && stage.systemKey === projection) ??
        pipelineStages.find((stage) => !stage.isArchived && stage.statusProjection === projection)
      if (targetStage) {
        const moved = await handleStageChange(eventModal.applicant.id, targetStage.id)
        if (!moved) toast.error("El evento se creó, pero no se pudo actualizar la etapa")
      } else toast.error("No hay una etapa activa compatible con este evento")
    },
    [eventModal.applicant, eventModal.lockedType, pipelineStages, handleStageChange]
  )

  if (!organizationId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Aplicaciones
          </h1>
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
    <div className="flex h-full w-full flex-1 flex-col gap-3 p-3 sm:p-4 overflow-hidden min-h-0">
      <div className="flex items-center justify-between lg:hidden shrink-0">
        <MobileMenuButton />
        <ConnectedNotificationBell showAgentTrigger />
      </div>

      <div className="space-y-1 shrink-0">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell showAgentTrigger />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Aplicaciones
          </h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Revisa las postulaciones de candidatos a tus ofertas.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 flex-col lg:flex-row overflow-hidden">
        <JobSelector
          selectedJobId={selectedJobId}
          onSelectJobId={handleSelectJob}
          jobs={jobList}
          isLoading={jobsLoading}
          error={jobsError}
        />

        <section
          className={`min-w-0 flex-1 h-full flex flex-col overflow-hidden ${dashboardRaisedCardClass}`}
        >
          {selectedJob ? (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b px-4 py-3 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold text-foreground">{selectedJob.title}</h2>
                  <div className="flex items-center gap-2">
                    {selectedJobId && (
                      <AnalyzeButton
                        onAnalyze={() =>
                          analyze((applications ?? []).map((application) => application.id))
                        }
                        isAnalyzing={isAnalyzing}
                        analyzedAt={analyzedAt}
                        disabled={!applications?.length}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectionMode((prev) => !prev)
                        if (selectionMode) {
                          setSelectedIds(new Set())
                        }
                      }}
                      className={`h-9 rounded-md px-3 text-xs font-medium transition-colors ${
                        selectionMode
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-highest text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {selectionMode ? "Salir seleccion" : "Seleccionar"}
                    </button>
                  </div>
                  {scoreError && (
                    <p role="alert" className="mt-2 text-xs text-destructive">
                      {scoreError}
                    </p>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {selectedJob.location?.isRemote ? "Remoto" : "Presencial"} ·{" "}
                  {filteredApplicants.length} postulantes
                  {filteredApplicants.length !== applicants.length
                    ? ` de ${applicants.length}`
                    : ""}
                </p>
              </div>
              <div className="flex-1 min-h-0 p-3 lg:p-4 flex flex-col overflow-hidden">
                {appsLoading || pipelineStagesQuery.isLoading ? (
                  <div className="flex h-full items-center justify-center py-12">
                    <div className="space-y-3 w-full p-3 lg:p-4">
                      {["first", "second", "third"].map((key) => (
                        <div
                          key={`app-skeleton-${key}`}
                          className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3"
                        >
                          <div className="size-8 animate-pulse rounded-full bg-surface-container-highest/60" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 animate-pulse rounded-md bg-surface-container-highest/60" />
                            <div className="h-2.5 w-20 animate-pulse rounded-md bg-surface-container-highest/60" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : pipelineStagesQuery.isError ? (
                  <div role="alert" className="m-auto flex flex-col items-center gap-3 text-sm">
                    <p className="text-destructive">No se pudieron cargar las etapas.</p>
                    <button
                      type="button"
                      onClick={() => void pipelineStagesQuery.refetch()}
                      className="underline"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : applicants.length === 0 ? (
                  <NoApplicantsEmptyState jobTitle={selectedJob.title} />
                ) : (
                  <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-hidden">
                    <div className="shrink-0">
                      <PipelineToolbar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        stageFilter={stageFilter}
                        onStageFilterChange={setStageFilter}
                        pipelineStages={pipelineStages}
                        members={organizationMembers}
                        assigneeFilter={assigneeFilter}
                        onAssigneeFilterChange={setAssigneeFilter}
                        overdueOnly={overdueOnly}
                        onOverdueOnlyChange={setOverdueOnly}
                        evaluationFilter={evaluationFilter}
                        onEvaluationFilterChange={setEvaluationFilter}
                        evaluationsAvailable={
                          !evaluationQuery.isLoading && !evaluationQuery.isError
                        }
                        selectedCount={selectedIds.size}
                        selectedApplicants={applicants.filter((a) => selectedIds.has(a.id))}
                        onClearSelection={handleClearSelection}
                        onBulkReject={handleBulkReject}
                        organizationId={organizationId ?? ""}
                        onBulkMessage={handleBulkMessage}
                        onBulkAdvance={handleBulkAdvance}
                      />
                    </div>
                    {evaluationQuery.isError && (
                      <div
                        role="alert"
                        className="flex items-center gap-2 text-xs text-destructive"
                      >
                        No se pudieron cargar las evaluaciones.
                        <button
                          type="button"
                          onClick={() => void evaluationQuery.refetch()}
                          className="underline"
                        >
                          Reintentar
                        </button>
                        {evaluationFilter !== "all" && (
                          <button
                            type="button"
                            onClick={() => setEvaluationFilter("all")}
                            className="underline"
                          >
                            Mostrar todas
                          </button>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <ApplicationsKanban
                        applicants={filteredApplicants}
                        stages={pipelineStages}
                        onStageChange={handleStageChange}
                        onCreateEvent={handleCreateEvent}
                        getScore={getScore}
                        getEvaluations={getEvaluations}
                        isAnalyzing={isAnalyzing}
                        jobOffer={jobOfferContext ?? undefined}
                        onScoreClick={handleScoreClick}
                        onViewProfile={handleViewProfile}
                        onViewDetail={handleViewDetail}
                        onMessage={handleSendMessage}
                        onSendOffer={setOfferDialogApp}
                        selectionMode={selectionMode}
                        selectedIds={selectedIds}
                        onToggleSelection={handleToggleSelection}
                        onClearSelection={handleClearSelection}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NoJobSelectedState />
          )}
        </section>
      </div>

      {eventModal.applicant && recruiterId && organizationId && (
        <EventFormModal
          isOpen={eventModal.isOpen}
          onClose={() => setEventModal({ isOpen: false, applicant: null, lockedType: null })}
          organizerId={recruiterId}
          organizationId={organizationId}
          candidateId={eventModal.applicant.candidateId}
          applicationId={eventModal.applicant.id}
          lockedType={eventModal.lockedType ?? undefined}
          onSuccess={handleEventSuccess}
        />
      )}

      {scoreModal.applicationId && scoreModal.score && selectedJobId && (
        <AIScoreModal
          open={scoreModal.isOpen}
          onOpenChange={(open) => setScoreModal((prev) => ({ ...prev, isOpen: open }))}
          score={scoreModal.score}
          jobId={selectedJobId}
          candidateName={
            applicants.find((applicant) => applicant.id === scoreModal.applicationId)
              ?.candidateName ?? ""
          }
        />
      )}

      {offerDialogApp && selectedJob && (
        <OfferLetterEditorDialog
          key={offerDialogApp.id}
          applicationId={offerDialogApp.id}
          candidateName={offerDialogApp.candidateName}
          jobTitle={selectedJob.title}
          companyName={organization?.name ?? ""}
          companyLogo={organization?.logo ?? null}
          salary={selectedJob.salary}
          workMode={
            selectedJob.location?.isRemote
              ? "Remoto"
              : selectedJob.location?.isHybrid
                ? "Híbrido"
                : "Presencial"
          }
          onClose={() => setOfferDialogApp(null)}
        />
      )}
    </div>
  )
}
