"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Building2, FileSearch, Send, UserCheck } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const pasos = [
  {
    icon: Building2,
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

export function ComoFuncionaEmpresas() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

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
        stepsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Cómo funciona para empresas
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            En solo 4 pasos, estarás contratando al talento científico que tu empresa necesita.
          </p>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pasos.map((paso) => {
            const IconComponent = paso.icon
            return (
              <div key={paso.number} className="relative group">
                <div className="bg-gray-50 rounded-2xl p-6 h-full border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-gray-100 group-hover:text-blue-100 transition-colors duration-300">
                      {paso.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{paso.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{paso.description}</p>
                </div>
                {/* Connector line for desktop */}
                {paso.number !== "04" && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
