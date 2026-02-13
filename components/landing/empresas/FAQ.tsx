"use client"

import { motion, useReducedMotion } from "motion/react"
import { FAQS_EMPRESAS } from "@/lib/data/empresas-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion"

export function FAQ() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight text-balance"
          >
            Preguntas frecuentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 text-pretty"
          >
            Todo lo que necesitas saber sobre Biovity para empresas.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
          >
            {FAQS_EMPRESAS.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
              >
                <AccordionTrigger className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:no-underline font-semibold text-gray-900 text-base gap-4 [&>svg]:text-gray-500">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="px-6 pb-5 text-gray-600 leading-relaxed text-pretty text-base"
                  keepRendered
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.7,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
