"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRef } from "react"
import { getUserMetrics, incrementProfileViews } from "@/lib/api/user-metrics"
import { getResultErrorMessage } from "@/lib/result"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
import type { UserMetrics } from "@/lib/types/user-metrics"

export const userMetricsKeys = {
  all: ["user", "metrics"] as const,
  byPeriod: (userId: string, period: MetricsPeriod) => ["user", "metrics", userId, period] as const,
  profileViews: (userId: string) => ["user", "profileViews", userId] as const,
}

const DEFAULT_USER_METRICS: UserMetrics = {
  quickMetrics: {
    totalApplications: 0,
    activeApplications: 0,
    responseRate: 0,
  },
  kpis: {
    applicationsLast30Days: 0,
    responseRate: 0,
    interviews: 0,
    offers: 0,
    avgResponseTimeDays: 0,
    profileViews: 0,
  },
  applicationsTrend: [],
  responseTimeDistribution: {
    lessThan24h: 0,
    oneToThreeDays: 0,
    threeToSevenDays: 0,
    moreThanSevenDays: 0,
  },
  hiringFunnel: {
    aplicado: { count: 0, percentage: 0 },
    entrevista: { count: 0, percentage: 0 },
    oferta: { count: 0, percentage: 0 },
    contratado: { count: 0, percentage: 0 },
  },
  industriesApplied: [],
  upcomingInterviews: [],
  recentApplications: [],
}

export function useUserMetrics(userId: string | undefined, period: MetricsPeriod = "month") {
  return useQuery({
    queryKey: userMetricsKeys.byPeriod(userId ?? "", period),
    queryFn: async () => {
      if (!userId) return DEFAULT_USER_METRICS
      const result = await getUserMetrics(userId, { period })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  })
}

export function useIncrementProfileViews() {
  const queryClient = useQueryClient()
  const pendingRef = useRef<Set<string>>(new Set())

  return useMutation({
    mutationFn: async (userId: string) => {
      if (pendingRef.current.has(userId)) return null
      pendingRef.current.add(userId)

      const result = await incrementProfileViews(userId)
      pendingRef.current.delete(userId)

      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (data, userId) => {
      if (!data) return
      queryClient.setQueryData(userMetricsKeys.byPeriod(userId, "month"), (old: unknown) => {
        if (!old || typeof old !== "object") return old
        const o = old as Record<string, unknown>
        if (!o.kpis || typeof o.kpis !== "object") return old
        return {
          ...old,
          kpis: {
            ...(o.kpis as Record<string, unknown>),
            profileViews: data.views,
          },
        }
      })
    },
  })
}
