"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronDown } from "lucide-react"
import { useRef, useState } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const faqs = [
  {
    question: "¿Puedo probar Biovity gratis?",
    answer:
      "Sí, ofrecemos un plan gratuito que incluye 3 ofertas activas, acceso limitado a perfiles y 1 oferta destacada al mes. Puedes comenzar sin tarjeta de crédito.",
  },
  {
    question: "¿Cómo funciona el ATS integrado?",
    answer:
      "Nuestro ATS te permite gestionar todo el proceso de selección desde un solo lugar. Puedes publicar ofertas, recibir candidaturas, filtrar perfiles, programar entrevistas y comunicarte con candidatos directamente desde la plataforma.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y se prorratea el cobro según los días restantes de tu ciclo de facturación.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria y Webpay. Para planes Enterprise, también ofrecemos facturación mensual.",
  },
  {
    question: "¿Qué incluye el AI Matching?",
    answer:
      "El AI Matching analiza los requisitos de tus ofertas y te sugiere candidatos que mejor se ajustan basándose en experiencia, habilidades y preferencias. Disponible en planes Business y Enterprise.",
  },
  {
    question: "¿Cómo es el soporte para empresas?",
    answer:
      "El plan Free y Pro incluyen soporte por email. Business añade soporte telefónico. Enterprise cuenta con un account manager dedicado y soporte prioritario 24/7.",
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer:
      "Sí, puedes cancelar en cualquier momento desde tu panel de control. Tu cuenta seguirá activa hasta el final del período de facturación actual.",
  },
  {
    question: "¿Ofrecen descuentos para startups o instituciones académicas?",
    answer:
      "Sí, tenemos programas especiales para startups en etapa temprana e instituciones académicas. Contáctanos para más información sobre nuestros descuentos.",
  },
]

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        faqsRef.current?.children || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqsRef.current,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-gray-500">
            Todo lo que necesitas saber sobre Biovity para empresas.
          </p>
        </div>

        <div ref={faqsRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
