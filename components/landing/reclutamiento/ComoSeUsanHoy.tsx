"use client"

import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FRICCIONES_WORKFLOW } from "@/lib/data/reclutamiento-data"

export function ComoSeUsanHoy() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest" id="como-se-usan">
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
            Fricciones del Flujo Tradicional
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            ¿Cómo se están usando hoy y por qué{" "}
            <span className="text-accent font-semibold">generan fricción</span>?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            La contratación científica no es como contratar en otras industrias: requiere evaluar
            equipos, bioseguridad, normativas y protocolos experimentales. Los flujos actuales fallan en 4 puntos clave.
          </p>
        </m.div>

        {/* 2x2 Grid of Frictional Bottlenecks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {FRICCIONES_WORKFLOW.map((friccion, index) => (
            <m.div
              key={friccion.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.stagger)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-surface-container-highest/50 shadow-none border border-border/30"
            >
              <div>
                {/* Header with icon and Title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="size-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <HugeiconsIcon icon={friccion.icon} size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground tracking-wider block">
                      Cuello de Botella #{index + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {friccion.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty mb-6">
                  {friccion.description}
                </p>
              </div>

              {/* Callout box with Impact and Symptom */}
              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="bg-surface-container-lowest rounded-lg p-3.5 border border-border/30">
                  <span className="text-[11px] font-mono font-semibold uppercase text-rose-600 dark:text-rose-400 block mb-1 flex items-center gap-1.5">
                    <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                    Impacto en la Organización:
                  </span>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {friccion.impacto}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
                  <span>Síntoma observable:</span>
                  <span className="text-foreground font-medium text-right">{friccion.sintomaComun}</span>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
