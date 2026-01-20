"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight, FlaskConical, Target, Users } from "lucide-react"
import { useRef } from "react"
import { Button } from "../../ui/button"

export function HeroEmpresas() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = [
    { icon: Users, value: "+500", label: "profesionales activos" },
    { icon: FlaskConical, value: "+50", label: "especialidades" },
    { icon: Target, value: "100%", label: "enfocado en ciencias" },
  ]

  useGSAP(
    () => {
      if (!heroRef.current) return

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

      gsap.fromTo(
        buttonsRef.current?.children || [],
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
          delay: 0.4,
          stagger: 0.1,
          ease: "back.out(1.3)",
        }
      )

      gsap.fromTo(
        statsRef.current?.children || [],
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      )
    },
    { scope: heroRef }
  )

  const scrollToContacto = () => {
    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 pointer-events-none">
        <div className="absolute -top-24 -left-28 w-[22rem] h-[22rem] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-24 w-[22rem] h-[22rem] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-24 right-8 w-[22rem] h-[22rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-25 blur-3xl" />
        <div className="absolute bottom-24 left-[55%] w-[22rem] h-[22rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-32 left-1/3 w-[22rem] h-[22rem] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-8 right-1/4 w-[22rem] h-[22rem] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-15 blur-3xl" />
        <div className="absolute top-14 left-[60%] w-[22rem] h-[22rem] bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-25 blur-3xl" />
        <div className="absolute bottom-6 left-24 w-[22rem] h-[22rem] bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight font-serif px-2"
          >
            Conecta con el nuevo
            <span
              className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent font-serif"
              style={{ fontFamily: '"Instrument Serif"' }}
            >
              {" "}
              talento científico{" "}
            </span>
            de Chile
          </h1>

          <p
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-sans px-4"
          >
            Simplifica tu proceso de reclutamiento y accede a profesionales cualificados en
            biotecnología, bioquímica, química e ingeniería química.
          </p>

          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg"
              asChild
            >
              <a href="/register/organization">
                Comienza gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 bg-white/50 hover:bg-white border-2 border-gray-200 text-gray-900 text-lg"
              onClick={scrollToContacto}
            >
              Hablar con ventas
            </Button>
          </div>

          <div ref={statsRef} className="flex flex-wrap justify-center gap-8 md:gap-12">
            {stats.map((stat) => {
              const IconComponent = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
