"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getSpringTransition, getTransition } from "@/lib/animations"
import { CONSEJOS_FAQS } from "@/lib/data/consejos-carrera-data"

export function ConsejosFAQ() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const t = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={t(0)}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Preguntas Frecuentes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
            Preguntas Frecuentes sobre Desarrollo Profesional
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto text-pretty">
            Respuestas directas a las dudas más comunes al ingresar o avanzar en la industria
            biotecnológica y científica.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={ts(0.1)}
          className="rounded-xl border border-border bg-surface-container-lowest overflow-hidden p-4 sm:p-6 shadow-none"
        >
          <Accordion type="single" collapsible className="border-0">
            {CONSEJOS_FAQS.map((faq, idx) => (
              <AccordionItem key={faq.question} value={`item-${idx}`} className="border-border">
                <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground py-4 hover:no-underline hover:text-secondary transition-colors text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  )
}
