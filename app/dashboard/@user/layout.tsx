import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/employee/sidebarshell"

// Layout for professional dashboard (slot @user)
export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return <DashboardShell defaultOpen={defaultOpen}>{children}</DashboardShell>
}
