"use client"

import { Clock01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FLUJO_COMPARATIVO } from "@/lib/data/reclutamiento-data"

export function FlujoComparativo() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="flujo-comparativo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Flujo Paso a Paso • Proceso Operativo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            El Proceso de Contratación:{" "}
            <span className="text-accent font-semibold">Antes vs. Con Biovity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Observa cómo se transforma cada etapa del ciclo de selección al reemplazar herramientas
            dispersas por un ecosistema científico unificado.
          </p>
        </m.div>

        {/* Timeline Comparison Cards */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {FLUJO_COMPARATIVO.map((etapa, index) => (
            <m.div
              key={etapa.numero}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.stagger)}
              className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-border/30 shadow-none"
            >
              {/* Stage Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-surface-container-low text-primary">
                  FASE {etapa.numero}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">{etapa.fase}</h3>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Traditional Side */}
                <div className="rounded-xl p-5 bg-surface-container-low/60 border border-border/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono uppercase font-semibold text-muted-foreground">
                        Método Tradicional
                      </span>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={13} />
                        {etapa.tradicional.tiempo}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      {etapa.tradicional.titulo}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                      {etapa.tradicional.descripcion}
                    </p>
                  </div>
                </div>

                {/* Biovity Side */}
                <div className="rounded-xl p-5 bg-secondary/5 border border-secondary/30 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono uppercase font-semibold text-secondary flex items-center gap-1">
                        <HugeiconsIcon icon={SparklesIcon} size={13} />
                        Con Biovity
                      </span>
                      <span className="text-xs font-mono font-semibold text-secondary flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={13} />
                        {etapa.biovity.tiempo}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      {etapa.biovity.titulo}
                    </h4>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed text-pretty mb-3">
                      {etapa.biovity.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-secondary/20">
                    <span className="text-[11px] font-mono font-semibold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full inline-block">
                      ✓ {etapa.biovity.destacado}
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
