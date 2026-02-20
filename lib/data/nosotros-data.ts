import { Clock01Icon, FavouriteIcon, Link01Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/** Values section item using HugeIcons (Misión, Visión, Valores) */
export interface ValorItem {
  icon: IconSvgElement
  title: string
  description: string
}

export const VALUES_DATA: ValorItem[] = [
  {
    icon: Link01Icon,
    title: "Misión",
    description:
      "Conectar talento científico con oportunidades significativas en el sector de biociencias.",
  },
  {
    icon: Clock01Icon,
    title: "Visión",
    description:
      "Ser la comunidad líder de unificación de recursos para profesionales de ciencias en Latinoamérica.",
  },
  {
    icon: FavouriteIcon,
    title: "Valores",
    description: "Transparencia, calidad, innovación y comunidad científica.",
  },
]
