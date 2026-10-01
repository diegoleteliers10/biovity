"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PASOS_EMPRESAS } from "@/lib/data/empresas-data"

export function ComoFuncionaEmpresas() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-24 md:py-36 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-12 max-w-3xl mx-auto md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-0 tracking-tight text-balance">
            Cómo funciona
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PASOS_EMPRESAS.map((paso, index) => (
            <m.div
              key={paso.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-7 border border-border/40 flex flex-col justify-between transition-colors hover:bg-surface-container-highest/60"
            >
              <div>
                <div className="size-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary mb-4">
                  <HugeiconsIcon icon={paso.icon} size={18} />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {paso.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {paso.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
