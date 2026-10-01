"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { AdnBeam } from "@/components/landing/home/common/AdnBeam"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  getSpringTransition,
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"

const ECOSYSTEM_STEPS = [
  {
    title: "Empresas publican",
    description: "Vacantes técnicas con bandas salariales claras.",
    accent: false,
  },
  {
    title: "Candidatos postulan",
    description: "Postulación directa desde tu perfil científico.",
    accent: false,
  },
  {
    title: "Match de IA",
    description: "Filtros científicos conectan el puesto con el candidato ideal.",
    accent: true,
  },
]

export function ConexionTalento() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const chainStagger = isMobile
    ? LANDING_ANIMATION_MOBILE.chainStagger
    : LANDING_ANIMATION.chainStagger
  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 16 : 24

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="py-24 md:py-36 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
          className="text-center mb-12 max-w-3xl mx-auto md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-0 tracking-tight text-balance">
            Cómo funciona
          </h2>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: yOffset }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={ts(
            isMobile ? LANDING_ANIMATION_MOBILE.sequenceDelay : LANDING_ANIMATION.sequenceDelay
          )}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-4xl mb-12 md:mb-16 mx-auto flex justify-center">
            <AdnBeam />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {ECOSYSTEM_STEPS.map((step, index) => (
              <m.div
                key={step.title}
                initial={isReduced ? false : { opacity: 0, y: yOffset }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: viewportMargin }}
                transition={ts(chainStagger * (index + 1))}
                className={`rounded-xl p-6 sm:p-8 border ${
                  step.accent
                    ? "border-accent/30 bg-accent/5"
                    : "border-border/40 bg-surface-container-lowest"
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  {step.description}
                </p>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
