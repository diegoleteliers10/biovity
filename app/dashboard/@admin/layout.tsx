import { cookies } from "next/headers"
import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardShellAdmin } from "@/components/dashboard/admin/sidebarshell"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <DashboardShellAdmin defaultOpen={defaultOpen}>{children}</DashboardShellAdmin>
    </AuthGuard>
  )
}
