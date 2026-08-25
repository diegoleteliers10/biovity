"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { CONSEJOS_STATS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHero() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const t = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Green Plain Text Tag */}
          <m.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0)}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-4 block"
          >
            Desarrollo Profesional en Biociencias & Biotech
          </m.span>

          {/* Heading */}
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance"
          >
            Consejos de Carrera en{" "}
            <span className="text-secondary font-semibold">Biotecnología</span> y{" "}
            <span className="text-accent font-semibold">Ciencias</span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Guías prácticas, optimización de CV para sistemas ATS, preparación de entrevistas
            técnicas y estrategias comprobadas para transicionar con éxito de la academia a la
            industria.
          </m.p>

          {/* Stats Grid - Exactly matching /nosotros styling, font, and font-size */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
          >
            {CONSEJOS_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60"
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
