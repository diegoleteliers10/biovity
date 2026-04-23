"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { NAV_DATA_ORGANIZATION } from "@/lib/data/nav-data"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
}

export function DashboardShellOrganization({ children, defaultOpen }: DashboardShellProps) {
  return (
    <SidebarProvider className="pt-2 px-2 pb-2 bg-sidebar" defaultOpen={defaultOpen}>
      <DashboardSidebar
        navData={NAV_DATA_ORGANIZATION}
        logoutRedirect="/login/organization"
        profileUrl="/dashboard/profile"
        avatarGradient={{ from: "purple-500", to: "blue-600" }}
        logoutHoverContrastOnAccent
      />
      <SidebarInset className="min-h-0 rounded-tl-lg sm:rounded-tl-lg" style={{ viewTransitionName: "persistent-nav" }}>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
