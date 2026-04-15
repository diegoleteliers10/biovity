/**
 * Dashboard types for employee home page
 */

import type { IconSvgElement } from "@hugeicons/react"

export type NotificationType = "application" | "interview" | "recommendation"

export type Notification = {
  id: number
  title: string
  message: string
  time: string
  isRead: boolean
  type: NotificationType
}

export type Metric = {
  title: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  subtitle?: string
  icon: IconSvgElement
  iconColor?: "primary" | "secondary" | "accent"
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
  candidateEducation?: string
  candidateSkills?: string[]
  candidateYearsOfExperience?: number
  candidateBio?: string
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
