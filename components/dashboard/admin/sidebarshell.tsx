"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { NAV_DATA_ADMIN } from "@/lib/data/nav-data"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellAdminProps = {
  children: ReactNode
  defaultOpen: boolean
}

export function DashboardShellAdmin({ children, defaultOpen }: DashboardShellAdminProps) {
  return (
    <SidebarProvider className="pt-2 px-2 pb-2 bg-sidebar" defaultOpen={defaultOpen}>
      <DashboardSidebar
        navData={NAV_DATA_ADMIN}
        logoutRedirect="/login"
        profileUrl="/dashboard"
        avatarGradient={{ from: "amber-500", to: "orange-600" }}
      />
      <SidebarInset
        className="rounded-tl-lg sm:rounded-tl-lg"
        style={{ viewTransitionName: "persistent-nav" }}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
