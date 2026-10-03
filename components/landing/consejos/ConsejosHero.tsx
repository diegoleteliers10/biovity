"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, LANDING_ANIMATION } from "@/lib/animations"
import { CONSEJOS_STATS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHero() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="relative w-full md:min-h-screen flex items-center justify-center overflow-hidden bg-surface-container-lowest pt-32 pb-16 md:py-40 lg:py-48">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-5xl mx-auto">
          {/* Heading */}
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold text-foreground mb-6 lg:mb-8 leading-tight tracking-tight text-balance"
          >
            Consejos de carrera en{" "}
            <span className="text-accent font-semibold">biotecnología y ciencias</span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 lg:mb-16 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Optimiza tu CV para ATS, prepara entrevistas técnicas y transita de la academia a la
            industria.
          </m.p>

          {/* Stats Grid - Exactly matching /about styling, font, and font-size */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto"
          >
            {CONSEJOS_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-low rounded-xl p-4 sm:p-5 lg:p-6 text-center transition-colors hover:bg-surface-container-highest/60"
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
      </div>
    </section>
  )
}
