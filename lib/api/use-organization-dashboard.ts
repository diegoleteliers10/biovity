"use client"

import { BubbleChatIcon, Calendar03Icon, File02Icon, FileAddIcon } from "@hugeicons/core-free-icons"
import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { getApplicationsByOrganization } from "@/lib/api/applications"
import { getEvents } from "@/lib/api/events"
import { getOrganizationMetrics } from "@/lib/api/organization-metrics"
import { getUser } from "@/lib/api/users"
import {
  fetchOrgFeaturedCandidates,
  fetchOrgNotifications,
  fetchOrgRecentMessages,
} from "@/lib/data/organization-dashboard-data"
import { getResultErrorMessage } from "@/lib/result"
import type { Metric } from "@/lib/types/dashboard"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"

export const orgDashboardKeys = {
  notifications: ["org", "notifications"] as const,
  metrics: ["org", "metrics"] as const,
  recentApplications: ["org", "recentApplications"] as const,
  recentMessages: ["org", "recentMessages"] as const,
  upcomingInterviews: ["org", "upcomingInterviews"] as const,
  featuredCandidates: ["org", "featuredCandidates"] as const,
}

export type UpcomingInterview = {
  id: string
  candidateName: string
  candidateAvatar?: string | null
  position: string
  date: string
  time: string
  type: "Videollamada" | "Presencial"
  meetingUrl?: string | null
  location?: string | null
  applicationId?: string
}

export function useOrgNotifications() {
  return useQuery({
    queryKey: orgDashboardKeys.notifications,
    queryFn: fetchOrgNotifications,
  })
}

const DEFAULT_DASHBOARD_METRICS = {
  activeJobs: 0,
  pendingApplications: 0,
  interviewsThisPeriod: 0,
  interviewsTrend: 0,
  applicationsTrend: 0,
}

export function useOrgMetrics(organizationId: string | undefined) {
  return useQuery({
    queryKey: orgDashboardKeys.metrics,
    queryFn: async () => {
      const result = await getOrganizationMetrics(organizationId!, { period: "month" })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return getMetricsCards(result.value.dashboard, false)
    },
    enabled: Boolean(organizationId),
    staleTime: 60 * 1000,
    refetchOnMount: true,
  })
}

