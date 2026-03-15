/**
 * Dashboard types for employee home page
 */

import type { IconSvgElement } from "@hugeicons/react"

export type NotificationType = "application" | "interview" | "recommendation"

export interface Notification {
  id: number
  title: string
  message: string
  time: string
  isRead: boolean
  type: NotificationType
}

export interface Metric {
  title: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  subtitle?: string
  icon: IconSvgElement
}

export interface RecentApplication {
  jobTitle: string
  company: string
  dateApplied: string
  status: string
  statusColor: string
}

export interface OrganizationRecentApplication {
  candidateName: string
  position: string
  dateApplied: string
  status: string
  statusColor: string
}

export type ApplicationStage = "pendiente" | "entrevista" | "oferta" | "contratado" | "rechazado"

export interface Applicant {
  id: string
  candidateName: string
  position: string
  dateApplied: string
  stage: ApplicationStage
}

export interface OfferWithApplicants {
  id: string
  title: string
  location: string
  status: "activa" | "cerrada" | "borrador"
  publishedAt: string
  applicants: Applicant[]
}

export interface RecentMessage {
  sender: string
  time: string
  preview: string
}

export interface Job {
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
