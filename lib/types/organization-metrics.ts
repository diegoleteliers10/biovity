export type MetricsPeriod = "week" | "month" | "year" | "custom"

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
  avgTimeInStages: {
    entrevista: number
    oferta: number
    contratado: number
  }
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

export type GeographicDistributionEntry = {
  city: string
  count: number
  percentage: number
}

export type OrganizationMetrics = {
  dashboard: DashboardMetrics
  pipeline: PipelineMetrics
  topJobs: TopJobMetrics[]
  recentTrend: RecentTrendMetrics[]
  geographicDistribution: GeographicDistributionEntry[]
  avgHiringTimeDays: number
  recruiterProductivity: RecruiterProductivityEntry[]
}

export type RecruiterProductivityEntry = {
  userId: string
  userName: string
  userEmail: string
  applicationsProcessed: number
  interviewsConducted: number
  avgResponseTimeDays: number
}

export type OrganizationMetricsFilters = {
  period?: MetricsPeriod
  startDate?: string
  endDate?: string
}
