import {
  AiChemistry01Icon,
  Book01Icon,
  CodeIcon,
  GraduationScrollIcon,
  MicroscopeIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type StatItem = {
  value: string
  label: string
}

export type BenefitItem = {
  icon: IconSvgElement
  title: string
  description: string
}

export type CategoryItem = {
  slug: string
  name: string
  description: string
  icon: IconSvgElement
  capsuleCount: number
}

export const APRENDE_STATS: StatItem[] = [
  { value: "2", label: "Cápsulas disponibles" },
  { value: "5", label: "Preguntas por certificado" },
  { value: "70%", label: "Mínimo para aprobar" },
]

export const APRENDE_BENEFITS: BenefitItem[] = [
  {
    icon: CodeIcon,
    title: "Programación aplicada",
    description:
      "Aprende Python, R y herramientas bioinformáticas con ejemplos reales del sector biocientífico.",
  },
  {
    icon: MicroscopeIcon,
    title: "Contenido científico",
    description:
      "Cada cápsula está diseñada por profesionales del sector con experiencia en biotecnología y bioinformática.",
  },
  {
    icon: GraduationScrollIcon,
    title: "Certificado verificable",
    description:
      "Al completar una cápsula y aprobar el quiz, obtienes un certificado PDF con tu nombre y fecha.",
  },
  {
    icon: SparklesIcon,
    title: "A tu ritmo",
    description:
      "Estudia cuando quieras, desde cualquier dispositivo. Cada cápsula dura entre 15 y 30 minutos.",
  },
]

export const APRENDE_CATEGORIES: CategoryItem[] = [
  {
    slug: "bioinformatica",
    name: "Bioinformática",
    description:
      "Herramientas de programación para análisis de datos biológicos: secuencias, genómica y más.",
    icon: Book01Icon,
    capsuleCount: 1,
  },
  {
    slug: "ia-biotech",
    name: "IA y Biotech",
    description:
      "Agentes de IA para el laboratorio: prompting, proyectos con Claude y OpenCode, análisis automatizados.",
    icon: AiChemistry01Icon,
    capsuleCount: 1,
  },
]

export const APRENDE_CTA = {
  title: "¿Listo para aprender?",
  description:
    "Empieza con nuestra primera cápsula y obtén tu primer certificado en bioinformática.",
  button: {
    text: "Ver cápsulas",
    href: "/aprende/bioinformatica",
  },
}
