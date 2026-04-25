import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { getServerSession } from "@/lib/auth"
import { DashboardShellAdmin } from "@/components/dashboard/admin/sidebarshell"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const session = await getServerSession()

  return <DashboardShellAdmin defaultOpen={defaultOpen} session={session}>{children}</DashboardShellAdmin>
}