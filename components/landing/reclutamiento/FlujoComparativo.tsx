"use client"

import { Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FLUJO_COMPARATIVO } from "@/lib/data/reclutamiento-data"

export function FlujoComparativo() {
  const reducedMotion = useReducedMotion()
  const transition = (delay: number) => getTransition({ delay, reducedMotion })

  return (
    <section className="bg-surface-container-low py-20 sm:py-24" id="flujo-comparativo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.header
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={transition(0)}
          className="mb-12 grid gap-5 sm:mb-16 sm:grid-cols-12 sm:items-end"
        >
          <p className="text-sm font-semibold text-secondary sm:col-span-3">El proceso</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:col-span-9 sm:text-4xl md:text-5xl">
            Una contratación, <span className="text-accent">cuatro etapas.</span>
          </h2>
        </m.header>

        <ol className="space-y-4">
          {FLUJO_COMPARATIVO.map((stage, index) => (
            <m.li
              key={stage.numero}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={transition(index * 0.07)}
              className="grid gap-6 rounded-xl bg-surface-container-lowest p-5 sm:grid-cols-12 sm:gap-8 sm:p-8"
            >
              <div className="sm:col-span-3">
                <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {stage.fase}
                </h3>
              </div>

              <div className="grid gap-6 sm:col-span-9 md:grid-cols-2 md:gap-8">
                <article className="md:pt-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Método tradicional
                    </p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      {stage.tradicional.tiempo}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold leading-snug text-foreground">
                    {stage.tradicional.titulo}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {stage.tradicional.descripcion}
                  </p>
                </article>

                <article className="rounded-lg bg-secondary/10 p-4 sm:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-secondary">Con Biovity</p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} size={14} />
                      {stage.biovity.tiempo}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold leading-snug text-foreground">
                    {stage.biovity.titulo}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {stage.biovity.descripcion}
                  </p>
                  <p className="mt-3 text-sm font-medium text-secondary">
                    {stage.biovity.destacado}
                  </p>
                </article>
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
