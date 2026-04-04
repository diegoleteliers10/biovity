"use client"

import { type ReactNode, useMemo } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { NAV_DATA } from "@/lib/data/nav-data"
import { computeProfileCompletion } from "@/lib/utils/profile-completion"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
}

export function DashboardShell({ children, defaultOpen }: DashboardShellProps) {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id
  const { data: user } = useUser(userId)
  const { data: resume } = useResumeByUser(userId)

  const navData = useMemo(() => {
    const completion = computeProfileCompletion(user ?? null, resume ?? null)
    const profileProgress =
      completion?.isComplete === true
        ? null
        : {
            percentage: completion?.percentage ?? 0,
            title: "Progreso del Perfil",
            subtitle: "Completitud",
            actionText: "Completar Perfil",
          }
    return { ...NAV_DATA, profileProgress }
  }, [user, resume])

  return (
    <SidebarProvider className="pt-2 pl-2 bg-sidebar" defaultOpen={defaultOpen}>
      <DashboardSidebar
        navData={navData}
        logoutRedirect="/login"
        profileUrl="/dashboard/profile"
        avatarUrl={user?.avatar}
        avatarGradient={{ from: "blue-500", to: "purple-600" }}
        profession={user?.profession}
      />
      <SidebarInset className="rounded-tl-lg">{children}</SidebarInset>
    </SidebarProvider>
  )
}
