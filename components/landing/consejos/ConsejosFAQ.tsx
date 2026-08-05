"use client"

import { HelpCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CONSEJOS_FAQS } from "@/lib/data/consejos-carrera-data"

export function ConsejosFAQ() {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            <HugeiconsIcon icon={HelpCircleIcon} className="size-4" />
            <span>Resuelve tus Dudas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preguntas Frecuentes sobre Desarrollo Profesional
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Respuestas directas a las inquietudes más comunes al insertarse o progresar en el mercado de biociencias.
          </p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease }}
          className="rounded-2xl border border-border/80 bg-surface-container-lowest overflow-hidden p-4 sm:p-6 shadow-xs"
        >
          <Accordion type="single" collapsible className="border-0">
            {CONSEJOS_FAQS.map((faq, idx) => (
              <AccordionItem key={faq.question} value={`item-${idx}`} className="border-border/60">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground py-4 hover:no-underline hover:text-accent transition-colors">
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
