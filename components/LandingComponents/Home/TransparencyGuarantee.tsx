"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ShieldCheck, Eye, CheckCircle2, Handshake } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function TransparencyGuarantee() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const features = [
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

  useGSAP(
    () => {
      if (!sectionRef.current) return

      // Animación del header
      gsap.fromTo(
        headerRef.current?.children || [],
        {
          opacity: 0,
          y: 40,
        },
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

      // Animación de las cards
      const cards = cardsRef.current?.querySelectorAll("div[data-card]") || []
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotationY: -10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            100% Transparente
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Empleos reales y verificados
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Sabemos lo importante que es encontrar oportunidades laborales confiables
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.title}
                data-card
                className="relative bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    <IconComponent className={`w-12 h-12 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
