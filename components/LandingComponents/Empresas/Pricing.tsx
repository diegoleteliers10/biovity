"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Check } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "../../ui/button"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const planes = [
  {
    name: "Free",
    price: "0",
    period: "para siempre",
    description: "Perfecto para empezar a explorar la plataforma.",
    features: [
      "3 ofertas activas",
      "Acceso limitado a perfiles",
      "1 oferta destacada/mes",
      "Soporte por email",
      "ATS básico",
    ],
    cta: "Comienza gratis",
    href: "/register/organization",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "35.000",
    period: "/mes",
    description: "Para empresas que buscan talento activamente.",
    features: [
      "10 ofertas activas",
      "Acceso completo a perfiles",
      "Filtros avanzados de búsqueda",
      "4 ofertas destacadas/mes",
      "Soporte por email",
      "ATS completo",
    ],
    cta: "Comenzar con Pro",
    href: "/register/organization?plan=pro",
    highlighted: true,
    badge: "Más popular",
  },
  {
    name: "Business",
    price: "75.000",
    period: "/mes",
    description: "Para equipos de RRHH con alto volumen de contratación.",
    features: [
      "20 ofertas activas",
      "Acceso completo a perfiles",
      "Filtros avanzados de búsqueda",
      "10 ofertas destacadas/mes",
      "Soporte email + llamada",
      "ATS completo",
      "AI Matching de candidatos",
      "Página de empresa personalizada",
    ],
    cta: "Comenzar con Business",
    href: "/register/organization?plan=business",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Soluciones a medida para grandes organizaciones.",
    features: [
      "Ofertas ilimitadas",
      "Acceso completo a perfiles",
      "Todas las funcionalidades",
      "Account manager dedicado",
      "Soporte prioritario 24/7",
      "Integraciones personalizadas",
      "Onboarding personalizado",
      "SLA garantizado",
    ],
    cta: "Contactar ventas",
    href: "#contacto",
    highlighted: false,
    isEnterprise: true,
  },
]

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [isAnual, setIsAnual] = useState(false)

  const getPrice = (price: string) => {
    if (price === "0" || price === "Personalizado") return price
    const numPrice = parseInt(price.replace(".", ""))
    if (isAnual) {
      const anualPrice = Math.round(numPrice * 0.8)
      return anualPrice.toLocaleString("es-CL")
    }
    return price
  }

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
        toggleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: toggleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )

      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.1)",
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
    <section ref={sectionRef} className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Planes simples y transparentes
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu empresa.
          </p>
        </div>

        <div ref={toggleRef} className="flex items-center justify-center gap-4 mb-12 relative">
          <span className={`text-sm font-medium ${!isAnual ? "text-gray-900" : "text-gray-500"}`}>
            Mensual
          </span>
          <button
            type="button"
            onClick={() => setIsAnual(!isAnual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isAnual ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={isAnual ? "Cambiar a mensual" : "Cambiar a anual"}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isAnual ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnual ? "text-gray-900" : "text-gray-500"}`}>
            Anual
          </span>
          <span
            className={`absolute left-1/2 translate-x-24 sm:translate-x-28 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full transition-opacity duration-300 ${
              isAnual ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Ahorra 20%
          </span>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planes.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-gray-900 text-white ring-2 ring-blue-500 shadow-xl"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 flex-wrap">
                  {plan.price !== "Personalizado" && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                    >
                      $
                    </span>
                  )}
                  <span
                    className={`font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    } ${plan.price === "Personalizado" ? "text-2xl" : "text-4xl"}`}
                  >
                    {getPrice(plan.price)}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.highlighted ? "text-blue-400" : "text-green-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-12 font-semibold ${
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : plan.isEnterprise
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                asChild
              >
                <a href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Todos los precios en CLP. IVA no incluido. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
