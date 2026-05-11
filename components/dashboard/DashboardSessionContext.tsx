"use client"

import { createContext, use } from "react"
import type { ServerSession } from "@/lib/auth"

export const DashboardSessionContext = createContext<ServerSession | null>(null)

export function useDashboardSession() {
  return use(DashboardSessionContext)
}
