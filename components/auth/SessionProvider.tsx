"use client"

import { createContext, type ReactNode, use } from "react"
import type { ServerSession } from "@/lib/auth"

type SessionContextValue = {
  session: ServerSession | null
}

const SessionContext = createContext<SessionContextValue>({ session: null })

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode
  session: ServerSession | null
}) {
  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>
}

export function useServerSession() {
  return use(SessionContext)
}
