"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { VALUES_DATA } from "@/lib/data/nosotros-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function HistoriaMision() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Historia Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="mb-16 max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance"
          >
            Nuestra{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Historia
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-xl text-gray-700 leading-relaxed text-pretty"
          >
            Biovity nació en 2026 con una misión clara: resolver el problema de dispersión en el
            mercado laboral de ciencias. Vimos que profesionales y estudiantes altamente capacitados
            luchaban por encontrar oportunidades, mientras empresas en biotecnología, química y
            farmacia enfrentaban dificultades para encontrar talento especializado.
          </motion.p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {VALUES_DATA.map((item, index) => {
            const iconColors = ["text-blue-600", "text-green-600", "text-purple-600"] as const
            const iconColor = iconColors[index % iconColors.length]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
                className="group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={48}
                  className={`mb-5 group-hover:scale-110 transition-transform duration-200 ${iconColor}`}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
