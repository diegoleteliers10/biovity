import type { MetricsPeriod } from "@/lib/types/organization-metrics"

export type UserQuickMetrics = {
  totalApplications: number
  activeApplications: number
  responseRate: number
}

export type UserKpis = {
  applicationsLast30Days: number
  responseRate: number
  interviews: number
  offers: number
  avgResponseTimeDays: number
  profileViews: number
}

export type ApplicationsTrendEntry = {
  month: string
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

export type IndustryApplied = {
  industry: string
  count: number
  percentage: number
}

export type UpcomingInterview = {
  eventId: string
  title: string
  startAt: string
  jobId: string
  jobTitle: string
  organizationId: string
  organizationName: string
}

export type RecentApplication = {
  applicationId: string
  jobTitle: string
  organizationName: string
  status: string
  appliedAt: string
}

export type UserMetrics = {
  quickMetrics: UserQuickMetrics
  kpis: UserKpis
  applicationsTrend: ApplicationsTrendEntry[]
  responseTimeDistribution: ResponseTimeDistribution
  hiringFunnel: HiringFunnel
  industriesApplied: IndustryApplied[]
  upcomingInterviews: UpcomingInterview[]
  recentApplications: RecentApplication[]
}

export type UserMetricsFilters = {
  period?: MetricsPeriod
}
