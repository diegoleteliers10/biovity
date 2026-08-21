"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getSpringTransition, getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { STEPS_HOME } from "@/lib/data/home-data"

export function HowItWorks() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const chainStagger = isMobile ? LANDING_ANIMATION_MOBILE.chainStagger : LANDING_ANIMATION.chainStagger
  const viewportMargin = isMobile ? LANDING_ANIMATION_MOBILE.viewportMargin : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 16 : 28

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Metodología de Postulación
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Tu camino hacia el <span className="text-accent font-semibold">éxito profesional</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            En 4 sencillos pasos, acelera tu postulación y conecta con los equipos científicos más innovadores de Chile.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {STEPS_HOME.map((step, index) => (
            <m.div
              key={step.number}
              initial={isReduced ? false : { opacity: 0, y: yOffset, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={ts(index * chainStagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-white/80"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="size-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <HugeiconsIcon icon={step.icon} size={18} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                    Paso {step.number}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {step.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
