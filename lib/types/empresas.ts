import type { LucideIcon } from "lucide-react"
import type { IconTitleDescription } from "@/lib/types/landing"

export interface FAQItem {
  question: string
  answer: string
}

export interface PlanItem {
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

export interface FeatureATSItem extends IconTitleDescription {
  badge?: string
}

export interface PasoEmpresaItem extends IconTitleDescription {
  number: string
}

export interface HeroStatEmpresaItem {
  icon: LucideIcon
  value: string
  label: string
}
