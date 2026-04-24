"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function SessionRefresher() {
  const pathname = usePathname()
  useEffect(() => {
    authClient.getSession()
  }, [pathname])
  return null
}
