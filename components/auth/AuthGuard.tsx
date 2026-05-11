"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { authClient } from "@/lib/auth-client"

type SessionResult = {
  data?: {
    user: unknown
    session: unknown
  } | null
  error?: unknown
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter()
  const isReadyRef = useRef(false)
  const hasSessionRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const initSession = async () => {
      const result = (await authClient.getSession({
        query: { disableCookieCache: true },
      })) as SessionResult | undefined

      if (cancelled) return

      isReadyRef.current = true
      hasSessionRef.current = Boolean(result?.data?.user)
    }

    initSession()

    return () => {
      cancelled = true
    }
  }, [])

  const isReady = isReadyRef.current
  const hasSession = hasSessionRef.current

  useEffect(() => {
    if (!isReady) return
    if (!hasSession) {
      replace("/")
    }
  }, [isReady, hasSession, replace])

  if (!isReady) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!hasSession) return null

  return <>{children}</>
}
