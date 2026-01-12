"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Atom,
  ChevronRight,
  FlaskConical,
  Microscope,
  Pill,
  Stethoscope,
  TestTube,
} from "lucide-react"
import { useRef } from "react"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const categories = [
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

      // Animación de las cards con efecto de flip
      const cards = cardsRef.current?.querySelectorAll("[data-card]") || []
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          rotationX: -20,
          scale: 0.85,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "back.out(1.4)",
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
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Explora Oportunidades
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Encuentra tu próximo desafío profesional en las áreas más innovadoras de la ciencia
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.title}
                data-card
                className="group p-6 cursor-pointer border-0 bg-white"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {category.title}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm">{category.positions}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all px-8 py-3"
          >
            Ver todas las especialidades
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
