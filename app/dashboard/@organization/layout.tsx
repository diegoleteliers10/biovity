import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { DashboardShellOrganization } from "@/components/dashboard/organization/sidebarshell"
import { getServerSession } from "@/lib/auth"

export default async function OrganizationLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const session = await getServerSession()

  return (
    <DashboardShellOrganization defaultOpen={defaultOpen} session={session}>
      {children}
    </DashboardShellOrganization>
  )
}
