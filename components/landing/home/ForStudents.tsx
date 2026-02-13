"use client"

import { ArrowRight01Icon, GraduationScrollIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { BENEFITS_FOR_STUDENTS } from "@/lib/data/home-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function ForStudents() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(0)}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            >
              Para estudiantes y graduados
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(LANDING_ANIMATION.sequenceDelay)}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-balance"
            >
              Da tu primer paso en la ciencia
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
              className="text-xl text-gray-500 mb-8 leading-relaxed text-pretty"
            >
              Entendemos que dar el primer paso en el mundo laboral puede ser desafiante. Por eso
              creamos una plataforma diseñada específicamente para ayudarte a comenzar tu carrera en
              biotecnología, química y ciencias de la salud.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {BENEFITS_FOR_STUDENTS.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                  transition={ts(index * LANDING_ANIMATION.chainStagger)}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${benefit.gradient} shadow-md flex-shrink-0`}
                  >
                    <HugeiconsIcon icon={benefit.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{benefit.title}</h4>
                      <p className="text-gray-500 text-xs mt-1">{benefit.description}</p>
                    </div>
                  </motion.div>
              ))}
            </motion.div>

            <button
              type="button"
              className="inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Explorar oportunidades
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-md">
                    <HugeiconsIcon icon={GraduationScrollIcon} className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xl">Estudiantes</h3>
                    <p className="text-gray-500 text-sm">Tu futuro comienza aquí</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Ofertas para graduados</span>
                    <span className="text-2xl font-bold text-blue-600">+200</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Prácticas disponibles</span>
                    <span className="text-2xl font-bold text-green-600">+85</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Empresas aliadas</span>
                    <span className="text-2xl font-bold text-purple-600">+50</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
