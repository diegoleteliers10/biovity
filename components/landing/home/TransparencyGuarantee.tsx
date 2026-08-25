"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  getSpringTransition,
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"
import { TRANSPARENCY_FEATURES } from "@/lib/data/home-data"

export function TransparencyGuarantee() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const chainStagger = isMobile
    ? LANDING_ANIMATION_MOBILE.chainStagger
    : LANDING_ANIMATION.chainStagger
  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
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
            Compromiso de Transparencia
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Empleos reales, verificados y{" "}
            <span className="text-accent font-semibold">100% transparentes</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Garantizamos información clara sobre salarios, requisitos experimentales y condiciones
            laborales en cada oportunidad.
          </p>
        </m.div>

        {/* 4 Clean borderless white cards on surface-container-low */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {TRANSPARENCY_FEATURES.map((feature, index) => {
            const isViolet = index % 2 === 1
            return (
              <m.div
                key={feature.title}
                initial={isReduced ? false : { opacity: 0, y: yOffset, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: viewportMargin }}
                transition={ts(index * chainStagger)}
                className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-white/80"
              >
                <div>
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center mb-5 ${
                      isViolet ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    <HugeiconsIcon icon={feature.icon} size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2.5">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                    {feature.description}
                  </p>
                </div>
              </m.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
