"use client"

import { type ReactNode, useMemo } from "react"
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar"
import { useOnboardingAutoComplete } from "@/hooks/use-onboarding-auto-complete"
import { useChatsByRecruiter } from "@/lib/api/use-chats"
import { useNotificationsRealtime } from "@/lib/api/use-notifications"
import { useOrganization } from "@/lib/api/use-organization"
import { useOrganizationMetrics } from "@/lib/api/use-organization-dashboard"
import { useUser } from "@/lib/api/use-profile"
import type { ServerSession } from "@/lib/auth"
import { NAV_DATA_ORGANIZATION } from "@/lib/data/nav-data"
import { computeOrgProfileCompletion } from "@/lib/utils/profile-completion"
import { DashboardSessionContext } from "../DashboardSessionContext"
import { DashboardSidebar } from "../shared/DashboardSidebar"

type DashboardShellProps = {
  children: ReactNode
  defaultOpen: boolean
  session?: ServerSession | null
}

export function DashboardShellOrganization({
  children,
  defaultOpen,
  session,
}: DashboardShellProps) {
  const userId = session?.user?.id
  const organizationId = (session?.user as { organizationId?: string })?.organizationId
  const { data: user } = useUser(userId)
  const { data: organization } = useOrganization(organizationId)

  useOnboardingAutoComplete()
  useNotificationsRealtime(userId)

  const { data: orgMetrics } = useOrganizationMetrics(organizationId, "month")
  const { data: chats } = useChatsByRecruiter(userId)

  const unreadMessages = useMemo(() => {
    if (!chats) return 0
    return chats.reduce((sum, c) => sum + (c.unreadCountRecruiter ?? 0), 0)
  }, [chats])

  const navData = useMemo(() => {
    const items = NAV_DATA_ORGANIZATION.navMain.map((item) => ({ ...item }))
    const pendingApps = orgMetrics?.dashboard?.pendingApplications ?? 0
    const badges: Record<string, number | undefined> = {
      "/dashboard/applications": pendingApps > 0 ? pendingApps : undefined,
      "/dashboard/messages": unreadMessages > 0 ? unreadMessages : undefined,
    }
    for (let i = 0; i < items.length; i++) {
      const badge = badges[items[i].url]
      if (items[i].url in badges) {
        items[i] = { ...items[i], badge }
      }
    }
    const completion = computeOrgProfileCompletion(organization, user)
    const profileProgress =
      completion?.isComplete === true
        ? null
        : {
            percentage: completion?.percentage ?? 0,
            title: "Perfil Organizacion",
            subtitle: "Completitud",
            actionText: "Completar Perfil",
          }
    return { ...NAV_DATA_ORGANIZATION, navMain: items, profileProgress }
  }, [organization, user, orgMetrics, unreadMessages])

  return (
    <DashboardSessionContext.Provider value={session ?? null}>
      <SidebarProvider className="pt-2 px-2 pb-2 bg-sidebar" defaultOpen={defaultOpen}>
        <DashboardSidebar
          navData={navData}
          logoutRedirect="/login/organization"
          profileUrl="/dashboard/profile"
          avatarGradient={{ from: "purple-500", to: "blue-600" }}
          logoutHoverContrastOnAccent
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
