"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)

  const benefits = [
    "Acceso a ofertas exclusivas",
    "Perfil destacado para recruiters",
    "Alertas personalizadas",
    "Recursos para tu carrera",
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
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )

      // Animación de los botones
      const buttons = buttonsRef.current?.querySelectorAll("button") || []
      gsap.fromTo(
        buttons,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )

      // Animación de los beneficios
      const benefitItems = benefitsRef.current?.querySelectorAll("div") || []
      gsap.fromTo(
        benefitItems,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={headerRef}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            Únete a miles de profesionales que ya encontraron su camino en la ciencia
          </p>
        </div>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            type="button"
            className="inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button
            type="button"
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            Soy empresa
          </button>
        </div>

        <div ref={benefitsRef} className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center text-gray-500">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
