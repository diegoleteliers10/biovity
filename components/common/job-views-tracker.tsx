"use client"

import { useEffect } from "react"
import { useIncrementJobViews } from "@/lib/api/use-jobs-views"
import { authClient } from "@/lib/auth-client"

type JobViewsTrackerProps = {
  jobId: string
  jobOrganizationId: string
}

export function JobViewsTracker({ jobId, jobOrganizationId }: JobViewsTrackerProps) {
  const { data: session, isPending } = authClient.useSession()
  const incrementViews = useIncrementJobViews()

  useEffect(() => {
    if (isPending) return

    const user = session?.user
    if (!user) {
      incrementViews.mutate(jobId)
      return
    }

    const userOrgId = (user as { organizationId?: string }).organizationId
    const userId = (user as { id?: string }).id
    const userType = (user as { type?: string }).type

    if (userType === "organization") {
      if (userOrgId === jobOrganizationId) return
    }

    incrementViews.mutate(jobId)
  }, [session, isPending, jobId, jobOrganizationId, incrementViews])

  return null
}
