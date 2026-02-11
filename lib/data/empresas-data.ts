import type {
  FAQItem,
  FeatureATSItem,
  HeroStatEmpresaItem,
  PlanItem,
  PasoEmpresaItem,
} from "@/lib/types/empresas"
import type { IconTitleDescription } from "@/lib/types/landing"
import {
  BarChart3,
  Brain,
  Building2,
  Building2 as Building2Step,
  Clock,
  Filter,
  FileSearch,
  FlaskConical,
  MessageSquare,
  Search,
  Send,
  Shield,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react"

export const FAQS_EMPRESAS: FAQItem[] = [
  {
    question: "¿Puedo probar Biovity gratis?",
    answer:
      "Sí, ofrecemos un plan gratuito que incluye 3 ofertas activas, acceso limitado a perfiles y 1 oferta destacada al mes. Puedes comenzar sin tarjeta de crédito.",
  },
  {
    question: "¿Cómo funciona el ATS integrado?",
    answer:
      "Nuestro ATS te permite gestionar todo el proceso de selección desde un solo lugar. Puedes publicar ofertas, recibir candidaturas, filtrar perfiles, programar entrevistas y comunicarte con candidatos directamente desde la plataforma.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y se prorratea el cobro según los días restantes de tu ciclo de facturación.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria y Webpay. Para planes Enterprise, también ofrecemos facturación mensual.",
  },
  {
    question: "¿Qué incluye el AI Matching?",
    answer:
      "El AI Matching analiza los requisitos de tus ofertas y te sugiere candidatos que mejor se ajustan basándose en experiencia, habilidades y preferencias. Disponible en planes Business y Enterprise.",
  },
  {
    question: "¿Cómo es el soporte para empresas?",
    answer:
      "El plan Free y Pro incluyen soporte por email. Business añade soporte telefónico. Enterprise cuenta con un account manager dedicado y soporte prioritario 24/7.",
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer:
      "Sí, puedes cancelar en cualquier momento desde tu panel de control. Tu cuenta seguirá activa hasta el final del período de facturación actual.",
  },
  {
    question: "¿Ofrecen descuentos para startups o instituciones académicas?",
    answer:
      "Sí, tenemos programas especiales para startups en etapa temprana e instituciones académicas. Contáctanos para más información sobre nuestros descuentos.",
  },
]

export const PLANES_EMPRESAS: PlanItem[] = [
  {
    name: "Free",
    price: "0",
    period: "para siempre",
    description: "Perfecto para empezar a explorar la plataforma.",
    features: [
      "3 ofertas activas",
      "Acceso limitado a perfiles",
      "1 oferta destacada/mes",
      "Soporte por email",
      "ATS básico",
    ],
    cta: "Comienza gratis",
    href: "/register/organization",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "35.000",
    period: "/mes",
    description: "Para empresas que buscan talento activamente.",
    features: [
      "10 ofertas activas",
      "Acceso completo a perfiles",
      "Filtros avanzados de búsqueda",
      "4 ofertas destacadas/mes",
      "Soporte por email",
      "ATS completo",
    ],
    cta: "Comenzar con Pro",
    href: "/register/organization?plan=pro",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Business",
    price: "75.000",
    period: "/mes",
    description: "Para equipos de RRHH con alto volumen de contratación.",
    features: [
      "20 ofertas activas",
      "Acceso completo a perfiles",
      "Filtros avanzados de búsqueda",
      "10 ofertas destacadas/mes",
      "Soporte email + llamada",
      "ATS completo",
      "AI Matching de candidatos",
      "Página de empresa personalizada",
    ],
    cta: "Comenzar con Business",
    href: "/register/organization?plan=business",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Soluciones a medida para grandes organizaciones.",
    features: [
      "Ofertas ilimitadas",
      "Acceso completo a perfiles",
      "Todas las funcionalidades",
      "Account manager dedicado",
      "Soporte prioritario 24/7",
      "Integraciones personalizadas",
      "Onboarding personalizado",
      "SLA garantizado",
    ],
    cta: "Contactar ventas",
    href: "#contacto",
    highlighted: false,
    isEnterprise: true,
  },
]

export const FEATURES_ATS: FeatureATSItem[] = [
  {
    icon: Search,
    title: "Publicación de ofertas",
    description:
      "Publica ofertas de trabajo en minutos con plantillas optimizadas para el sector científico.",
  },
  {
    icon: Users,
    title: "Base de candidatos",
    description: "Accede a perfiles verificados de profesionales en biotecnología, química y más.",
  },
  {
    icon: Filter,
    title: "Filtros avanzados",
    description: "Encuentra candidatos por especialidad, experiencia, ubicación y disponibilidad.",
  },
  {
    icon: BarChart3,
    title: "Pipeline visual",
    description:
      "Gestiona candidatos con un tablero Kanban intuitivo. Arrastra y suelta entre etapas.",
  },
  {
    icon: MessageSquare,
    title: "Comunicación integrada",
    description: "Envía mensajes y programa entrevistas directamente desde la plataforma.",
  },
  {
    icon: Building2,
    title: "Página de empresa",
    description: "Crea tu perfil de empresa para mostrar tu cultura, beneficios y ofertas activas.",
  },
  {
    icon: Sparkles,
    title: "Ofertas destacadas",
    description: "Aumenta la visibilidad de tus ofertas y aparece primero en las búsquedas.",
  },
  {
    icon: Brain,
    title: "AI Matching",
    description: "Sugerencias inteligentes de candidatos basadas en los requisitos de tus ofertas.",
    badge: "Pro",
  },
]

export const PASOS_EMPRESAS: PasoEmpresaItem[] = [
  {
    icon: Building2Step,
    title: "Crea tu cuenta de empresa",
    description:
      "Regístrate gratis y configura el perfil de tu empresa para atraer al mejor talento.",
    number: "01",
  },
  {
    icon: Send,
    title: "Publica tus ofertas",
    description:
      "Crea ofertas de trabajo detalladas y publícalas en minutos. Llega a cientos de profesionales.",
    number: "02",
  },
  {
    icon: FileSearch,
    title: "Gestiona candidatos",
    description:
      "Usa nuestro ATS integrado para filtrar, evaluar y hacer seguimiento de candidatos fácilmente.",
    number: "03",
  },
  {
    icon: UserCheck,
    title: "Contrata al mejor",
    description:
      "Conecta con los candidatos ideales, agenda entrevistas y realiza la contratación perfecta.",
    number: "04",
  },
]

export type BeneficioEmpresaItem = IconTitleDescription

export const BENEFICIOS_EMPRESAS: BeneficioEmpresaItem[] = [
  {
    icon: Users,
    title: "Talento especializado",
    description:
      "Accede a profesionales cualificados en biotecnología, bioquímica, química e ingeniería química.",
  },
  {
    icon: Clock,
    title: "Ahorra tiempo",
    description:
      "Nuestro ATS integrado simplifica todo el proceso de selección, desde la publicación hasta la contratación.",
  },
  {
    icon: Search,
    title: "Búsqueda proactiva",
    description:
      "Encuentra candidatos antes de que busquen trabajo. Accede a nuestra base de perfiles verificados.",
  },
  {
    icon: Shield,
    title: "Calidad garantizada",
    description:
      "Perfiles verificados y enfocados 100% en el sector científico. Sin ruido, solo talento relevante.",
  },
]

export const HERO_STATS_EMPRESAS: HeroStatEmpresaItem[] = [
  { icon: Users, value: "+500", label: "profesionales activos" },
  { icon: FlaskConical, value: "+50", label: "especialidades" },
  { icon: Target, value: "100%", label: "enfocado en ciencias" },
]
