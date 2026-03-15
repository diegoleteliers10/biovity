"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  useApplicationsByCandidate,
  useCreateApplicationMutation,
} from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"

type ApplyJobButtonProps = {
  jobId: string
  /** Compact variant for dashboard (inline, no full width) */
  compact?: boolean
}

export function ApplyJobButton({ jobId, compact }: ApplyJobButtonProps) {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id
  const userType = (session?.user as { type?: string })?.type

  const { data: myApplications, refetch } = useApplicationsByCandidate(userId)
  const createMutation = useCreateApplicationMutation(userId ?? "")

  const hasApplied = myApplications?.some((a) => a.jobId === jobId)
  const isProfessional = userType === "professional"
  const isLoggedIn = Boolean(session?.user)

  const handleApply = () => {
    if (!isLoggedIn) {
      router.push(`/login/professional?redirect=/trabajos/${jobId}`)
      return
    }
    if (!isProfessional || !userId) return
    if (hasApplied) return

    createMutation.mutate(jobId, {
      onError: (err) => {
        if (err.message.includes("already applied")) {
          refetch()
        }
      },
    })
  }

  const btnClass = compact
    ? "bg-gray-900 hover:bg-gray-800 text-white px-6"
    : "w-full bg-gray-900 hover:bg-gray-800 text-white"
  const btnSize = compact ? "default" : "lg"

  if (!isLoggedIn) {
    return (
      <Button size={btnSize} className={btnClass} onClick={handleApply}>
        Postular
      </Button>
    )
  }

  if (!isProfessional) {
    return (
      <p className="text-muted-foreground text-sm">
        Solo los profesionales pueden postular a trabajos.
      </p>
    )
  }

  if (hasApplied || createMutation.isSuccess) {
    return (
      <Button size={btnSize} className={compact ? "" : "w-full"} variant="secondary" disabled>
        Ya postulaste
      </Button>
    )
  }

  return (
    <div className={compact ? "" : "space-y-2"}>
      <Button
        size={btnSize}
        className={btnClass}
        onClick={handleApply}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "Postulando..." : compact ? "Postular" : "Postular ahora"}
      </Button>
      {createMutation.isError && (
        <p className="text-destructive text-center text-sm">{createMutation.error.message}</p>
      )}
    </div>
  )
}