export function useOrganizationMetrics(
  organizationId: string | undefined,
  period: MetricsPeriod = "month"
) {
  return useQuery({
    queryKey: ["org", "fullMetrics", organizationId, period] as const,
    queryFn: async () => {
      if (!organizationId) {
        return {
          dashboard: DEFAULT_DASHBOARD_METRICS,
          pipeline: {
            totalApplications: 0,
            byStatus: { pendiente: 0, oferta: 0, entrevista: 0, rechazado: 0, contratado: 0 },
            conversionRate: 0,
          },
          topJobs: [],
          recentTrend: [],
        }
      }
      const result = await getOrganizationMetrics(organizationId, { period })
      if (!Result.isOk(result)) {
        return {
          dashboard: DEFAULT_DASHBOARD_METRICS,
          pipeline: {
            totalApplications: 0,
            byStatus: { pendiente: 0, oferta: 0, entrevista: 0, rechazado: 0, contratado: 0 },
            conversionRate: 0,
          },
          topJobs: [],
          recentTrend: [],
        }
      }
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}

export function getMetricsCards(
  dashboard: {
    activeJobs: number
    pendingApplications: number
    interviewsThisPeriod: number
    interviewsTrend: number
    applicationsTrend: number
  },
  isLoading: boolean
): Metric[] {
  if (isLoading) {
    return [
      {
        title: "Ofertas Activas",
        value: "-",
        icon: FileAddIcon,
        subtitle: "cargando...",
        href: "/dashboard/ofertas",
      },
      {
        title: "Postulaciones Nuevas",
        value: "-",
        icon: File02Icon,
        subtitle: "cargando...",
        href: "/dashboard/applications",
      },
      {
        title: "Entrevistas",
        value: "-",
        icon: Calendar03Icon,
        subtitle: "cargando...",
        href: "/dashboard/calendar",
      },
    ]
  }

  return [
    {
      title: "Ofertas Activas",
      value: dashboard.activeJobs,
      icon: FileAddIcon,
      subtitle: "publicadas",
      href: "/dashboard/ofertas",
    },
    {
      title: "Postulaciones Nuevas",
      value: dashboard.pendingApplications,
      icon: File02Icon,
      trend: `${dashboard.applicationsTrend > 0 ? "+" : ""}${dashboard.applicationsTrend}%`,
      trendPositive: dashboard.applicationsTrend >= 0,
      subtitle: "este mes",
      href: "/dashboard/applications",
    },
    {
      title: "Entrevistas",
      value: dashboard.interviewsThisPeriod,
      icon: Calendar03Icon,
      trend: `${dashboard.interviewsTrend > 0 ? "+" : ""}${dashboard.interviewsTrend}%`,
      trendPositive: dashboard.interviewsTrend >= 0,
      subtitle: "este mes",
      href: "/dashboard/calendar",
    },
  ]
}

export function useOrgRecentApplications(organizationId: string | undefined) {
  return useQuery({
    queryKey: orgDashboardKeys.recentApplications,
    queryFn: async () => {
      if (!organizationId) throw new Error("Organization ID required")

      const applicationsResult = await getApplicationsByOrganization(organizationId, { limit: 10 })
      if (!Result.isOk(applicationsResult))
        throw new Error(getResultErrorMessage(applicationsResult.error))

      const applications = applicationsResult.value.data

      return applications.map((app) => ({
        candidateName: app.candidate?.name ?? "Candidato",
        position: app.job?.title ?? "Sin título",
        dateApplied: new Date(app.createdAt).toLocaleDateString("es-CL", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: app.status,
        statusColor: getStatusColor(app.status),
      }))
    },
    enabled: Boolean(organizationId),
  })
}

function getStatusColor(status: string): string {
  switch (status) {
    case "nuevo":
    case "pendiente":
      return "bg-secondary/10 text-secondary border border-secondary/20"
    case "entrevista":
      return "bg-primary/10 text-primary border border-primary/20"
    case "oferta":
      return "bg-accent/10 text-accent border border-accent/20"
    case "rechazado":
      return "bg-destructive/10 text-destructive border border-destructive/20"
    case "contratado":
      return "bg-green-500/10 text-green-600 border border-green-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function useOrgRecentMessages() {
  return useQuery({
    queryKey: orgDashboardKeys.recentMessages,
    queryFn: fetchOrgRecentMessages,
  })
}

export function useOrgUpcomingInterviews(userId: string | undefined) {
  return useQuery({
    queryKey: orgDashboardKeys.upcomingInterviews,
    queryFn: async () => {
      const now = new Date().toISOString()
      const result = await getEvents({
        organizerId: userId,
        type: "interview",
        status: "scheduled",
        from: now,
        limit: 10,
      })

      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))

      const events = result.value.data

      if (events.length === 0) return []

      const sortedEvents = [...events].sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      )

      const candidateIds = sortedEvents
        .map((e) => (e as { candidateId?: string }).candidateId)
        .filter(Boolean) as string[]

      const uniqueCandidateIds = [...new Set(candidateIds)]

      const candidateQueries = await Promise.all(
        uniqueCandidateIds.map(async (id) => {
          const res = await getUser(id)
          if (!Result.isOk(res)) return { id, name: "Candidato", avatar: null }
          return { id, name: res.value.name, avatar: res.value.avatar }
        })
      )

      const candidateMap: Record<string, { name: string; avatar: string | null }> = {}
      candidateQueries.forEach((c) => {
        candidateMap[c.id] = { name: c.name, avatar: c.avatar }
      })

      return sortedEvents.slice(0, 2).map((event) => {
        const e = event as {
          id: string
          candidateId?: string
          applicationId?: string
          startAt: string
          location?: string
          meetingUrl?: string
        }
        const candidate = e.candidateId ? candidateMap[e.candidateId] : null
        const startDate = new Date(e.startAt)

        const isVideo = e.meetingUrl || !e.location
        const dateStr = startDate.toLocaleDateString("es-CL", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        const timeStr = startDate.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })

        return {
          id: e.id,
          candidateName: candidate?.name ?? "Candidato",
          candidateAvatar: candidate?.avatar ?? null,
          position: "Entrevista",
          date: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
          time: timeStr,
          type: (isVideo ? "Videollamada" : "Presencial") as "Videollamada" | "Presencial",
          meetingUrl: e.meetingUrl ?? null,
          location: e.location ?? null,
          applicationId: e.applicationId,
        } satisfies UpcomingInterview
      })
    },
    enabled: Boolean(userId),
  })
}

export function useOrgFeaturedCandidates() {
  return useQuery({
    queryKey: orgDashboardKeys.featuredCandidates,
    queryFn: fetchOrgFeaturedCandidates,
  })
}
