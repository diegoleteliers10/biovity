"use client"

import { useQueries, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { AIScoreModal } from "@/components/ai/AIScoreModal"
import { AnalyzeButton } from "@/components/ai/AnalyzeButton"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useKanbanAIScoring } from "@/hooks/useKanbanAIScoring"
import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"
import type { Application } from "@/lib/api/applications"
import type { Resume } from "@/lib/api/resumes"
import { getResumeByUserId } from "@/lib/api/resumes"
import { useLogActivityMutation } from "@/lib/api/use-activity-logs"
import {
  applicationsKeys,
  useApplicationsByJob,
  useUpdateApplicationStatusMutation,
} from "@/lib/api/use-applications"
import { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import { useJobs } from "@/lib/api/use-jobs"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import type { EventType } from "@/lib/types/events"
import { formatDateChilean } from "@/lib/utils"
import { useDashboardSession } from "../DashboardSessionContext"
import { ApplicationsKanban } from "./ApplicationsKanban"
import { JobSelector, NoApplicantsEmptyState, NoJobSelectedState } from "./applicationsUtils"
import { PipelineToolbar } from "./PipelineToolbar"

function applicationToApplicant(app: Application): Applicant {
  return {
    id: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidate?.name ?? "Sin nombre",
    position: app.candidate?.profession ?? app.job?.title ?? "—",
    dateApplied: app.createdAt ? formatDateChilean(app.createdAt, "d MMM yyyy") : "—",
    stage: app.status as ApplicationStage,
    avatar: app.candidate?.avatar,
    candidateEducation: app.candidate?.education ?? undefined,
    candidateSkills: app.candidate?.skills ?? undefined,
    candidateYearsOfExperience: app.candidate?.yearsOfExperience ?? undefined,
    candidateBio: app.candidate?.bio ?? undefined,
  }
}

export function OrganizationApplicationsContent() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined
  const recruiterId = session?.user?.id ?? undefined

  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useJobs(organizationId)
  const jobList = jobs ?? []
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const { data: applications, isLoading: appsLoading } = useApplicationsByJob(
    selectedJobId ?? undefined
  )
  const updateStatusMutation = useUpdateApplicationStatusMutation(selectedJobId ?? "")
  const logActivityMutation = useLogActivityMutation(organizationId ?? "")

  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const candidateUserIds = useMemo(
    () => (applications ?? []).flatMap((a) => (a.candidateId ? [a.candidateId] : [])),
    [applications]
  )

  const resumeQueries = useQueries({
    queries: candidateUserIds.map((userId) => ({
      queryKey: ["resume", "byUserId", userId],
      queryFn: async () => {
        const result = await getResumeByUserId(userId)
        if (result.isOk()) return result.value
        return null
      },
    })),
  })

  const resumes = useMemo(() => {
    const map: Record<string, Resume> = {}
    candidateUserIds.forEach((userId, index) => {
      const resume = resumeQueries[index]?.data
      if (resume) {
        map[userId] = resume
      }
    })
    return map
  }, [candidateUserIds, resumeQueries])

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

  const filteredApplicants = useMemo(() => {
    let result = applicants
    if (stageFilter !== "all") {
      result = result.filter((a) => a.stage === stageFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) => a.candidateName.toLowerCase().includes(q))
    }
    return result
  }, [applicants, stageFilter, searchQuery])

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

  const candidates = useMemo(
    () =>
      (applications ?? []).map((app) => ({
        id: app.candidateId,
        data: {
          name: app.candidate?.name ?? "Sin nombre",
          education: app.candidate?.education ?? "",
          skills: app.candidate?.skills ?? [],
          yearsOfExperience: app.candidate?.yearsOfExperience ?? 0,
          bio: app.candidate?.bio ?? "",
        } as CandidateContext,
      })),
    [applications]
  )

  const { analyze, clearScores, getScore, isAnalyzing, analyzedAt } = useKanbanAIScoring()

  const createChatMutation = useCreateOrFindChatMutation(recruiterId)

  const handleViewProfile = useCallback(
    (candidateId: string) => {
      router.push(`/dashboard/talent?view=${candidateId}`)
    },
    [router]
  )

  const handleViewDetail = useCallback(
    (applicationId: string) => {
      if (!selectedJobId) return
      router.push(`/dashboard/ofertas/${selectedJobId}/postulaciones/${applicationId}`)
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
    candidateId: string | null
    score: CandidateScore | null
  }>({ isOpen: false, candidateId: null, score: null })

  const handleScoreClick = useCallback(
    (candidateId: string) => {
      const entry = getScore(candidateId)
      if (entry) {
        setScoreModal({
          isOpen: true,
          candidateId,
          score: entry.score,
        })
      }
    },
    [getScore]
  )

  const handleStatusChange = useCallback(
    (applicationId: string, newStage: ApplicationStage) => {
      if (!selectedJobId) return

      const previousApps = queryClient.getQueryData(applicationsKeys.byJob(selectedJobId))

      queryClient.setQueryData(
        applicationsKeys.byJob(selectedJobId),
        (old: Application[] | undefined) => {
          if (!old) return old
          return old.map((app) => (app.id === applicationId ? { ...app, status: newStage } : app))
        }
      )

      updateStatusMutation.mutate(
        { id: applicationId, status: newStage },
        {
          onSuccess: (updatedApp) => {
            if (organizationId && recruiterId) {
              const candidateName =
                updatedApp.candidate?.name ||
                applications?.find((a) => a.id === applicationId)?.candidate?.name ||
                "un candidato"
              const jobTitle = jobList.find((j) => j.id === selectedJobId)?.title || "la oferta"
              logActivityMutation.mutate({
                userId: recruiterId,
                action: "candidate.stage_changed",
                description: `Cambió la etapa de ${candidateName} a "${newStage}" en la oferta "${jobTitle}"`,
              })
            }
          },
          onError: () => {
            queryClient.setQueryData(applicationsKeys.byJob(selectedJobId), previousApps)
          },
          onSettled: () => {
            queryClient.invalidateQueries({
              queryKey: applicationsKeys.byJob(selectedJobId),
            })
          },
        }
      )
    },
    [selectedJobId, updateStatusMutation, queryClient]
  )

  const handleBulkReject = useCallback(() => {
    for (const id of selectedIds) {
      handleStatusChange(id, "rechazado")
    }
    handleClearSelection()
  }, [selectedIds, handleStatusChange, handleClearSelection])

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
    (targetStage: ApplicationStage) => {
      for (const id of selectedIds) {
        handleStatusChange(id, targetStage)
      }
      handleClearSelection()
    },
    [selectedIds, handleStatusChange, handleClearSelection]
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
      const newStage: ApplicationStage =
        eventModal.lockedType === "interview" ? "entrevista" : "contratado"
      handleStatusChange(eventModal.applicant.id, newStage)
    },
    [eventModal.applicant, eventModal.lockedType, handleStatusChange]
  )

  if (!organizationId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Aplicaciones</h1>
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
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <ConnectedNotificationBell showAgentTrigger />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell showAgentTrigger />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Aplicaciones</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Revisa las postulaciones de candidatos a tus ofertas.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4 flex-col lg:flex-row">
        <JobSelector
          selectedJobId={selectedJobId}
          onSelectJobId={setSelectedJobId}
          jobs={jobList}
          isLoading={jobsLoading}
          error={jobsError}
        />

        <section className="min-w-0 max-w-dvw flex-1 overflow-hidden rounded-lg border bg-card">
          {selectedJob ? (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="border-b px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold">{selectedJob.title}</h2>
                  <div className="flex items-center gap-2">
                    {jobOfferContext && (
                      <AnalyzeButton
                        onAnalyze={() => analyze(candidates, jobOfferContext, resumes)}
                        isAnalyzing={isAnalyzing}
                        analyzedAt={analyzedAt}
                        onClear={clearScores}
                        disabled={candidates.length === 0}
                        jobOffer={jobOfferContext}
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
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectionMode
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {selectionMode ? "Salir seleccion" : "Seleccionar"}
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {selectedJob.location?.isRemote ? "Remoto" : "Presencial"} ·{" "}
                  {filteredApplicants.length} postulantes
                  {filteredApplicants.length !== applicants.length
                    ? ` de ${applicants.length}`
                    : ""}
                </p>
              </div>
              <div className="flex-1 p-3 lg:p-4 overflow-y-auto lg:overflow-visible">
                {appsLoading ? (
                  <div className="flex h-full items-center justify-center py-12">
                    <div className="space-y-3 w-full p-3 lg:p-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
                        >
                          <div className="size-8 animate-pulse rounded-full bg-muted" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : applicants.length === 0 ? (
                  <NoApplicantsEmptyState jobTitle={selectedJob.title} />
                ) : (
                  <div className="flex h-full flex-col gap-3 overflow-y-auto">
                    <PipelineToolbar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      stageFilter={stageFilter}
                      onStageFilterChange={setStageFilter}
                      selectedCount={selectedIds.size}
                      selectedApplicants={filteredApplicants.filter((a) => selectedIds.has(a.id))}
                      onClearSelection={handleClearSelection}
                      onBulkReject={handleBulkReject}
                      onBulkMessage={handleBulkMessage}
                      onBulkAdvance={handleBulkAdvance}
                    />
                    <ApplicationsKanban
                      applicants={filteredApplicants}
                      onStatusChange={handleStatusChange}
                      onCreateEvent={handleCreateEvent}
                      getScore={getScore}
                      isAnalyzing={isAnalyzing}
                      jobOffer={jobOfferContext ?? undefined}
                      onScoreClick={handleScoreClick}
                      onViewProfile={handleViewProfile}
                      onViewDetail={handleViewDetail}
                      onMessage={handleSendMessage}
                      selectionMode={selectionMode}
                      selectedIds={selectedIds}
                      onToggleSelection={handleToggleSelection}
                      onClearSelection={handleClearSelection}
                    />
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

      {scoreModal.candidateId && scoreModal.score && jobOfferContext && (
        <AIScoreModal
          open={scoreModal.isOpen}
          onOpenChange={(open) => setScoreModal((prev) => ({ ...prev, isOpen: open }))}
          score={scoreModal.score}
          jobOffer={jobOfferContext}
          candidateName={
            applicants.find((a) => a.candidateId === scoreModal.candidateId)?.candidateName ?? ""
          }
        />
      )}
    </div>
  )
}
