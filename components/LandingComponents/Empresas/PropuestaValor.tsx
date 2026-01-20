"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Clock, Search, Shield, Users } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const beneficios = [
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

export function PropuestaValor() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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
        cardsRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
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
            ¿Por qué elegir Biovity?
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            La plataforma diseñada para conectar empresas con el mejor talento científico de Chile.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((beneficio) => {
            const IconComponent = beneficio.icon
            return (
              <div
                key={beneficio.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{beneficio.title}</h3>
                <p className="text-gray-500 leading-relaxed">{beneficio.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
