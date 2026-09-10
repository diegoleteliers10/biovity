"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { HERRAMIENTAS_ACTUALES } from "@/lib/data/reclutamiento-data"

export function QueSeUsaHoy() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="que-se-usa-hoy">
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
            El Panorama Actual • Herramientas en Uso
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            ¿Qué herramientas se están usando hoy para{" "}
            <span className="text-accent font-semibold">contratar en ciencias</span>?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Analizamos las 5 alternativas predominantes en el mercado chileno e internacional,
            sus casos de uso habituales y por qué generan fricciones cuando se aplican a perfiles técnicos.
          </p>
        </m.div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {HERRAMIENTAS_ACTUALES.map((item, index) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.stagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-white/90 shadow-none border border-border/20"
            >
              <div>
                {/* Header with icon and tag */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <HugeiconsIcon icon={item.icon} size={20} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-highest text-muted-foreground">
                    {item.tag}
                  </span>
                </div>

                {/* Category & Title */}
                <div className="mb-3">
                  <span className="text-xs font-mono font-medium text-secondary uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-0.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{item.examples}</p>
                </div>

                {/* How it's used today */}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5 font-mono">
                    Cómo se usa hoy:
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                    {item.comoSeUsa}
                  </p>
                </div>

                {/* Limitations */}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                    Limitaciones críticas:
                  </h4>
                  <ul className="space-y-2">
                    {item.limitaciones.map((lim) => (
                      <li key={lim} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                        <span className="size-1.5 rounded-full bg-rose-500/70 shrink-0 mt-1.5" />
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
