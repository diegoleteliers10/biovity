import { Clock, Target, Heart } from "lucide-react"
import type { IconTitleDescription } from "@/lib/types/landing"

export type ValorItem = IconTitleDescription

export const VALUES_DATA: ValorItem[] = [
  {
    icon: Target,
    title: "Misión",
    description:
      "Conectar talento científico con oportunidades significativas en el sector de biociencias.",
  },
  {
    icon: Clock,
    title: "Visión",
    description:
      "Ser la comunidad líder de unificación de recursos para profesionales de ciencias en Latinoamérica.",
  },
  {
    icon: Heart,
    title: "Valores",
    description: "Transparencia, calidad, innovación y comunidad científica.",
  },
]
