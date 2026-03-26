"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchOrgFeaturedCandidates,
  fetchOrgMetrics,
  fetchOrgNotifications,
  fetchOrgRecentApplications,
  fetchOrgRecentMessages,
  fetchOrgUpcomingInterviews,
} from "@/lib/data/organization-dashboard-data"

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

export function useOrgMetrics() {
  return useQuery({
    queryKey: orgDashboardKeys.metrics,
    queryFn: fetchOrgMetrics,
  })
}

export function useOrgRecentApplications() {
  return useQuery({
    queryKey: orgDashboardKeys.recentApplications,
    queryFn: fetchOrgRecentApplications,
  })
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
