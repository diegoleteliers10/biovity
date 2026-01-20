"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Quote } from "lucide-react"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// TODO: Reemplazar con testimonios reales de clientes
const testimonios = [
  {
    quote:
      "Biovity nos ayudó a encontrar un investigador senior en tiempo récord. La calidad de los candidatos es excelente.",
    author: "María González",
    role: "Directora de RRHH",
    company: "Laboratorio XYZ",
    image: "/testimonials/persona1.jpg",
  },
  {
    quote:
      "El ATS es muy intuitivo y nos ha permitido reducir el tiempo de contratación en un 40%. Muy recomendable.",
    author: "Carlos Rodríguez",
    role: "Gerente de Talento",
    company: "Biotech Chile",
    image: "/testimonials/persona2.jpg",
  },
  {
    quote:
      "Por fin una plataforma enfocada en nuestro sector. Los filtros por especialidad son exactamente lo que necesitábamos.",
    author: "Andrea Muñoz",
    role: "CEO",
    company: "Pharma Solutions",
    image: "/testimonials/persona3.jpg",
  },
]

export function Testimonios() {
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
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Empresas que ya confían en Biovity para encontrar talento científico.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.author}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonio.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                {/* TODO: Reemplazar con imagen real */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {testimonio.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonio.author}</p>
                  <p className="text-sm text-gray-500">
                    {testimonio.role} en {testimonio.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
