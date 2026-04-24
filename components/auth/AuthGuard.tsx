"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { authClient } from "@/lib/auth-client"
import type { QueryClient } from "@tanstack/react-query"

let globalQueryClient: QueryClient | null = null

export function setQueryClient(client: QueryClient) {
  globalQueryClient = client
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const prevUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const handlePageshow = (event: Event) => {
      if ((event as PageTransitionEvent).persisted) {
        window.location.reload()
        return
      }
    }
    window.addEventListener("pageshow", handlePageshow, false)

    return () => {
      window.removeEventListener("pageshow", handlePageshow, false)
    }
  }, [])

  useEffect(() => {
    if (isPending) return

    const currentUserId = session?.user?.id ?? null

    if (currentUserId && prevUserIdRef.current !== null && currentUserId !== prevUserIdRef.current) {
      if (globalQueryClient) {
        globalQueryClient.clear()
      }
    }

    prevUserIdRef.current = currentUserId

    if (!session) {
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
