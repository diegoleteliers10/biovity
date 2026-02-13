"use client"

import { Clock } from "lucide-react"
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
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={t(LANDING_ANIMATION.sequenceDelay)}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance"
              >
                Nuestra Historia
              </motion.h2>
            </div>
          </div>
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
            farmacia enfrentaban dificultades para encontrar talento especializado, y mantener un
            seguimiento de inicio a fin de sus procesos de selección.
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
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 hover:scale-110 transition-transform duration-200">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
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
