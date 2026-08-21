"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function BlogHeader() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const t = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <div className="relative pt-12 pb-16 text-center max-w-3xl mx-auto px-4">
      <div className="relative z-10">
        {/* Green Plain Text Tag */}
        <m.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0)}
          className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-4 block"
        >
          Investigación & Ecosistema Científico
        </m.span>

        <m.h1
          initial={{ opacity: 0, y: 24, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance"
        >
          Blog & Publicaciones <span className="text-accent font-semibold">Biovity</span>
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl mx-auto"
        >
          Análisis sobre el mercado laboral, avances en biotecnología y guías profesionales para la comunidad científica en Chile.
        </m.p>
      </div>
    </div>
  )
}
