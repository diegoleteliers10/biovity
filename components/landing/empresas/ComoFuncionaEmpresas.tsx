"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PASOS_EMPRESAS } from "@/lib/data/empresas-data"

export function ComoFuncionaEmpresas() {
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
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight text-balance"
          >
            Cómo funciona para empresas
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-3xl mx-auto text-pretty"
          >
            En solo 4 pasos, estarás contratando al talento científico que tu empresa necesita.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {PASOS_EMPRESAS.map((paso, index) => (
            <m.div
              key={paso.number}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="relative group"
            >
              <div className="bg-gray-50 rounded-2xl p-6 h-full border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <HugeiconsIcon icon={paso.icon} size={28} className="text-white" />
                  </div>
                  <span className="text-4xl font-bold text-gray-100 group-hover:text-blue-200 transition-colors duration-200">
                    {paso.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{paso.title}</h3>
                <p className="text-gray-500 leading-relaxed">{paso.description}</p>
              </div>
              {/* Connector line for desktop - positioned in gap between cards */}
              {paso.number !== "04" && (
                <div
                  className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[calc(100%+0.5rem)] w-8 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 pointer-events-none"
                  aria-hidden
                />
              )}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
