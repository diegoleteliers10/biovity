"use client"

import { type ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/animate-ui/components/radix/sidebar"
import { SidebarComponent } from "./sidebarNav" // ver paso 3

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
}

export function DashboardShell({ children, defaultOpen }: DashboardShellProps) {
  return (
    <SidebarProvider className="pt-2 pl-2 bg-sidebar" defaultOpen={defaultOpen}>
      <SidebarComponent />
      <SidebarInset className="rounded-tl-lg">{children}</SidebarInset>
    </SidebarProvider>
  )
}
