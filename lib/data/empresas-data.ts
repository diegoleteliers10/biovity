import {
  BrainIcon,
  Building02Icon,
  Building03Icon,
  Chemistry01Icon,
  Clock01Icon,
  FileSearchIcon,
  FilterIcon,
  MailSend01Icon,
  Message01Icon,
  Search01Icon,
  Shield01Icon,
  SparklesIcon,
  Target01Icon,
  Tick02Icon,
  TradeUpIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import type {
  FAQItem,
  FeatureATSItem,
  HeroStatEmpresaItem,
  PasoEmpresaItem,
  PlanItem,
} from "@/lib/types/empresas"
import type { IconTitleDescription } from "@/lib/types/landing"

export const FAQS_EMPRESAS: FAQItem[] = [
  {
    question: "¿Puedo probar Biovity gratis?",
    answer:
      "Sí, contamos con un plan Free que te permite publicar tus primeras ofertas, recibir postulaciones y explorar perfiles de profesionales de biociencias sin necesidad de ingresar tarjeta de crédito.",
  },
  {
    question: "¿Qué diferencia a Biovity de un portal de empleo tradicional?",
    answer:
      "A diferencia de portales genéricos, Biovity está 100% especializado en biotecnología, bioquímica, química, farmacia e ingeniería en Chile. Nuestros filtros capturan técnicas de laboratorio, certificaciones (GMP, GLP, ISO), líneas de I+D y posgrados.",
  },
  {
    question: "¿Cómo funciona el ATS integrado?",
    answer:
      "Nuestro sistema de gestión de candidatos (ATS) te permite centralizar todo el flujo: publicación de vacantes, recepción y filtrado de CVs, evaluación en tablero Kanban, notas del equipo y comunicación directa con los postulantes.",
  },
  {
    question: "¿Qué incluye el AI Matching para perfiles científicos?",
    answer:
      "Analiza semánticamente los requerimientos técnicos de tu vacante (técnicas analíticas, equipamiento, experiencia de laboratorio) y clasifica automáticamente los candidatos con mayor afinidad.",
  },
  {
    question: "¿Puedo cambiar de plan o cancelar en cualquier momento?",
    answer:
      "Sí, puedes actualizar, reducir o cancelar tu suscripción en cualquier momento desde tu panel de organización sin penalizaciones ni contratos de permanencia obligatoria.",
  },
  {
    question: "¿Ofrecen condiciones especiales para startups bio o universidades?",
    answer:
      "Sí, tenemos programas de apoyo y descuentos preferenciales para startups en etapa temprana, centros de investigación y laboratorios universitarios. Contáctanos para activarlo.",
  },
]

export const PLANES_EMPRESAS: PlanItem[] = [
  {
    name: "Free",
    price: "0",
    period: "para siempre",
    description: "Para explorar la plataforma y publicar vacantes puntuales.",
    features: [
      "Hasta 2 ofertas activas simultáneas",
      "Acceso a postulaciones y CVs completos",
      "Panel ATS básico",
      "Soporte estándar por email",
    ],
    cta: "Comenzar gratis",
    href: "/register/organization",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "40.000",
    period: "/mes",
    description: "Para empresas y laboratorios con procesos de contratación regulares.",
    features: [
      "Hasta 8 ofertas activas simultáneas",
      "Búsqueda activa en la base de talentos",
      "Filtros avanzados por técnicas y posgrados",
      "2 ofertas destacadas al mes",
      "AI Matching de candidatos",
      "Soporte prioritario por email y chat",
    ],
    cta: "Comenzar con Pro",
    href: "/register/organization?plan=pro",
    highlighted: true,
    badge: "Recomendado",
  },
  {
    name: "Business",
    price: "80.000",
    period: "/mes",
    description: "Para equipos de RRHH y empresas biotecnológicas en fase de escalamiento.",
    features: [
      "Hasta 20 ofertas activas simultáneas",
      "Acceso ilimitado a búsqueda de talentos",
      "5 ofertas destacadas al mes",
      "Perfil de empresa personalizado",
      "Evaluación colaborativa de candidatos",
      "Reportes de rendimiento de vacantes",
      "Soporte preferente dedicado",
    ],
    cta: "Comenzar con Business",
    href: "/register/organization?plan=business",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Soluciones a medida para corporaciones, consorcios y centros de I+D.",
    features: [
      "Ofertas activas ilimitadas",
      "Pipeline y flujos de aprobación personalizados",
      "Integraciones con ATS corporativo / HRIS",
      "Account Manager y onboarding dedicado",
      "SLA de servicio y soporte prioritario 24/7",
      "Facturación corporativa personalizada",
    ],
    cta: "Contactar a ventas",
    href: "#contacto",
    highlighted: false,
    isEnterprise: true,
  },
]

export const FEATURES_ATS: FeatureATSItem[] = [
  {
    icon: Search01Icon,
    title: "Publicación de vacantes STEM",
    description:
      "Publica en minutos con campos especializados para técnicas experimentales, equipamiento y certificaciones de laboratorio.",
  },
  {
    icon: UserMultiple02Icon,
    title: "Base de talento verificado",
    description:
      "Accede a perfiles validados de bioquímicos, biotecnólogos, farmacéuticos e ingenieros en todo Chile.",
  },
  {
    icon: FilterIcon,
    title: "Filtros científicos avanzados",
    description:
      "Segmenta por líneas de investigación, nivel educativo (licenciatura, magíster, doctorado) y normativas técnicas.",
  },
  {
    icon: TradeUpIcon,
    title: "Pipeline visual tipo Kanban",
    description:
      "Gestiona a tus postulantes de manera ágil arrastrando tarjetas entre etapas de revisión, entrevista y oferta.",
  },
  {
    icon: Message01Icon,
    title: "Comunicación directa",
    description:
      "Envía actualizaciones de estado y coordina entrevistas directamente desde la plataforma sin fricciones.",
  },
  {
    icon: Building02Icon,
    title: "Página corporativa",
    description:
      "Muestra la cultura, proyectos de I+D y beneficios de tu organización para atraer a los mejores candidatos.",
  },
  {
    icon: SparklesIcon,
    title: "Ofertas destacadas",
    description:
      "Multiplica el alcance de tus vacantes críticas con posicionamiento prioritario y difusión en la comunidad.",
  },
  {
    icon: BrainIcon,
    title: "AI Matching de candidatos",
    description:
      "Clasificación inteligente que sugiere los perfiles con mayor compatibilidad técnica para cada cargo.",
    badge: "Pro",
  },
]

export const PASOS_EMPRESAS: PasoEmpresaItem[] = [
  {
    icon: Building03Icon,
    title: "Crea tu perfil de empresa",
    description:
      "Configura tu cuenta corporativa y presenta tu organización ante la mayor comunidad científica del país.",
    number: "01",
  },
  {
    icon: MailSend01Icon,
    title: "Publica tus vacantes",
    description:
      "Define los requisitos técnicos específicos y activa tu búsqueda en pocos minutos con alcance focalizado.",
    number: "02",
  },
  {
    icon: FileSearchIcon,
    title: "Evalúa en el ATS integrado",
    description:
      "Revisa postulaciones con CVs formateados, filtra por habilidades clave y coordina etapas con tu equipo.",
    number: "03",
  },
  {
    icon: Tick02Icon,
    title: "Contrata con precisión",
    description:
      "Conecta con los profesionales idóneos, agenda entrevistas y cierra contrataciones sin intermediarios.",
    number: "04",
  },
]

export type BeneficioEmpresaItem = IconTitleDescription

export const BENEFICIOS_EMPRESAS: BeneficioEmpresaItem[] = [
  {
    icon: UserMultiple02Icon,
    title: "Talento 100% Calificado",
    description:
      "Candidatos con formación real en biociencias, control de calidad, bioprocesos, ensayos y regulación.",
  },
  {
    icon: Clock01Icon,
    title: "Menor Tiempo de Contratación",
    description:
      "Reduce semanas en tus procesos eliminando filtros manuales sobre cientos de CVs no afines al rubro.",
  },
  {
    icon: Search01Icon,
    title: "Búsqueda Directa y Proactiva",
    description:
      "Contacta perfiles técnicos de alto interés antes de que inicien una búsqueda activa en el mercado.",
  },
  {
    icon: Shield01Icon,
    title: "Validación y Rigor",
    description:
      "Perfiles con verificación de formación académica y experiencia técnica para contrataciones confiables.",
  },
]

export const HERO_STATS_EMPRESAS: HeroStatEmpresaItem[] = [
  { icon: Chemistry01Icon, value: "15+", label: "Especialidades STEM" },
  { icon: Target01Icon, value: "100%", label: "Enfoque en ciencias" },
  { icon: Building03Icon, value: "+50", label: "Empresas e instituciones" },
]

export type EmpresaLogoItem = {
  name: string
  logo: string
}

export const LOGOS_EMPRESAS: EmpresaLogoItem[] = []

export type TestimonioEmpresaItem = {
  quote: string
  author: string
  role: string
  company: string
  image?: string
}

export const TESTIMONIOS_EMPRESAS: TestimonioEmpresaItem[] = []
