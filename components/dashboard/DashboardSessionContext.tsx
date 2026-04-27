"use client"

import { createContext, useContext } from "react"
import type { ServerSession } from "@/lib/auth"

export const DashboardSessionContext = createContext<ServerSession | null>(null)

export function useDashboardSession() {
  return useContext(DashboardSessionContext)
}
