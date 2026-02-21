"use client"

import { AlertCircleIcon, Target01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function ProblemaSolucion() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="mb-16 max-w-4xl mx-auto text-center"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance"
          >
            Por qué existe{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Biovity
            </span>
            ?
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-xl text-gray-600 leading-relaxed text-pretty"
          >
            El mercado laboral de ciencias en Chile está fragmentado — profesionales no encuentran
            oportunidades y empresas no encuentran talento.
          </m.p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Problema Card */}
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">El Problema</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-pretty">
              Profesionales enfrentan pocas ofertas dispersas en múltiples plataformas. Sin un
              espacio centralizado, perder tiempo buscando y comparando — o peor, ni siquiera saben
              que existen las oportunidades.
            </p>
          </m.div>

          {/* Solución Card */}
          <m.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={Target01Icon} size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nuestra Solución</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-pretty">
              Un espacio centralizado donde profesionales encuentran empleos, comparan salarios del
              sector, acceden a consejos de carrera y conectan con una comunidad activa. Para
              empresas, acceso directo a talento verificado.
            </p>
          </m.div>
        </div>
      </div>
    </section>
  )
}
