"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchOrgFeaturedCandidates,
  fetchOrgMetrics,
  fetchOrgNotifications,
  fetchOrgRecentMessages,
  fetchOrgUpcomingInterviews,
} from "@/lib/data/organization-dashboard-data"
import { getApplicationsByOrganization } from "@/lib/api/applications"

export const orgDashboardKeys = {
  notifications: ["org", "notifications"] as const,
  metrics: ["org", "metrics"] as const,
  recentApplications: ["org", "recentApplications"] as const,
  recentMessages: ["org", "recentMessages"] as const,
  upcomingInterviews: ["org", "upcomingInterviews"] as const,
  featuredCandidates: ["org", "featuredCandidates"] as const,
}

export function useOrgNotifications() {
  return useQuery({
    queryKey: orgDashboardKeys.notifications,
    queryFn: fetchOrgNotifications,
  })
}

export function useOrgMetrics(organizationId: string | undefined) {
  return useQuery({
    queryKey: orgDashboardKeys.metrics,
    queryFn: fetchOrgMetrics,
    enabled: Boolean(organizationId),
  })
}

export function useOrgRecentApplications(organizationId: string | undefined) {
  return useQuery({
    queryKey: orgDashboardKeys.recentApplications,
    queryFn: async () => {
      if (!organizationId) throw new Error("Organization ID required")

      const applicationsResult = await getApplicationsByOrganization(organizationId, { limit: 10 })
      if ("error" in applicationsResult) throw new Error(applicationsResult.error)

      const applications = applicationsResult.data

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

export function useOrgUpcomingInterviews() {
  return useQuery({
    queryKey: orgDashboardKeys.upcomingInterviews,
    queryFn: fetchOrgUpcomingInterviews,
  })
}

export function useOrgFeaturedCandidates() {
  return useQuery({
    queryKey: orgDashboardKeys.featuredCandidates,
    queryFn: fetchOrgFeaturedCandidates,
  })
}
