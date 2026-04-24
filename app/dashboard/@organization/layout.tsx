import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { DashboardShellOrganization } from "@/components/dashboard/organization/sidebarshell"

export default async function OrganizationLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <SessionRefresher />
      <DashboardShellOrganization defaultOpen={defaultOpen}>{children}</DashboardShellOrganization>
    </AuthGuard>
  )
}
