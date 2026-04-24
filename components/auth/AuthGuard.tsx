"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending, refetch } = authClient.useSession()
  const [hasValidSession, setHasValidSession] = useState(false)
  const [checkComplete, setCheckComplete] = useState(false)

  useEffect(() => {
    const handlePageshow = (event: Event) => {
      if ((event as PageTransitionEvent).persisted) {
        window.location.reload()
        return
      }
    }
    window.addEventListener("pageshow", handlePageshow, false)
    return () => window.removeEventListener("pageshow", handlePageshow, false)
  }, [])

  useEffect(() => {
    if (isPending) return

    if (session) {
      setHasValidSession(true)
      setCheckComplete(true)
      return
    }

    if (!session && !isPending) {
      setCheckComplete(true)
    }
  }, [isPending, session])

  useEffect(() => {
    if (checkComplete && !hasValidSession && !isPending) {
      router.replace("/")
    }
  }, [checkComplete, hasValidSession, isPending, router])

  if (isPending || !checkComplete) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}