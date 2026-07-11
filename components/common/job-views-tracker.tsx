"use client"

import { useMountEffect } from "@/hooks/use-mount-effect"
import { useIncrementJobViews } from "@/lib/api/use-jobs-views"
import { type AuthUser, authClient } from "@/lib/auth-client"

type JobViewsTrackerProps = {
  jobId: string
  jobOrganizationId: string
}

function shouldTrackView(user: AuthUser | undefined, jobOrganizationId: string): boolean {
  if (!user) return true
  if (user.type === "organization" && user.organizationId === jobOrganizationId) return false
  return true
}

function JobViewsTrackerInner({
  jobId,
  jobOrganizationId,
  user,
}: {
  jobId: string
  jobOrganizationId: string
  user: AuthUser | undefined
}) {
  const incrementViews = useIncrementJobViews()

  useMountEffect(() => {
    if (shouldTrackView(user, jobOrganizationId)) {
      incrementViews.mutate(jobId)
    }
  })

  return null
}

export function JobViewsTracker({ jobId, jobOrganizationId }: JobViewsTrackerProps) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  return (
    <JobViewsTrackerInner
      jobId={jobId}
      jobOrganizationId={jobOrganizationId}
      user={session?.user as AuthUser | undefined}
    />
  )
}
