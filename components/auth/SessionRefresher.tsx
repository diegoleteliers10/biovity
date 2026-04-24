"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export function SessionRefresher() {
  const pathname = usePathname()
  const { refetch } = authClient.useSession()

  useEffect(() => {
    refetch()
  }, [pathname, refetch])

  return null
}