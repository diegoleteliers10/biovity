"use client"

import { TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { SALARIOS_HERO_STATS } from "@/lib/data/salarios-data"

export function SalariosHero() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Ambient brand glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Green Plain Text Tag */}
          <m.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0)}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-4 block"
          >
            Inteligencia Salarial STEM • Chile 2026
          </m.span>

          {/* Main Title */}
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight text-balance tracking-tight"
          >
            Sueldos y Salarios en{" "}
            <span className="text-accent font-semibold">Biotecnología y Ciencias</span> en Chile
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            Consulta sueldos promedio y bandas salariales por carrera, nivel de experiencia y región
            para biotecnología, bioquímica, química, farmacia e ingeniería en Chile.
          </m.p>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 3)}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground mb-12 bg-surface-container-low px-3 py-1 rounded-md"
          >
            <HugeiconsIcon icon={TradeUpIcon} size={14} className="text-accent" />
            <span>Datos analizados y normalizados en CLP</span>
          </m.div>

          {/* Stats Grid - Matching /nosotros styling, font size, and text-center structure */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 4)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {SALARIOS_HERO_STATS.map((stat) => (
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
