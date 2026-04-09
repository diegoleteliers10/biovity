export type MetricsPeriod = "week" | "month" | "year"

export interface DashboardMetrics {
  activeJobs: number
  pendingApplications: number
  interviewsThisPeriod: number
  interviewsTrend: number
  applicationsTrend: number
}

export interface PipelineMetrics {
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

export interface TopJobMetrics {
  jobId: string
  jobTitle: string
  views: number
  applications: number
  applicationRate: number
}

export interface RecentTrendMetrics {
  date: string
  applications: number
  interviews: number
}

export interface OrganizationMetrics {
  dashboard: DashboardMetrics
  pipeline: PipelineMetrics
  topJobs: TopJobMetrics[]
  recentTrend: RecentTrendMetrics[]
}

export interface OrganizationMetricsFilters {
  period?: MetricsPeriod
}
