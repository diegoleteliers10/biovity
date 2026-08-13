import type { IconSvgElement } from "@hugeicons/react"

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

export type SalariosHeroStatItem = {
  icon: IconSvgElement
  value: string
  label: string
  color: string
}

// --- Chilean market option types (Give-to-Get form & filters) ---

export type RegionChile =
  | "ARICA_Y_PARINACOTA"
  | "TARAPACA"
  | "ANTOFAGASTA"
  | "ATACAMA"
  | "COQUIMBO"
  | "VALPARAISO"
  | "METROPOLITANA"
  | "OHIGGINS"
  | "MAULE"
  | "NUBLE"
  | "BIOBIO"
  | "ARAUCANIA"
  | "LOS_RIOS"
  | "LOS_LAGOS"
  | "AYSEN"
  | "MAGALLANES"

export type ExperienceLevelChile = "JUNIOR" | "MID" | "SENIOR" | "LEAD"

export type EducationLevelChile = "LICENCIATURA" | "MAGISTER" | "DOCTORADO" | "POSTDOC"

export type WorkModeChile = "PRESENCIAL" | "HIBRIDO" | "REMOTO"

export type OptionItem<T extends string = string> = {
  value: T
  label: string
}

// --- Upskilling impact & career trajectory ---

export type SkillImpactItem = {
  skill: string
  description: string
  impactMin: number
  impactMax: number
  sector: string
  icon: IconSvgElement
  color: string
  bgColor: string
}

export type CareerTrajectoryItem = {
  level: ExperienceLevelChile
  label: string
  yearsRange: string
  monthlyClp: number
  description: string
}

// --- B2B salary bands ---

export type SalaryBandItem = {
  career: string
  juniorMin: number
  juniorMax: number
  seniorMin: number
  seniorMax: number
  note?: string
}
