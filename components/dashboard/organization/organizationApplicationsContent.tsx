"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { AIScoreModal } from "@/components/ai/AIScoreModal"
import { AnalyzeButton } from "@/components/ai/AnalyzeButton"
import { EventFormModal } from "@/components/calendar/event-form-modal"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useKanbanAIScoring } from "@/hooks/useKanbanAIScoring"
import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"
import type { Application } from "@/lib/api/applications"
import type { Resume } from "@/lib/api/resumes"
import { getResumeByUserId } from "@/lib/api/resumes"
import {
  applicationsKeys,
  useApplicationsByJob,
  useUpdateApplicationStatusMutation,
} from "@/lib/api/use-applications"
import { useJobs } from "@/lib/api/use-jobs"
import { authClient } from "@/lib/auth-client"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import type { EventType } from "@/lib/types/events"
import { formatDateChilean } from "@/lib/utils"
import { ApplicationsKanban } from "./ApplicationsKanban"
import { JobSelector, NoApplicantsEmptyState, NoJobSelectedState } from "./applicationsUtils"

function applicationToApplicant(app: Application): Applicant {
  return {
    id: app.id,
    candidateId: app.candidateId,
    candidateName: app.candidate?.name ?? "Sin nombre",
    position: app.candidate?.profession ?? app.job?.title ?? "—",
    dateApplied: app.createdAt ? formatDateChilean(app.createdAt, "d MMM yyyy") : "—",
    stage: app.status as ApplicationStage,
    candidateEducation: app.candidate?.education ?? undefined,
    candidateSkills: app.candidate?.skills ?? undefined,
    candidateYearsOfExperience: app.candidate?.yearsOfExperience ?? undefined,
    candidateBio: app.candidate?.bio ?? undefined,
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

  const [resumes, setResumes] = useState<Record<string, Resume>>({})

  useEffect(() => {
    if (!applications?.length) return

    const userIds = applications.flatMap((a) => (a.candidateId ? [a.candidateId] : []))
    if (userIds.length === 0) return

    const fetchResume = async (userId: string): Promise<[string, Resume | null]> => {
      const result = await getResumeByUserId(userId)
      if (result.isOk()) {
        return [userId, result.value]
      }
      return [userId, null]
    }

    Promise.all(userIds.map(fetchResume)).then((results) => {
      const resumesMap: Record<string, Resume> = {}
      for (const [userId, resume] of results) {
        if (resume) {
          resumesMap[userId] = resume
        }
      }
      setResumes(resumesMap)
    })
  }, [applications])

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

  const jobOfferContext = useMemo<JobOfferContext | null>(() => {
    if (!selectedJob) return null
    return {
      title: selectedJob.title,
      description: selectedJob.description,
      requiredSkills: [],
      minExperience: 0,
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
    async (_eventId: string) => {
      if (!eventModal.applicant) return
      const newStage: ApplicationStage =
        eventModal.lockedType === "interview" ? "entrevista" : "contratado"
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
        <NotificationBell notifications={[]} showAgentTrigger />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <NotificationBell notifications={[]} showAgentTrigger />
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
                </div>
                <p className="text-muted-foreground text-sm">
                  {selectedJob.location?.isRemote ? "Remoto" : "Presencial"} · {applicants.length}{" "}
                  postulantes
                </p>
              </div>
              <div className="flex-1 p-3 lg:p-4 overflow-y-auto lg:overflow-visible">
                {appsLoading ? (
                  <div className="flex flex-1 items-center justify-center py-12">
                    <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : applicants.length === 0 ? (
                  <NoApplicantsEmptyState jobTitle={selectedJob.title} />
                ) : (
                  <div className="flex h-full flex-col gap-4 overflow-y-auto">
                    <ApplicationsKanban
                      applicants={applicants}
                      onStatusChange={handleStatusChange}
                      onCreateEvent={handleCreateEvent}
                      getScore={getScore}
                      isAnalyzing={isAnalyzing}
                      jobOffer={jobOfferContext ?? undefined}
                      onScoreClick={handleScoreClick}
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
