"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getTransition } from "@/lib/animations"
import { CONSEJOS_FAQS } from "@/lib/data/consejos-carrera-data"

export function ConsejosFAQ() {
  const reducedMotion = useReducedMotion()
  const transition = getTransition({ reducedMotion })

  return (
    <section className="bg-surface-container-low py-16 sm:py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-12 md:gap-12 lg:px-8">
        <m.div
          initial={{ opacity: 1, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={transition}
          className="md:col-span-4"
        >
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            Respuestas directas
          </p>
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-4xl">
            Preguntas <span className="text-accent">frecuentes</span>
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 1, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={getTransition({ delay: 0.06, reducedMotion })}
          className="md:col-span-8"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full overflow-visible rounded-none border-x-0 border-b-0 border-t border-border/70"
          >
            {CONSEJOS_FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-border/70 last:border-b"
              >
                <AccordionTrigger className="min-h-14 items-center gap-5 rounded-none px-0 py-4 text-left text-sm font-medium leading-snug text-foreground hover:text-secondary hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-base [&>svg]:size-4 [&>svg]:text-muted-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl px-0 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
