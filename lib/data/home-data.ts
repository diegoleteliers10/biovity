import {
  Agreement01Icon,
  Atom01Icon,
  Award01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  Chemistry01Icon,
  EyeIcon,
  File02Icon,
  GraduationScrollIcon,
  MicroscopeIcon,
  PillIcon,
  Search01Icon,
  Shield01Icon,
  StethoscopeIcon,
  TestTubeIcon,
  TradeUpIcon,
  UserAdd01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import type {
  BenefitHomeItem,
  CategoryHomeItem,
  StepHomeItem,
  TransparencyFeatureItem,
} from "@/lib/types/home"

export const STEPS_HOME: StepHomeItem[] = [
  {
    icon: UserAdd01Icon,
    title: "Crea tu perfil",
    description:
      "Regístrate y configura tu perfil profesional para que las empresas te encuentren.",
    number: "01",
  },
  {
    icon: Search01Icon,
    title: "Explora ofertas",
    description:
      "Navega y filtra entre cientos de oportunidades según tu especialidad y preferencias.",
    number: "02",
  },
  {
    icon: File02Icon,
    title: "Aplica fácil",
    description:
      "Envía tu candidatura con un solo clic y sigue el estado de tus postulaciones en tiempo real.",
    number: "03",
  },
  {
    icon: Award01Icon,
    title: "Consigue el trabajo",
    description:
      "Recibe ofertas, conecta con las mejores empresas y da el siguiente paso en tu carrera.",
    number: "04",
  },
]

export const BENEFITS_FOR_STUDENTS: BenefitHomeItem[] = [
  {
    icon: GraduationScrollIcon,
    title: "Primer empleo",
    description: "Ofertas diseñadas para recién graduados y estudiantes",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase01Icon,
    title: "Prácticas profesionales",
    description: "Encuentra oportunidades de prácticas y becas",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: TradeUpIcon,
    title: "Desarrollo profesional",
    description: "Recursos y guías para impulsar tu carrera",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: UserMultiple02Icon,
    title: "Mentores del sector",
    description: "Conecta con profesionales experimentados",
    gradient: "from-orange-500 to-amber-500",
  },
]

export const TRANSPARENCY_FEATURES: TransparencyFeatureItem[] = [
  {
    icon: Shield01Icon,
    title: "Empresas verificadas",
    description:
      "Todas las empresas pasan por un proceso de verificación antes de publicar ofertas",
    gradient: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500",
  },
  {
    icon: EyeIcon,
    title: "Proceso transparente",
    description: "Conoce todos los detalles del puesto, salario y condiciones antes de aplicar",
    gradient: "from-green-500 to-emerald-500",
    iconColor: "text-green-500",
  },
  {
    icon: CheckmarkCircle02Icon,
    title: "Ofertas reales",
    description: "Garantizamos que cada oferta publicada es una oportunidad real de empleo",
    gradient: "from-purple-500 to-pink-500",
    iconColor: "text-purple-500",
  },
  {
    icon: Agreement01Icon,
    title: "Sin costos ocultos",
    description: "Totalmente gratuito para profesionales. Sin comisiones ni cargos ocultos",
    gradient: "from-orange-500 to-amber-500",
    iconColor: "text-orange-500",
  },
]

export const CATEGORIES_HOME: CategoryHomeItem[] = [
  {
    icon: MicroscopeIcon,
    title: "Biotecnología",
    positions: "345 empleos",
    color: "from-blue-500 to-blue-600",
    accent: "blue",
  },
  {
    icon: TestTubeIcon,
    title: "Bioquímica",
    positions: "278 empleos",
    color: "from-green-500 to-green-600",
    accent: "green",
  },
  {
    icon: Atom01Icon,
    title: "Química",
    positions: "412 empleos",
    color: "from-purple-500 to-purple-600",
    accent: "purple",
  },
  {
    icon: Chemistry01Icon,
    title: "Ingeniería Química",
    positions: "189 empleos",
    color: "from-orange-500 to-orange-600",
    accent: "orange",
  },
  {
    icon: StethoscopeIcon,
    title: "Salud y Medicina",
    positions: "567 empleos",
    color: "from-red-500 to-red-600",
    accent: "red",
  },
  {
    icon: PillIcon,
    title: "I+D Farmacéutica",
    positions: "234 empleos",
    color: "from-teal-500 to-teal-600",
    accent: "teal",
  },
]
