"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { TRANSPARENCY_FEATURES } from "@/lib/data/home-data"

export function TransparencyGuarantee() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm mb-6"
          >
            100% Transparente
          </m.div>
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl md:text-5xl text-gray-900 mb-4 text-balance"
          >
            Empleos reales y verificados
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-xl text-gray-500 max-w-2xl mx-auto text-pretty"
          >
            Sabemos lo importante que es encontrar oportunidades laborales confiables
          </m.p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRANSPARENCY_FEATURES.map((feature, index) => (
            <m.div
              key={feature.title}
              data-card
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="relative bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <HugeiconsIcon icon={feature.icon} size={48} className={feature.iconColor} />
                </div>
                <h3 className="text-gray-900 text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
