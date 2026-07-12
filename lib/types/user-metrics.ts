import type { MetricsPeriod } from "@/lib/types/organization-metrics"

export type UserQuickMetrics = {
  totalApplications: number
  activeApplications: number
  responseRate: number
}

export type UserKpis = {
  applicationsLast30Days: number
  interviews: number
  offers: number
  avgResponseTimeDays: number | null
  profileViews: number
}

export type ApplicationsTrendEntry = {
  date: string
  applications: number
}

export type ResponseTimeDistribution = {
  lessThan24h: number
  oneToThreeDays: number
  threeToSevenDays: number
  moreThanSevenDays: number
}

export type HiringFunnelStep = {
  count: number
  percentage: number
}

export type HiringFunnel = {
  aplicado: HiringFunnelStep
  entrevista: HiringFunnelStep
  oferta: HiringFunnelStep
  contratado: HiringFunnelStep
}

export type CategoryApplied = {
  category: string
  count: number
  percentage: number
}

export type UserMetrics = {
  quickMetrics: UserQuickMetrics
  kpis: UserKpis
  applicationsTrend: ApplicationsTrendEntry[]
  responseTimeDistribution: ResponseTimeDistribution
  hiringFunnel: HiringFunnel
  categoriesApplied: CategoryApplied[]
}

export type UserMetricsFilters = {
  period?: MetricsPeriod
}
