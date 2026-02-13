import type {
  CarreraChartItem,
  ConclusionItem,
  EducacionChartItem,
  IndustriaChartItem,
  RegionChartItem,
  SalariosHeroStatItem,
} from "@/lib/types/salarios"
import { Building2, GraduationCap, MapPin, TrendingUp } from "lucide-react"

export const EDUCACION_CHART_DATA: EducacionChartItem[] = [
  { nivel: "Magíster", promedio: 2550, porcentaje: 34 },
  { nivel: "Doctorado", promedio: 2500, porcentaje: 33 },
  { nivel: "Sin Postgrado", promedio: 1494, porcentaje: 33 },
]

export const EDUCACION_CHART_COLORS = ["#10b981", "#3b82f6", "#6366f1"]

export const REGION_CHART_DATA: RegionChartItem[] = [
  { region: "Antofagasta\n(Norte Minero)", promedio: 2650 },
  { region: "Metropolitana\n(Servicios, Pharma, Tech)", promedio: 1895 },
  { region: "O'Higgins/Maule\n(Agroindustrial)", promedio: 1450 },
]

export const REGION_CHART_COLORS = ["#10b981", "#3b82f6", "#6366f1"]

export const INDUSTRIA_CHART_DATA: IndustriaChartItem[] = [
  { industria: "Minería", minimo: 1800, maximo: 3500, promedio: 2650 },
  { industria: "Tech/Pharma", minimo: 1500, maximo: 3200, promedio: 2350 },
  { industria: "Retail/Pharma", minimo: 1700, maximo: 2400, promedio: 2050 },
  { industria: "Química/Procesos", minimo: 1400, maximo: 2600, promedio: 2000 },
  { industria: "Farmacéutica", minimo: 1200, maximo: 2200, promedio: 1700 },
  { industria: "Agroindustrial", minimo: 1000, maximo: 1900, promedio: 1450 },
  { industria: "Academia/I+D", minimo: 950, maximo: 1800, promedio: 1375 },
]

export const CARRERA_CHART_DATA: CarreraChartItem[] = [
  { carrera: "Bioinformática", junior: 1500, senior: 3200 },
  { carrera: "Ing. Civil Química", junior: 1600, senior: 3050 },
  { carrera: "Química y Farmacia", junior: 1700, senior: 2400 },
  { carrera: "Ing. Biotecnología", junior: 1075, senior: 2000 },
  { carrera: "Ing. Alimentos", junior: 1000, senior: 1900 },
]

export const CONCLUSIONES_SALARIOS: ConclusionItem[] = [
  {
    icon: TrendingUp,
    title: "Sector Polarizado",
    description:
      "Las carreras con mayor componente de Ingeniería Civil y Análisis de Datos (Bioinformática), especialmente aquellas ligadas a la Minería y Tech/Pharma, ofrecen los sueldos más altos.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: MapPin,
    title: "Impacto Regional",
    description:
      "La ubicación geográfica es crucial. Antofagasta (Norte Minero) ofrece los mejores sueldos, seguida de la Región Metropolitana (Servicios, Pharma, Tech).",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: GraduationCap,
    title: "Valor del Postgrado",
    description:
      "La especialización a través de postgrados puede aumentar significativamente el sueldo, especialmente en roles de I+D y Bioinformática.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Building2,
    title: "Recomendación para ATS",
    description:
      "Para empresas que utilizan software ATS, es crucial categorizar los puestos por competencia (ej. 'Bioinformático' o 'Ingeniero de Procesos') más que por el título de pregrado, y ajustar la oferta salarial según la región y el nivel de postgrado requerido.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
]

export const SALARIOS_HERO_STATS: SalariosHeroStatItem[] = [
  { icon: GraduationCap, value: "5", label: "carreras analizadas", color: "#6366f1" },
  { icon: Building2, value: "7", label: "industrias evaluadas", color: "#3b82f6" },
  { icon: MapPin, value: "3", label: "regiones comparadas", color: "#10b981" },
]
