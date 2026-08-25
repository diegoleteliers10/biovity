"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { APRENDE_STATS } from "@/lib/data/aprende-data"
import {
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"
import { useMediaQuery } from "@/hooks/use-media-query"

export function SectionHero() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t()}
          className="max-w-3xl"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            APRENDE • CAPSULAS DE APRENDIZAJE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
            Cápsulas de aprendizaje para el{" "}
            <span className="text-accent font-semibold">sector biocientífico</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed text-pretty">
            Aprende programación aplicada a biociencia con cápsulas prácticas. Cada una incluye
            ejercicios, un quiz y un certificado al aprobar.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl"
        >
          {APRENDE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center shadow-none"
            >
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
