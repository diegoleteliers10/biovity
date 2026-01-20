"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// TODO: Reemplazar con logos reales de empresas clientes
const placeholderLogos = [
  { name: "Empresa 1", logo: "/logos/empresa1.svg" },
  { name: "Empresa 2", logo: "/logos/empresa2.svg" },
  { name: "Empresa 3", logo: "/logos/empresa3.svg" },
  { name: "Empresa 4", logo: "/logos/empresa4.svg" },
  { name: "Empresa 5", logo: "/logos/empresa5.svg" },
  { name: "Empresa 6", logo: "/logos/empresa6.svg" },
]

export function LogosEmpresas() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const logosRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )

      gsap.fromTo(
        logosRef.current?.children || [],
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: logosRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          ref={titleRef}
          className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider"
        >
          Empresas que confían en nosotros
        </p>
        <div ref={logosRef} className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {placeholderLogos.map((company) => (
            <div
              key={company.name}
              className="w-24 h-12 md:w-32 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              {/* TODO: Reemplazar con <Image src={company.logo} alt={company.name} /> */}
              <span className="text-xs text-gray-400 font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
