"use client"

import { useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import type { Job } from "@/lib/api/jobs"
import { useJobsByOrganization } from "@/lib/api/use-jobs"
import { authClient } from "@/lib/auth-client"
import { CreateJobDialog } from "./CreateJobDialog"
import { DeleteJobAlertDialog } from "./ofertas/DeleteJobAlertDialog"
import { EmptyJobsState, JobsGrid } from "./ofertas/JobsGrid"
import { OfertasContentSkeleton } from "./ofertas/OfertasContentSkeleton"
import { OfertasErrorState } from "./ofertas/OfertasErrorState"
import { OfertasHeader } from "./ofertas/OfertasHeader"

export function OfertasContent() {
  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

  const { data: orgJobs, isLoading, error } = useJobsByOrganization(organizationId)
  const jobList = orgJobs?.data ?? []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deleteConfirmJob, setDeleteConfirmJob] = useState<Job | null>(null)

  const handleCreateOffer = () => {
    setEditingJob(null)
    setDialogOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setDialogOpen(true)
  }

  const handleDeleteClick = (job: Job) => {
    setDeleteConfirmJob(job)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setEditingJob(null)
    setDialogOpen(open)
  }

  if (sessionPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-80 animate-pulse rounded bg-muted" />
        </div>
        <OfertasContentSkeleton />
      </div>
    )
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
        <NotificationBell notifications={[]} showAgentTrigger />
      </div>

      <OfertasHeader onCreateOffer={handleCreateOffer} />

      {isLoading ? (
        <OfertasContentSkeleton />
      ) : error ? (
        <OfertasErrorState error={error} />
      ) : !jobList.length ? (
        <EmptyJobsState onCreate={handleCreateOffer} />
      ) : (
        <JobsGrid
          jobs={jobList}
          onEdit={handleEditJob}
          onDelete={handleDeleteClick}
          onCreate={handleCreateOffer}
        />
      )}

      <CreateJobDialog
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
