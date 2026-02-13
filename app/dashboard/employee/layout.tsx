import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/employee/sidebarshell"

// Este layout envuelve TODAS las páginas bajo /dashboard/employee
export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return <DashboardShell defaultOpen={defaultOpen}>{children}</DashboardShell>
}
