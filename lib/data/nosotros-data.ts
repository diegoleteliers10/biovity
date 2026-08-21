import {
  Atom01Icon,
  Award01Icon,
  Building02Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
  MicroscopeIcon,
  Shield01Icon,
  SparklesIcon,
  Target01Icon,
  TradeUpIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type ValorItem = {
  icon: IconSvgElement
  title: string
  subtitle: string
  description: string
}

export type StatItem = {
  value: string
  label: string
  sublabel: string
}

export type ProblemaSolucionItem = {
  icon: IconSvgElement
  title: string
  description: string
}

export const NOSOTROS_STATS: StatItem[] = [
  {
    value: "+500",
    label: "Profesionales y científicos",
    sublabel: "En la red activa en Chile",
  },
  {
    value: "100%",
    label: "Datos y ofertas verificadas",
    sublabel: "Sin vacantes fantasma",
  },
  {
    value: "15+",
    label: "Especialidades STEM",
    sublabel: "Biotecnología, Farma y Salud",
  },
  {
    value: "2026",
    label: "Año de fundación",
    sublabel: "Nacidos en Chile para Latam",
  },
]

export const VALUES_DATA: ValorItem[] = [
  {
    icon: Target01Icon,
    title: "Misión",
    subtitle: "Conexión de impacto",
    description:
      "Conectar a profesionales, graduados e investigadores de biociencias con oportunidades laborales transparentes y de alto valor en Chile.",
  },
  {
    icon: SparklesIcon,
    title: "Visión",
    subtitle: "Ecosistema referente",
    description:
      "Convertirnos en la plataforma e infraestructura líder de movilidad profesional y datos salariales del sector biotecnológico y científico en Latinoamérica.",
  },
  {
    icon: Shield01Icon,
    title: "Valores",
    subtitle: "Rigor y transparencia",
    description:
      "Transparencia salarial radical, rigor científico en cada proceso, ética en el manejo de datos y compromiso con el desarrollo de la ciencia local.",
  },
]

export const PILARES_BIOVITY = [
  {
    icon: EyeIcon,
    title: "Transparencia Radical",
    description:
      "Promovemos que las ofertas incluyan rangos salariales explícitos y condiciones reales de contratación para terminar con la asimetría informativa.",
  },
  {
    icon: MicroscopeIcon,
    title: "Especialización Científica",
    description:
      "Entendemos la diferencia entre biología molecular, química analítica, ensayos clínicos y bioinformática. Filtros diseñados para la ciencia real.",
  },
  {
    icon: UserMultiple02Icon,
    title: "Comunidad y Transferencia",
    description:
      "Impulsamos la vinculación entre universidades, centros de I+D y la industria productiva para evitar la fuga de talentos calificados.",
  },
]

export const DESAFIOS_MERCADO: ProblemaSolucionItem[] = [
  {
    icon: EyeIcon,
    title: "Opacidad y asimetría salarial",
    description:
      "Profesionales con años de posgrado y formación avanzada desconocen el valor real de sus competencias en el mercado privado.",
  },
  {
    icon: Building02Icon,
    title: "Ofertas dispersas y genéricas",
    description:
      "Las vacantes técnicas se diluyen en portales masivos sin filtros por técnicas experimentales, normativas (GMP/GLP) ni equipamiento.",
  },
  {
    icon: Atom01Icon,
    title: "Desconexión academia-industria",
    description:
      "Dificultad para que doctores, magísteres e investigadores inserten sus capacidades en startups biotecnológicas y laboratorios innovadores.",
  },
]

export const SOLUCIONES_BIOVITY: ProblemaSolucionItem[] = [
  {
    icon: TradeUpIcon,
    title: "Benchmark salarial abierto y anónimo",
    description:
      "El primer dataset colaborativo de sueldos STEM en Chile, segmentado por especialidad, años de experiencia y región.",
  },
  {
    icon: CheckmarkCircle02Icon,
    title: "Bolsa de empleo 100% especializada",
    description:
      "Plataforma dedicada exclusivamente a biociencias, salud y tecnología, con verificación de empresas y seguimiento en tiempo real.",
  },
  {
    icon: Award01Icon,
    title: "Perfiles técnicos para científicos",
    description:
      "Diseñados para destacar publicaciones, técnicas analíticas, bioprocesos y habilidades de laboratorio que los portales tradicionales ignoran.",
  },
]
