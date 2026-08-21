"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { BENEFICIOS_EMPRESAS } from "@/lib/data/empresas-data"

export function PropuestaValor() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Propuesta de Valor
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Por qué las empresas científicas eligen <span className="text-accent font-semibold">Biovity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Diseñamos herramientas para resolver los desafíos específicos de contratación en biotecnología, farmacia e industria química en Chile.
          </p>
        </m.div>

        {/* 4 Clean borderless white cards on surface-container-low */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {BENEFICIOS_EMPRESAS.map((beneficio, index) => (
            <m.div
              key={beneficio.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-white/80"
            >
              <div>
                <div className="size-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-5 text-primary">
                  <HugeiconsIcon icon={beneficio.icon} size={20} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2.5">{beneficio.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {beneficio.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
