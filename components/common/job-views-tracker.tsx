"use client"

import { useEffect, useRef } from "react"
import { useIncrementJobViews } from "@/lib/api/use-jobs-views"
import { authClient } from "@/lib/auth-client"

type JobViewsTrackerProps = {
  jobId: string
  jobOrganizationId: string
}

export function JobViewsTracker({ jobId, jobOrganizationId }: JobViewsTrackerProps) {
  const { data: session, isPending } = authClient.useSession()
  const incrementViews = useIncrementJobViews()
  const incrementRef = useRef(incrementViews)
  incrementRef.current = incrementViews

  useEffect(() => {
    if (isPending) return

    let cancelled = false

    const track = () => {
      if (cancelled) return

      const user = session?.user
      if (!user) {
        incrementRef.current.mutate(jobId)
        return
      }

      const userOrgId = (user as { organizationId?: string }).organizationId
      const userId = (user as { id?: string }).id
      const userType = (user as { type?: string }).type

      if (userType === "organization") {
        if (userOrgId === jobOrganizationId) return
      }

      incrementRef.current.mutate(jobId)
    }

    track()

    return () => {
      cancelled = true
    }
  }, [isPending, session, jobId, jobOrganizationId])

  return null
}
