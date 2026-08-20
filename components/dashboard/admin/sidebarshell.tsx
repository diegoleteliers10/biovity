"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { useNotificationsRealtime } from "@/lib/api/use-notifications"
import type { ServerSession } from "@/lib/auth"
import { NAV_DATA_ADMIN } from "@/lib/data/nav-data"
import { DashboardSessionContext } from "../DashboardSessionContext"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellAdminProps = {
  children: ReactNode
  defaultOpen: boolean
  session?: ServerSession | null
}

export function DashboardShellAdmin({ children, defaultOpen, session }: DashboardShellAdminProps) {
  const userId = session?.user?.id
  useNotificationsRealtime(userId)
  return (
    <DashboardSessionContext.Provider value={session ?? null}>
      <SidebarProvider
        className="h-svh max-h-svh pt-2 px-2 pb-2 bg-sidebar overflow-hidden"
        defaultOpen={defaultOpen}
      >
        <DashboardSidebar
          navData={NAV_DATA_ADMIN}
          logoutRedirect="/login"
          profileUrl="/dashboard"
          avatarGradient={{ from: "amber-500", to: "orange-600" }}
          session={session}
        />
        <SidebarInset
          className="h-full max-h-full min-h-0 overflow-y-auto overflow-x-hidden rounded-tl-lg sm:rounded-tl-lg"
          style={{ viewTransitionName: "persistent-nav" }}
        >
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DashboardSessionContext.Provider>
  )
}
