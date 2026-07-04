import type { IconSvgElement } from "@hugeicons/react"

export type StepHomeItem = {
  icon: IconSvgElement
  title: string
  description: string
  number: string
}

export type BenefitHomeItem = {
  icon: IconSvgElement
  title: string
  description: string
  gradient: string
}

export type TransparencyFeatureItem = {
  icon: IconSvgElement
  title: string
  description: string
  gradient: string
  iconColor: string
}

export type CategoryHomeItem = {
  id: string
  icon: IconSvgElement
  title: string
  positions: string
  color: string
  accent: string
}
