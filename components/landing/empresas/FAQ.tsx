"use client"

import { ChevronDown } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { FAQS_EMPRESAS } from "@/lib/data/empresas-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-24 bg-white">
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
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-rubik text-balance"
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
          className="space-y-4"
        >
          {FAQS_EMPRESAS.map((faq, index) => {
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger * 0.6)}
                className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={{ maxHeight: 0 }}
                  animate={{ maxHeight: openIndex === index ? 500 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-gray-600 leading-relaxed text-pretty">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
