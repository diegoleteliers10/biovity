export type MetricsPeriod = "week" | "month" | "year"

export type DashboardMetrics = {
  activeJobs: number
  pendingApplications: number
  interviewsThisPeriod: number
  interviewsTrend: number
  applicationsTrend: number
}

export type PipelineMetrics = {
  totalApplications: number
  byStatus: {
    pendiente: number
    oferta: number
    entrevista: number
    rechazado: number
    contratado: number
  }
  conversionRate: number
}

export type TopJobMetrics = {
  jobId: string
  jobTitle: string
  views: number
  applications: number
  applicationRate: number
}

export type RecentTrendMetrics = {
  date: string
  applications: number
  interviews: number
}

export type OrganizationMetrics = {
  dashboard: DashboardMetrics
  pipeline: PipelineMetrics
  topJobs: TopJobMetrics[]
  recentTrend: RecentTrendMetrics[]
}

export type OrganizationMetricsFilters = {
  period?: MetricsPeriod
}
