"use client"

import { motion, useReducedMotion } from "motion/react"
import { BENEFICIOS_EMPRESAS } from "@/lib/data/empresas-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

const ICON_COLOR_CLASSES = [
  "text-violet-500",
  "text-emerald-500",
  "text-blue-500",
] as const

export function PropuestaValor() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-rubik text-balance"
          >
            ¿Por qué elegir Biovity?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-3xl mx-auto text-pretty"
          >
            La plataforma diseñada para conectar empresas con el mejor talento científico de Chile.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {BENEFICIOS_EMPRESAS.map((beneficio, index) => {
            const IconComponent = beneficio.icon
            const iconColor = ICON_COLOR_CLASSES[index % 3]
            return (
              <motion.div
                key={beneficio.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className={`w-9 h-9 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{beneficio.title}</h3>
                <p className="text-gray-500 leading-relaxed">{beneficio.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
