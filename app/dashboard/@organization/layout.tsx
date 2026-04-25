import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { getServerSession, type ServerSession } from "@/lib/auth"
import { DashboardShellOrganization } from "@/components/dashboard/organization/sidebarshell"

export default async function OrganizationLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const session = await getServerSession()

  return (
    <DashboardShellOrganization defaultOpen={defaultOpen} session={session}>{children}</DashboardShellOrganization>
  )
}