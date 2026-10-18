"use client"

import { TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { SALARIES_UPDATED_AT } from "@/lib/data/salarios-benchmark"

export function SalariosHero() {
  const reducedMotion = useReducedMotion()
  const transition = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-surface-container-lowest px-4 pb-16 pt-24 sm:px-6 md:pb-24 md:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={transition(LANDING_ANIMATION.sequenceDelay)}
            className="mb-6 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Sueldos en biotecnología,{" "}
            <span className="font-semibold text-accent">ciencias e ingeniería</span> en Chile
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(LANDING_ANIMATION.sequenceDelay * 2)}
            className="mx-auto mb-8 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            Compara ingresos reales de titulados, con su fuente, cohorte y límites a la vista.
          </m.p>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(LANDING_ANIMATION.sequenceDelay * 3)}
            className="inline-flex items-center gap-2 rounded-md bg-surface-container-low px-3 py-2 text-xs text-muted-foreground"
          >
            <HugeiconsIcon icon={TradeUpIcon} size={14} className="text-accent" />
            <span>Fuente principal: MiFuturo.cl · Actualizado: {SALARIES_UPDATED_AT}</span>
          </m.div>
        </div>
      </div>
    </section>
  )
}
