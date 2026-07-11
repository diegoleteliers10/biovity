"use client"

import { useMountEffect } from "@/hooks/use-mount-effect"
import { authClient } from "@/lib/auth-client"

export function SessionRefresher() {
  useMountEffect(() => {
    void authClient.getSession({ query: { disableCookieCache: true } })
  })

  return null
}
