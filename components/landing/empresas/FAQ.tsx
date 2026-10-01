"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FAQS_EMPRESAS } from "@/lib/data/empresas-data"

export function FAQ() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section id="faq" className="py-24 md:py-36 bg-surface-container-lowest">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-0 tracking-tight text-balance">
            Preguntas <span className="text-accent font-semibold">frecuentes</span>
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
        >
          {/* Clean tonal accordion items on surface-container-lowest */}
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS_EMPRESAS.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="bg-surface-container-low rounded-xl overflow-hidden transition-colors hover:bg-surface-container-highest/60"
              >
                <AccordionTrigger className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left transition-colors hover:no-underline font-semibold text-foreground text-sm sm:text-base gap-4 [&>svg]:text-muted-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="px-5 sm:px-6 pb-5 text-muted-foreground leading-relaxed text-pretty text-xs sm:text-sm"
                  keepRendered
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.4,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  )
}
