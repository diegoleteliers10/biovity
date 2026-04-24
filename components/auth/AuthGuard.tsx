"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    // Force hard reload if page was restored from bfcache
    const handlePageshow = (event: PageshowEvent) => {
      if (event.persisted) {
        window.location.reload()
        return
      }
    }
    window.addEventListener("pageshow", handlePageshow, false)

    // Normal session check - redirect if no session
    if (!isPending && !session) {
      router.replace("/")
    }
  }, [isPending, session, router])

  if (isPending) {
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
