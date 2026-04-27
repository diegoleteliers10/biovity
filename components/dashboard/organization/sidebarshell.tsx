"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import type { ServerSession } from "@/lib/auth"
import { NAV_DATA_ORGANIZATION } from "@/lib/data/nav-data"
import { DashboardSessionContext } from "../DashboardSessionContext"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
  session?: ServerSession | null
}

export function DashboardShellOrganization({
  children,
  defaultOpen,
  session,
}: DashboardShellProps) {
  return (
    <DashboardSessionContext.Provider value={session ?? null}>
      <SidebarProvider className="pt-2 px-2 pb-2 bg-sidebar" defaultOpen={defaultOpen}>
        <DashboardSidebar
          navData={NAV_DATA_ORGANIZATION}
          logoutRedirect="/login/organization"
          profileUrl="/dashboard/profile"
          avatarGradient={{ from: "purple-500", to: "blue-600" }}
          logoutHoverContrastOnAccent
          session={session}
        />
        <SidebarInset
          className="min-h-0 rounded-tl-lg sm:rounded-tl-lg"
          style={{ viewTransitionName: "persistent-nav" }}
        >
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DashboardSessionContext.Provider>
  )
}
