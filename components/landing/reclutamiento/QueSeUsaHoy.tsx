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
    <section className="py-24 md:py-36 bg-surface-container-low" id="que-se-usa-hoy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-12 max-w-3xl mx-auto md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Lo que se usa <span className="text-accent font-semibold">hoy</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Las 5 alternativas predominantes para contratar en ciencias.
          </p>
        </m.div>

        {/* 5 Compact Cards: verdict + examples + one key limitation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {HERRAMIENTAS_ACTUALES.map((item, index) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.stagger)}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-none border border-border/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <HugeiconsIcon icon={item.icon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    {item.examples}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40">
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-highest text-muted-foreground inline-block mb-3">
                  {item.tag}
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    className="text-rose-500/80 shrink-0 mt-0.5"
                  />
                  {item.limitaciones[0]}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
