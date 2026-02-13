import type { IconSvgElement } from "@hugeicons/react"

export interface StepHomeItem {
  icon: IconSvgElement
  title: string
  description: string
  number: string
}

export interface BenefitHomeItem {
  icon: IconSvgElement
  title: string
  description: string
  gradient: string
}

export interface TransparencyFeatureItem {
  icon: IconSvgElement
  title: string
  description: string
  gradient: string
  iconColor: string
}

export interface CategoryHomeItem {
  icon: IconSvgElement
  title: string
  positions: string
  color: string
  accent: string
}
