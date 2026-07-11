/**
 * Dashboard types for employee home page
 */

import type { IconSvgElement } from "@hugeicons/react"

export type NotificationType = "application" | "interview" | "message" | "job_alert" | "system"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  body?: string
  link?: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export type Metric = {
  title: string
  value: string | number
  trend?: number | string
  trendPositive?: boolean
  subtitle?: string
  icon: IconSvgElement
  iconColor?: "primary" | "secondary" | "accent"
  href?: string
}

export type RecentApplication = {
  jobTitle: string
  company: string
  dateApplied: string
  status: string
  statusColor: string
}

export type OrganizationRecentApplication = {
  candidateName: string
  position: string
  dateApplied: string
  status: string
  statusColor: string
}

export type ApplicationStage = "pendiente" | "entrevista" | "oferta" | "contratado" | "rechazado"

export type Applicant = {
  id: string
  candidateId: string
  candidateName: string
  position: string
  dateApplied: string
  stage: ApplicationStage
  avatar?: string | null
  candidateEducation?: string
  candidateSkills?: string[]
  candidateYearsOfExperience?: number
  candidateBio?: string
  salaryMin?: number | null
  salaryMax?: number | null
  isSaved?: boolean
  tags?: { id: string; name: string; color: string }[]
  evaluationRating?: "positive" | "neutral" | "negative" | null
}

export type OfferWithApplicants = {
  id: string
  title: string
  location: string
  status: "activa" | "cerrada" | "borrador"
  publishedAt: string
  applicants: Applicant[]
}

export type RecentMessage = {
  sender: string
  time: string
  preview: string
}

export type Job = {
  id: number
  jobTitle: string
  company: string
  location: string
  salary: string
  postedTime: string
  compatibility: number
  tags: string[]
  additionalTags: number
  isSaved: boolean
}
