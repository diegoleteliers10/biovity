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
    <section className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Flujo de Contratación
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Cómo funciona para <span className="text-accent font-semibold">empresas</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            En 4 pasos guiados podrás publicar tus vacantes técnicas y gestionar a los postulantes de forma centralizada.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PASOS_EMPRESAS.map((paso, index) => (
            <m.div
              key={paso.number}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-7 border border-border flex flex-col justify-between transition-colors hover:border-border/80"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="size-9 rounded-lg bg-surface-container-highest border border-border flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={paso.icon} size={18} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                    Paso {paso.number}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{paso.title}</h3>
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
