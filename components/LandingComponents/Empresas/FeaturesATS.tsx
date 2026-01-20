"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  BarChart3,
  Brain,
  Building2,
  Filter,
  MessageSquare,
  Search,
  Sparkles,
  Users,
} from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
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

export function FeaturesATS() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )

      gsap.fromTo(
        featuresRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Un ATS completo diseñado para simplificar tu proceso de reclutamiento científico.
          </p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group relative"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
