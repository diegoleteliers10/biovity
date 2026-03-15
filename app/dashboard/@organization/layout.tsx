import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { DashboardShellOrganization } from "@/components/dashboard/organization/sidebarshell"

export default async function OrganizationLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return <DashboardShellOrganization defaultOpen={defaultOpen}>{children}</DashboardShellOrganization>
}