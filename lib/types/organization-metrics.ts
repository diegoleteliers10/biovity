export type MetricsPeriod = "week" | "month" | "year" | "custom"

export type StageDurationVisitPage = {
  rows: {
    visitId: string
    applicationId: string
    applicantName: string
    enteredAt: string
    exitedAt: string
    durationDays: number
  }[]
  total: number
  page: number
  pageSize: number
}

export type CustomStageConversion = {
  jobId: string
  jobTitle: string
  stageId: string
  stageName: string
  enteredApplications: number
  advancedApplications: number
  conversionRate: number
}

export type CustomStageApplicationPage = {
  rows: {
    applicationId: string
    applicantName: string
    stageNameAtEntry: string | null
    firstEnteredAt: string
    advanced: boolean
    currentStatus: string
  }[]
  total: number
  page: number
  pageSize: number
}

export type ResponseTimeBucket =
  | "lessThan24h"
  | "oneToThreeDays"
  | "threeToSevenDays"
  | "moreThanSevenDays"
  | "unanswered"

export type ResponseTimeVisitPage = {
  rows: {
    applicationId: string
    jobId: string
    applicantName: string
    jobTitle: string
    submittedAt: string
    respondedAt: string | null
    responseDays: number | null
    currentStatus: string
  }[]
  total: number
  page: number
  pageSize: number
}

export type SourceApplicationPage = {
  rows: {
    applicationId: string
    jobId: string
    jobTitle: string
    candidateName: string
    status: string
    appliedAt: string
  }[]
  total: number
  page: number
  pageSize: number
}

export type DashboardMetrics = {
  activeJobs: number
  pendingApplications: number
  interviewsThisPeriod: number
  interviewsTrend: number
  applicationsTrend: number
}

export type PipelineMetrics = {
  totalApplications: number
  reachedCounts: {
    entrevista: number
    oferta: number
    contratado: number
  }
  byStatus: {
    pendiente: number
    oferta: number
    entrevista: number
    rechazado: number
    contratado: number
  }
  conversionRate: number
  customStageConversions: CustomStageConversion[]
  stageDurations: {
    jobId: string
    jobTitle: string
    stageId: string
    stageName: string
    averageCompletedDays: number
    completedVisitCount: number
  }[]
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

export type ResponseTimeDistribution = {
  lessThan24h: number
  oneToThreeDays: number
  threeToSevenDays: number
  moreThanSevenDays: number
}

export type OrganizationMetrics = {
  dashboard: DashboardMetrics
  pipeline: PipelineMetrics
  topJobs: TopJobMetrics[]
  recentTrend: RecentTrendMetrics[]
  geographicDistribution: GeographicDistributionEntry[]
  avgHiringTimeDays: number
  recruiterProductivity: RecruiterProductivityEntry[]
  responseTimeDistribution?: ResponseTimeDistribution
  unansweredCount?: number
  sourceAttribution?: ApplicationSourceAttribution[]
}

import type {
  ApplicationSourceChannel,
  ApplicationSourceMethod,
} from "@/lib/types/application-source"

export type ApplicationSourceAttribution = {
  sourceChannel: ApplicationSourceChannel
  sourceMethod: ApplicationSourceMethod
  applications: number
  reachedInterview: number
  hired: number
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
