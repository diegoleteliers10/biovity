"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { UserPlus, Search, FileText, Award } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<HTMLDivElement>(null)
  const steps = [
    {
      icon: UserPlus,
      title: "Crea tu perfil",
      description:
        "Regístrate y configura tu perfil profesional para que las empresas te encuentren.",
      number: "01",
    },
    {
      icon: Search,
      title: "Explora ofertas",
      description:
        "Navega y filtra entre cientos de oportunidades según tu especialidad y preferencias.",
      number: "02",
    },
    {
      icon: FileText,
      title: "Aplica fácil",
      description:
        "Envía tu candidatura con un solo clic y sigue el estado de tus postulaciones en tiempo real.",
      number: "03",
    },
    {
      icon: Award,
      title: "Consigue el trabajo",
      description:
        "Recibe ofertas, conecta con las mejores empresas y da el siguiente paso en tu carrera.",
      number: "04",
    },
  ]

  const StepCard = ({ step, index }: { step: (typeof steps)[0]; index: number }) => {
    const isEven = index % 2 === 0
    const IconComponent = step.icon
    return (
      <div
        className={`flex items-center w-full group ${!isEven ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`w-full md:w-1/2 p-4 ${!isEven ? "md:pr-8 lg:pr-16 md:text-right" : "md:pl-8 lg:pl-16 md:text-left"}`}
        >
          <div className="transform transition-transform duration-500 group-hover:scale-105 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
            {/* Mobile step indicator */}
            <div className="flex items-center mb-4 md:hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-white mr-3">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Paso {step.number}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-500">{step.description}</p>
          </div>
        </div>
      </div>
    )
  }

  const RoadmapLine = () => (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-none hidden md:block"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        width="2"
        height="100%"
        viewBox="0 0 2 1200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Roadmap dashed connecting line</title>
        {Array.from({ length: 30 }).map((_, idx) => {
          const dashHeight = 25
          const dashGap = 15
          const y = idx * (dashHeight + dashGap)
          return (
            <rect
              key={idx}
              x="0"
              y={y}
              width="2"
              height={dashHeight}
              rx="1"
              fill="url(#line-gradient)"
            />
          )
        })}
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )

  const StepMarker = ({ index }: { index: number }) => {
    const IconComponent = steps[index].icon
    const topPosition = `${(index / (steps.length - 1)) * 85 + 7.5}%`

    return (
      <div
        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center"
        style={{ top: topPosition }}
        aria-hidden="true"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
      </div>
    )
  }

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

      // Animación de las cards de pasos
      const stepCards = stepsRef.current?.querySelectorAll("[data-step-card]") || []
      gsap.fromTo(
        stepCards,
        {
          opacity: 0,
          x: (index) => (index % 2 === 0 ? -100 : 100),
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      )

      const markers = markersRef.current?.querySelectorAll("div") || []
      gsap.fromTo(
        markers,
        {
          opacity: 0,
          scale: 0,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: markersRef.current,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Tu Camino hacia el Éxito Profesional
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            En solo 4 simples pasos, estarás más cerca del trabajo de tus sueños en el sector
            biotecnológico.
          </p>
        </div>

        <div className="relative">
          <RoadmapLine />
          <div ref={stepsRef} className="relative z-10 flex flex-col gap-8 md:gap-0">
            {steps.map((step, index) => (
              <div key={step.number} data-step-card>
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>
          <div ref={markersRef} className="hidden md:block">
            {steps.map((step) => (
              <StepMarker key={step.number} index={parseInt(step.number) - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
