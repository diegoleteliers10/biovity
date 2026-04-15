import type { IconSvgElement } from "@hugeicons/react"

export type EducacionChartItem = {
  nivel: string
  promedio: number
  porcentaje: number
}

export type RegionChartItem = {
  region: string
  promedio: number
}

export type IndustriaChartItem = {
  industria: string
  minimo: number
  maximo: number
  promedio: number
}

export type CarreraChartItem = {
  carrera: string
  junior: number
  senior: number
}

export type ConclusionItem = {
  icon: IconSvgElement
  title: string
  description: string
  color: string
  bgColor: string
}

export type SalariosHeroStatItem = {
  icon: IconSvgElement
  value: string
  label: string
  color: string
}
