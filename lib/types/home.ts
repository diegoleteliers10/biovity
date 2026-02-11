import type { LucideIcon } from "lucide-react"

export interface StepHomeItem {
  icon: LucideIcon
  title: string
  description: string
  number: string
}

export interface BenefitHomeItem {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export interface TransparencyFeatureItem {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  iconColor: string
}

export interface CategoryHomeItem {
  icon: LucideIcon
  title: string
  positions: string
  color: string
  accent: string
}
