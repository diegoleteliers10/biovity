import type { IconSvgElement } from "@hugeicons/react"
import type { IconTitleDescription } from "@/lib/types/landing"

export type FAQItem = {
  question: string
  answer: string
}

export type PlanItem = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  highlighted: boolean
  badge?: string
  isEnterprise?: boolean
}

export type FeatureATSItem = IconTitleDescription & {
  badge?: string
}

export type PasoEmpresaItem = IconTitleDescription & {
  number: string
}

export type HeroStatEmpresaItem = {
  icon: IconSvgElement
  value: string
  label: string
}
