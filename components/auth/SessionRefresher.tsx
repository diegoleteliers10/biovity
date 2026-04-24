"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function SessionRefresher() {
  const pathname = usePathname()

  useEffect(() => {
    const refreshSession = async () => {
      await authClient.getSession({
        query: {
          disableCookieCache: true,
        },
      })
    }
    refreshSession()
  }, [pathname])

  return null
}