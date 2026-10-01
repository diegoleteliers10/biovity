import {
  Atom01Icon,
  Chemistry01Icon,
  MicroscopeIcon,
  PillIcon,
  StethoscopeIcon,
  TestTubeIcon,
} from "@hugeicons/core-free-icons"
import type { CategoryHomeItem } from "@/lib/types/home"

export const CATEGORIES_HOME: CategoryHomeItem[] = [
  {
    icon: MicroscopeIcon,
    id: "Biotecnología",
    title: "Biotecnología",
    positions: "Explorar ofertas",
    color: "from-blue-500 to-blue-600",
    accent: "blue",
  },
  {
    icon: TestTubeIcon,
    id: "Bioquímica",
    title: "Bioquímica",
    positions: "Explorar ofertas",
    color: "from-green-500 to-green-600",
    accent: "green",
  },
  {
    icon: Atom01Icon,
    id: "Química",
    title: "Química",
    positions: "Explorar ofertas",
    color: "from-purple-500 to-purple-600",
    accent: "purple",
  },
  {
    icon: Chemistry01Icon,
    id: "Ingeniería Química",
    title: "Ingeniería Química",
    positions: "Explorar ofertas",
    color: "from-orange-500 to-orange-600",
    accent: "orange",
  },
  {
    icon: StethoscopeIcon,
    id: "Salud y Medicina",
    title: "Salud y Medicina",
    positions: "Explorar ofertas",
    color: "from-red-500 to-red-600",
    accent: "red",
  },
  {
    icon: PillIcon,
    id: "I+D Farmacéutica",
    title: "I+D Farmacéutica",
    positions: "Explorar ofertas",
    color: "from-teal-500 to-teal-600",
    accent: "teal",
  },
]
