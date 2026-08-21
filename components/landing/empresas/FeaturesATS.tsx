"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FEATURES_ATS } from "@/lib/data/empresas-data"

export function FeaturesATS() {
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
            Infraestructura ATS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Sistema ATS diseñado para <span className="text-accent font-semibold">equipos científicos</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Herramientas profesionales para gestionar tus procesos de reclutamiento desde la postulación hasta la contratación final.
          </p>
        </m.div>

        {/* 8 Clean borderless white cards on surface-container-low */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {FEATURES_ATS.map((feature, index) => (
            <m.div
              key={feature.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-white/80"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="size-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={feature.icon} size={18} />
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 font-semibold">
                      {feature.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {feature.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
