"use client"

import { AlertCircle, CheckCircle } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function ProblemaSolucion() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problema Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={t(LANDING_ANIMATION.sequenceDelay)}
                className="text-2xl font-bold text-gray-900 font-rubik"
              >
                El Problema que Resolvemos
              </motion.h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-pretty">
              El mercado laboral de ciencias en Chile está fragmentado, con poca transparencia y
              omisión de información crítica. Profesionales enfrentan pocas ofertas dispersas en múltiples
              plataformas, mientras empresas no solo tienen dificultades para encontrar talento especializado, y mantener un seguimiento de inicio a fin centralizado de sus procesos de selección.
            </p>
          </motion.div>

          {/* Solución Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={t(LANDING_ANIMATION.sequenceDelay)}
                className="text-2xl font-bold text-gray-900 font-rubik"
              >
                Nuestra Solución
              </motion.h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-pretty">
              Creamos Biovity como un espacio centralizado donde profesionales pueden encontrar empleos,
              comparar salarios del sector, acceder a consejos de carrera y conectar con una comunidad
              activa. Para empresas, ofrecemos herramientas ATS simplificadas y acceso directo a talento
              verificado.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
