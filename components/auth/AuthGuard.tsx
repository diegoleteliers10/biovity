"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

type SessionResult = {
  data?: {
    user: unknown
    session: unknown
  } | null
  error?: unknown
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let cancelled = false

    const initSession = async () => {
      const result = (await authClient.getSession({
        query: { disableCookieCache: true },
      })) as SessionResult | undefined

      if (cancelled) return

      if (result?.data?.user) {
        setHasSession(true)
      } else {
        setHasSession(false)
      }
      setIsReady(true)
    }

    initSession()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!hasSession) {
      router.replace("/")
    }
  }, [isReady, hasSession, router])

  if (!isReady) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!hasSession) return null

  return <>{children}</>
}
