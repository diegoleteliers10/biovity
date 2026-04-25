import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { getServerSession, type ServerSession } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/employee/sidebarshell"

export default async function EmployeeLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const session = await getServerSession()

  return <DashboardShell defaultOpen={defaultOpen} session={session}>{children}</DashboardShell>
}