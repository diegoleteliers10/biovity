"use client"

import { useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { Job } from "@/lib/api/jobs"
import { useJobsByOrganization, useUpdateJobMutation } from "@/lib/api/use-jobs"
import { useDashboardSession } from "../DashboardSessionContext"
import { CreateJobDialog } from "./CreateJobDialog"
import { DeleteJobAlertDialog } from "./ofertas/DeleteJobAlertDialog"
import { EmptyJobsState, JobsGrid } from "./ofertas/JobsGrid"
import { OfertasContentSkeleton } from "./ofertas/OfertasContentSkeleton"
import { OfertasErrorState } from "./ofertas/OfertasErrorState"
import { OfertasHeader } from "./ofertas/OfertasHeader"

export function OfertasContent() {
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined

  const { data: orgJobs, isLoading, error, refetch } = useJobsByOrganization(organizationId)
  const jobList = orgJobs?.data ?? []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [dialogNonce, setDialogNonce] = useState(0)
  const [deleteConfirmJob, setDeleteConfirmJob] = useState<Job | null>(null)
  const updateJobMutation = useUpdateJobMutation(organizationId ?? "")
  const { completeStep } = useOnboarding()

  const openJobDialog = (job: Job | null) => {
    setEditingJob(job)
    setDialogNonce((n) => n + 1)
    setDialogOpen(true)
  }

  const handleCreateOffer = () => openJobDialog(null)

  const handleEditJob = (job: Job) => openJobDialog(job)

  const handleDuplicateJob = (job: Job) => {
    const { id, createdAt, updatedAt, status, ...rest } = job
    openJobDialog({ ...rest, status: "draft" } as Job)
  }

  const handleDeleteClick = (job: Job) => {
    setDeleteConfirmJob(job)
  }

  const handlePublishJob = (job: Job) => {
    updateJobMutation.mutate(
      { id: job.id, input: { status: "active" } },
      { onSuccess: () => completeStep.mutate("publish_offer") }
    )
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setEditingJob(null)
    setDialogOpen(open)
  }

  if (!organizationId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Ofertas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus vacantes y publica nuevas ofertas de empleo.
          </p>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">
            No tienes una organización asociada. Completa tu perfil para publicar ofertas.
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

      <OfertasHeader onCreateOffer={handleCreateOffer} />

      {isLoading ? (
        <OfertasContentSkeleton />
      ) : error ? (
        <OfertasErrorState error={error} onRetry={() => refetch()} />
      ) : !jobList.length ? (
        <EmptyJobsState onCreate={handleCreateOffer} />
      ) : (
        <JobsGrid
          jobs={jobList}
          onEdit={handleEditJob}
          onDelete={handleDeleteClick}
          onPublish={handlePublishJob}
          onCreate={handleCreateOffer}
          onDuplicate={handleDuplicateJob}
        />
      )}

      <CreateJobDialog
        key={dialogNonce}
        organizationId={organizationId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        job={editingJob}
      />

      <DeleteJobAlertDialog
        job={deleteConfirmJob}
        onClose={() => setDeleteConfirmJob(null)}
        organizationId={organizationId}
      />
    </div>
  )
}
