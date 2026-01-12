"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Briefcase, MapPin, Search } from "lucide-react"
import { useRef } from "react"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!heroRef.current) return

      // Animación del título
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        }
      )

      // Animación del subtítulo
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
        }
      )

      // Animación de la card de búsqueda
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "back.out(1.2)",
        }
      )
    },
    { scope: heroRef }
  )

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-20 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute top-40 left-1/4 w-72 h-72 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-10 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-25 blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight font-serif px-2"
          >
            Donde el talento y la
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent font-serif" style={{ fontFamily: '"Instrument Serif"' }}>
              {" "}
              ciencia{" "}
            </span>
            se encuentran
          </h1>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-sans px-4"
          >
            Ayudamos a profesionales y estudiantes a encontrar trabajo y oportunidades en biotecnología,
            bioquímica, química, ingeniería química y salud.
          </p>

          <Card ref={cardRef} className="p-4 sm:p-6 max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="¿Qué puesto buscas?"
                  className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="¿Dónde?"
                  className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <Button
                size="lg"
                className="h-12 px-6 sm:px-8 bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-8 px-4">
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white text-xs sm:text-sm">
              <Briefcase className="w-4 h-4 mr-2" />
              Para Profesionales
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white text-xs sm:text-sm">
              <Search className="w-4 h-4 mr-2" />
              Para Empresas
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
