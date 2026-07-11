"use client"

import { type ReactNode, useMemo } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { useChatsByProfessional } from "@/lib/api/use-chats"
import { useNotificationsRealtime } from "@/lib/api/use-notifications"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { useSavedJobsByUser } from "@/lib/api/use-saved-jobs"
import { useUserMetrics } from "@/lib/api/use-user-metrics"
import type { ServerSession } from "@/lib/auth"
import { NAV_DATA } from "@/lib/data/nav-data"
import { computeProfileCompletion } from "@/lib/utils/profile-completion"
import { DashboardSessionContext } from "../DashboardSessionContext"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
  session?: ServerSession | null
}

export function DashboardShell({ children, defaultOpen, session }: DashboardShellProps) {
  const userId = session?.user?.id
  const { data: user } = useUser(userId)
  const { data: resume } = useResumeByUser(userId)
  useNotificationsRealtime(userId)

  const { data: userMetrics } = useUserMetrics(userId, "month")
  const { data: savedJobs } = useSavedJobsByUser(userId, { page: 1, limit: 1 })
  const { data: chats } = useChatsByProfessional(userId)

  const unreadMessages = useMemo(() => {
    if (!chats) return 0
    return chats.reduce((sum, c) => sum + (c.unreadCountProfessional ?? 0), 0)
  }, [chats])

  const navData = useMemo(() => {
    const items = NAV_DATA.navMain.map((item) => ({ ...item }))
    const badges: Record<string, number | undefined> = {
      "/dashboard/messages": unreadMessages > 0 ? unreadMessages : undefined,
      "/dashboard/applications":
        (userMetrics?.quickMetrics?.totalApplications ?? 0) > 0
          ? userMetrics?.quickMetrics?.totalApplications
          : undefined,
      "/dashboard/saved": (savedJobs?.total ?? 0) > 0 ? savedJobs?.total : undefined,
    }
    for (let i = 0; i < items.length; i++) {
      const badge = badges[items[i].url]
      if (items[i].url in badges) {
        items[i] = { ...items[i], badge }
      }
    }
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
    return { ...NAV_DATA, navMain: items, profileProgress }
  }, [user, resume, unreadMessages, userMetrics, savedJobs])

  return (
    <DashboardSessionContext.Provider value={session ?? null}>
      <SidebarProvider className="pt-2 px-2 pb-2 bg-sidebar" defaultOpen={defaultOpen}>
        <DashboardSidebar
          navData={navData}
          logoutRedirect="/login"
          profileUrl="/dashboard/profile"
          avatarUrl={user?.avatar}
          avatarGradient={{ from: "blue-500", to: "purple-600" }}
          profession={user?.profession}
          session={session}
        />
        <SidebarInset
          className="min-h-0 rounded-tl-lg sm:rounded-tl-lg"
          style={{ viewTransitionName: "persistent-nav" }}
        >
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DashboardSessionContext.Provider>
  )
}
