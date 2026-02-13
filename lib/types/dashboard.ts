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
