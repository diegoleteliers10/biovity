"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FAQS_RECLUTAMIENTO } from "@/lib/data/reclutamiento-data"

export function ReclutamientoFAQ() {
  const reducedMotion = useReducedMotion()
  const transition = (delay: number) => getTransition({ delay, reducedMotion })

  return (
    <section id="faq-reclutamiento" className="bg-surface-container-lowest py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <m.header
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={transition(0)}
          className="h-fit lg:col-span-4 lg:sticky lg:top-28"
        >
          <p className="mb-4 text-sm font-semibold text-secondary">Antes de empezar</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Preguntas <span className="text-accent">frecuentes</span>
          </h2>
        </m.header>

        <m.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={transition(0.08)}
          className="lg:col-span-8"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS_RECLUTAMIENTO.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="rounded-xl border-0 bg-surface-container-low px-5 sm:px-6"
              >
                <AccordionTrigger className="group min-h-16 w-full gap-6 py-5 text-left text-base font-medium text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:py-6 sm:text-lg [&>svg]:text-muted-foreground">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent
                  className="pb-6 pl-11 pr-8 text-base leading-relaxed text-muted-foreground text-pretty sm:pl-16 sm:pr-12"
                  keepRendered
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.35,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <p className="max-w-3xl">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  )
}
