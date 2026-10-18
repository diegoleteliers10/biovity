"use client"

import { useReducedMotion } from "motion/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion"
import { FAQS_EMPRESAS } from "@/lib/data/empresas-data"

export function FAQ() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="faq"
      aria-labelledby="companies-faq-title"
      className="bg-surface-container-lowest py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div data-company-reveal className="lg:col-span-4">
          <span className="mb-5 block font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
            Resolvemos tus dudas
          </span>
          <h2
            id="companies-faq-title"
            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Preguntas <span className="text-accent">frecuentes</span>
          </h2>
        </div>
        <div data-company-reveal className="min-w-0 lg:col-span-8">
          <Accordion type="single" collapsible className="border-t border-border/60">
            {FAQS_EMPRESAS.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-border/60 last:border-b"
              >
                <AccordionTrigger className="items-center gap-5 rounded-none py-6 text-base font-medium leading-relaxed text-foreground transition-colors hover:text-secondary hover:no-underline motion-reduce:transition-none motion-reduce:[&_svg]:transition-none sm:py-7 [&>svg]:size-5 [&>svg]:text-secondary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="pb-7 pr-8 text-sm leading-relaxed text-muted-foreground sm:pr-12 sm:text-base"
                  transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
                >
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
