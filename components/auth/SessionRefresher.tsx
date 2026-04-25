"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { authClient } from "@/lib/auth-client"

export function SessionRefresher() {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const refreshSession = async () => {
      const sessionAtom = authClient.$store.atoms["session"] as {
        set: (v: { data: null; error: null; isPending: boolean; isRefetching: boolean; refetch: () => void }) => void
        get: () => { data: unknown; error: unknown; isPending: boolean; isRefetching: boolean; refetch: () => void }
      }
      const current = sessionAtom.get()
      if (!current.data) {
        sessionAtom.set({
          data: null,
          error: null,
          isPending: false,
          isRefetching: false,
          refetch: current.refetch,
        })
      }
      await authClient.getSession({ query: { disableCookieCache: true } })
      authClient.$store.notify("$sessionSignal")
    }

    // Always refresh on pathname change, including initial mount
    if (prevPathname.current !== pathname || !mounted.current) {
      prevPathname.current = pathname
      mounted.current = true
      refreshSession()
    }
  }, [pathname])

  return null
}