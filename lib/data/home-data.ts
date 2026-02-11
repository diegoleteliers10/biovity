import type {
  BenefitHomeItem,
  CategoryHomeItem,
  StepHomeItem,
  TransparencyFeatureItem,
} from "@/lib/types/home"
import {
  Atom,
  Award,
  Briefcase,
  CheckCircle2,
  Eye,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  Microscope,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  TestTube,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"

export const STEPS_HOME: StepHomeItem[] = [
  {
    icon: UserPlus,
    title: "Crea tu perfil",
    description:
      "Regístrate y configura tu perfil profesional para que las empresas te encuentren.",
    number: "01",
  },
  {
    icon: Search,
    title: "Explora ofertas",
    description:
      "Navega y filtra entre cientos de oportunidades según tu especialidad y preferencias.",
    number: "02",
  },
  {
    icon: FileText,
    title: "Aplica fácil",
    description:
      "Envía tu candidatura con un solo clic y sigue el estado de tus postulaciones en tiempo real.",
    number: "03",
  },
  {
    icon: Award,
    title: "Consigue el trabajo",
    description:
      "Recibe ofertas, conecta con las mejores empresas y da el siguiente paso en tu carrera.",
    number: "04",
  },
]

export const BENEFITS_FOR_STUDENTS: BenefitHomeItem[] = [
  {
    icon: GraduationCap,
    title: "Primer empleo",
    description: "Ofertas diseñadas para recién graduados y estudiantes",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Prácticas profesionales",
    description: "Encuentra oportunidades de prácticas y becas",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Desarrollo profesional",
    description: "Recursos y guías para impulsar tu carrera",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Mentores del sector",
    description: "Conecta con profesionales experimentados",
    gradient: "from-orange-500 to-amber-500",
  },
]

export const TRANSPARENCY_FEATURES: TransparencyFeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "Empresas verificadas",
    description:
      "Todas las empresas pasan por un proceso de verificación antes de publicar ofertas",
    gradient: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500",
  },
  {
    icon: Eye,
    title: "Proceso transparente",
    description: "Conoce todos los detalles del puesto, salario y condiciones antes de aplicar",
    gradient: "from-green-500 to-emerald-500",
    iconColor: "text-green-500",
  },
  {
    icon: CheckCircle2,
    title: "Ofertas reales",
    description: "Garantizamos que cada oferta publicada es una oportunidad real de empleo",
    gradient: "from-purple-500 to-pink-500",
    iconColor: "text-purple-500",
  },
  {
    icon: Handshake,
    title: "Sin costos ocultos",
    description: "Totalmente gratuito para profesionales. Sin comisiones ni cargos ocultos",
    gradient: "from-orange-500 to-amber-500",
    iconColor: "text-orange-500",
  },
]

export const CATEGORIES_HOME: CategoryHomeItem[] = [
  {
    icon: Microscope,
    title: "Biotecnología",
    positions: "345 empleos",
    color: "from-blue-500 to-blue-600",
    accent: "blue",
  },
  {
    icon: TestTube,
    title: "Bioquímica",
    positions: "278 empleos",
    color: "from-green-500 to-green-600",
    accent: "green",
  },
  {
    icon: Atom,
    title: "Química",
    positions: "412 empleos",
    color: "from-purple-500 to-purple-600",
    accent: "purple",
  },
  {
    icon: FlaskConical,
    title: "Ingeniería Química",
    positions: "189 empleos",
    color: "from-orange-500 to-orange-600",
    accent: "orange",
  },
  {
    icon: Stethoscope,
    title: "Salud y Medicina",
    positions: "567 empleos",
    color: "from-red-500 to-red-600",
    accent: "red",
  },
  {
    icon: Pill,
    title: "I+D Farmacéutica",
    positions: "234 empleos",
    color: "from-teal-500 to-teal-600",
    accent: "teal",
  },
]
