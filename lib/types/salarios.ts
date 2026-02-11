import type { LucideIcon } from "lucide-react"

export interface EducacionChartItem {
  nivel: string
  promedio: number
  porcentaje: number
}

export interface RegionChartItem {
  region: string
  promedio: number
}

export interface IndustriaChartItem {
  industria: string
  minimo: number
  maximo: number
  promedio: number
}

export interface CarreraChartItem {
  carrera: string
  junior: number
  senior: number
}

export interface ConclusionItem {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bgColor: string
}

export interface SalariosHeroStatItem {
  icon: LucideIcon
  value: string
  label: string
  color: string
}
