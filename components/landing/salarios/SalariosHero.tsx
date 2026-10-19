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
    <section className="relative w-full overflow-hidden bg-surface-container-low px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36">
      <div className="mx-auto w-full max-w-7xl">
        <m.h1
          initial={{ opacity: 0, y: 24, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={transition(LANDING_ANIMATION.sequenceDelay)}
          className="mb-8 text-balance text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground"
        >
          Sueldos en biotecnología,{" "}
          <span className="font-semibold text-accent">ciencias e ingeniería</span> en Chile
        </m.h1>
        <div className="grid items-end gap-8 sm:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.6fr)]">
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(LANDING_ANIMATION.sequenceDelay * 2)}
            className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            Compara ingresos reales de titulados, con su fuente, cohorte y límites a la vista.
          </m.p>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(LANDING_ANIMATION.sequenceDelay * 3)}
            className="flex items-center gap-4 rounded-lg border border-border/40 bg-surface-container-lowest p-4 sm:max-w-md sm:justify-self-end sm:p-5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary/10">
              <HugeiconsIcon icon={TradeUpIcon} size={20} className="text-secondary" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-5 text-foreground">
                Fuente principal: MiFuturo.cl
              </span>
              <span className="mt-1 block text-xs leading-4 text-muted-foreground">
                Actualizado: {SALARIES_UPDATED_AT}
              </span>
            </span>
          </m.div>
        </div>
      </div>
    </section>
  )
}
