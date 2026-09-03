"use client"

import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { DIFERENCIADORES_BIOVITY } from "@/lib/data/reclutamiento-data"

export function DiferenciaBiovity() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="diferencia-biovity">
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
            La Propuesta Diferenciadora
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            ¿Qué diferencia tiene Biovity contra las{" "}
            <span className="text-accent font-semibold">opciones actuales</span>?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            No somos un portal de empleo genérico con un logo nuevo. Construimos una plataforma
            especializada con entendimiento profundo de la ciencia, sus técnicas y sus normativas.
          </p>
        </m.div>

        {/* 6 Cards Grid (3 columns on large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {DIFERENCIADORES_BIOVITY.map((dif, index) => (
            <m.div
              key={dif.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.stagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-white/90 shadow-none border border-border/20"
            >
              <div>
                {/* Header with icon and tag */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="size-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={dif.icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20 font-semibold">
                    {dif.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2.5">{dif.title}</h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty mb-5">
                  {dif.description}
                </p>
              </div>

              {/* Footer with Technical Advantage & Metric */}
              <div className="pt-4 border-t border-border/40 space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-foreground font-medium">
                  <HugeiconsIcon icon={Tick02Icon} size={15} className="text-secondary shrink-0 mt-0.5" />
                  <span>{dif.ventajaTecnica}</span>
                </div>

                {dif.metricaClave && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-secondary font-semibold bg-secondary/10 px-2.5 py-0.5 rounded-md">
                    <span>{dif.metricaClave}</span>
                  </div>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
