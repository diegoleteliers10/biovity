"use client"

import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "../../ui/button"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function CTA() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const benefits = [
    "Acceso a ofertas exclusivas",
    "Perfil destacado para recruiters",
    "Alertas personalizadas",
    "Recursos para tu carrera",
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-balance"
          >
            ¿Listo para dar el siguiente paso?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto text-pretty"
          >
            Únete a miles de profesionales que ya encontraron su camino en la ciencia
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            type="button"
            className="inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Crear cuenta gratis
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Soy empresa
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(LANDING_ANIMATION.sequenceDelay * 3)}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger * 0.5)}
              className="flex items-center text-gray-500"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 mr-2 text-green-500" />
              {benefit}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
