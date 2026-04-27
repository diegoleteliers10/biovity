"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"
import { ApplyJobSheet } from "./ApplyJobSheet"

type ApplyJobButtonProps = {
  jobId: string
  jobTitle?: string
  /** Compact variant for dashboard (inline, no full width) */
  compact?: boolean
}

export function ApplyJobButton({ jobId, jobTitle, compact }: ApplyJobButtonProps) {
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { useSession } = authClient
  const { data: session } = useSession()
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id
  const sessionTokenUserId = (session as { session?: { userId?: string } } | undefined)?.session
    ?.userId
  const userId = sessionUserId ?? sessionTokenUserId
  const userType = (session?.user as { type?: string })?.type

  const { data: myApplications } = useApplicationsByCandidate(userId)

  const hasApplied = myApplications?.some((a) => a.jobId === jobId)
  const isProfessional = userType === "professional"
  const isLoggedIn = Boolean(session?.user)

  const handleApply = () => {
    if (!isLoggedIn) {
      router.push(`/login/professional?redirect=/trabajos/${jobId}`)
      return
    }
    if (!isProfessional) return
    if (hasApplied) return

    setSheetOpen(true)
  }

  const btnClass = compact
    ? "bg-gray-900 hover:bg-gray-800 text-white px-6"
    : "w-full bg-gray-900 hover:bg-gray-800 text-white"
  const btnSize = compact ? "default" : "lg"
  const safeJobTitle = jobTitle?.trim() || "esta vacante"

  if (!isLoggedIn) {
    return (
      <>
        <Button size={btnSize} className={btnClass} onClick={handleApply}>
          Postular
        </Button>
        <ApplyJobSheet
          jobId={jobId}
          jobTitle={safeJobTitle}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      </>
    )
  }

  if (!isProfessional) {
    return (
      <p className="text-muted-foreground text-sm">
        Solo los profesionales pueden postular a trabajos.
      </p>
    )
  }

  if (hasApplied) {
    return (
      <Button size={btnSize} className={compact ? "" : "w-full"} variant="secondary" disabled>
        Ya postulaste
      </Button>
    )
  }

  return (
    <>
      <Button size={btnSize} className={btnClass} onClick={handleApply}>
        {compact ? "Postular" : "Postular ahora"}
      </Button>
      <ApplyJobSheet
        jobId={jobId}
        jobTitle={safeJobTitle}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
