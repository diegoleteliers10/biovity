"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { ApplyJobSheet } from "./ApplyJobSheet"

type ApplyJobButtonProps = {
  jobId: string
  jobTitle?: string
  /** Compact variant for dashboard (inline, no full width) */
  compact?: boolean
  className?: string
}

export function ApplyJobButton({ jobId, jobTitle, compact, className }: ApplyJobButtonProps) {
  const { push } = useRouter()
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
      push(`/login/professional?redirect=/trabajos/${jobId}`)
      return
    }
    if (!isProfessional) return
    if (hasApplied) return

    setSheetOpen(true)
  }

  const btnClass = cn(
    "h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-none cursor-pointer",
    compact ? "px-6" : "w-full",
    className
  )
  const safeJobTitle = jobTitle?.trim() || "esta vacante"

  if (!isLoggedIn) {
    return (
      <>
        <Button className={btnClass} onClick={handleApply}>
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
      <p className="text-muted-foreground text-xs leading-5">
        Solo los profesionales pueden postular a ofertas laborales.
      </p>
    )
  }

  if (hasApplied) {
    return (
      <Button
        className={cn(
          "h-11 rounded-lg bg-secondary/15 text-secondary border border-secondary/25 text-sm font-semibold cursor-default",
          compact ? "px-6" : "w-full",
          className
        )}
        disabled
      >
        Ya postulaste a esta vacante
      </Button>
    )
  }

  return (
    <>
      <Button className={btnClass} onClick={handleApply}>
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
