"use client"

import { Linkedin } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function Equipo() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
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
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance"
          >
            Nuestro Equipo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-600 text-pretty"
          >
            El equipo detrás de Biovity
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex justify-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full text-center">
            {/* Photo/Avatar */}
            <div className="mx-auto mb-6 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-5xl font-bold text-white">DL</span>
            </div>

            {/* Name and Role */}
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={t(LANDING_ANIMATION.sequenceDelay * 3)}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Diego Letelier
            </motion.h3>
            <p className="text-lg text-blue-600 mb-6 font-semibold">CEO & CTO</p>

            {/* Brief Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-pretty">
              Fundador y líder técnico de Biovity. Apasionado por conectar talento científico con
              oportunidades significativas en el sector de biociencias.
            </p>

            {/* LinkedIn Link */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
              aria-label="Ir al perfil de LinkedIn de Diego Letelier"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
