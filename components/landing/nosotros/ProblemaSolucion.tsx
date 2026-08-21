"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { DESAFIOS_MERCADO, SOLUCIONES_BIOVITY } from "@/lib/data/nosotros-data"

export function ProblemaSolucion() {
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
          className="mb-16 max-w-3xl mx-auto text-center"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Diagnóstico & Infraestructura
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Por qué existe <span className="text-accent font-semibold">Biovity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            El ecosistema científico chileno cuenta con talento de primer nivel, pero carecía de una
            plataforma que resolviera las fricciones del mercado.
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Problemas / Desafíos Card - Clean borderless tonal surface */}
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
            className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">El Desafío Tradicional</h3>
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-surface-container-highest text-muted-foreground">
                  Fricción actual
                </span>
              </div>

              <div className="space-y-6">
                {DESAFIOS_MERCADO.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="size-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
                      <HugeiconsIcon icon={item.icon} size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border font-mono">
              Resultado: Desmotivación, fuga de cerebros y procesos de contratación lentos.
            </p>
          </m.div>

          {/* Solución Biovity Card - Bordered solution block with brand highlight */}
          <m.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10 border border-secondary/40 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">El Enfoque Biovity</h3>
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20">
                  Nuevo estándar
                </span>
              </div>

              <div className="space-y-6">
                {SOLUCIONES_BIOVITY.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="size-8 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0 text-secondary mt-0.5">
                      <HugeiconsIcon icon={item.icon} size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-secondary mt-8 pt-4 border-t border-border font-mono font-medium relative z-10">
              Resultado: Procesos ágiles, salarios justos y retención de talento en Chile.
            </p>
          </m.div>
        </div>
      </div>
    </section>
  )
}
