import type { IconSvgElement } from "@hugeicons/react"
import type { IconTitleDescription } from "@/lib/types/landing"

export type HeroStatReclutamiento = {
  value: string
  label: string
  sublabel?: string
}

export type HerramientaActual = {
  title: string
  category: string
  examples: string
  icon: IconSvgElement
  comoSeUsa: string
  limitaciones: string[]
  tag: string
}

export type FriccionWorkflow = IconTitleDescription & {
  impacto: string
  sintomaComun: string
}

export type DiferenciadorBiovity = IconTitleDescription & {
  tag: string
  ventajaTecnica: string
  metricaClave?: string
}

export type MatrizComparativaItem = {
  criterio: string
  descripcion: string
  biovity: {
    status: boolean | "parcial"
    detalle: string
  }
  atsTradicional: {
    status: boolean | "parcial"
    detalle: string
  }
  portalesMasivos: {
    status: boolean | "parcial"
    detalle: string
  }
  headhunters: {
    status: boolean | "parcial"
    detalle: string
  }
}

export type FlujoEtapa = {
  numero: string
  fase: string
  tradicional: {
    titulo: string
    descripcion: string
    tiempo: string
  }
  biovity: {
    titulo: string
    descripcion: string
    tiempo: string
    destacado: string
  }
}

export type ReclutamientoFAQItem = {
  question: string
  answer: string
  category?: string
}
