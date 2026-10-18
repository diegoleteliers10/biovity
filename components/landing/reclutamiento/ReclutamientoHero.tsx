"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const techniquePairs = [
  { short: "HPLC", full: "Cromatografía líquida de alta resolución" },
  { short: "qPCR", full: "PCR en tiempo real" },
] as const

export function ReclutamientoHero() {
  const reducedMotion = useReducedMotion()
  const transition = (delay: number) => ({
    duration: reducedMotion ? 0 : 0.5,
    delay: reducedMotion ? 0 : delay,
    ease: [0.23, 1, 0.32, 1] as const,
  })

  return (
    <section className="bg-surface-container-lowest pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-6">
          <m.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0)}
            className="mb-5 text-sm font-semibold text-secondary"
          >
            Para quienes contratan en ciencias · Chile
          </m.p>
          <m.h1
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.06)}
            className="mb-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Encuentra el talento que entiende tu <span className="text-accent">ciencia.</span>
          </m.h1>
          <m.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.12)}
            className="mb-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Publica ofertas científicas, reconoce habilidades técnicas y coordina cada etapa con tu
            equipo.
          </m.p>

          <m.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.18)}
            className="mb-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-11 w-full rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
              asChild
            >
              <Link href="/register/organization">
                Comenzar con Biovity
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-lg border-border/50 bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-low sm:w-auto"
              asChild
            >
              <Link href="#comparativa">Ver matriz comparativa</Link>
            </Button>
          </m.div>

          <m.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(0.24)}
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span>Plan gratuito disponible</span>
          </m.div>
        </div>

        <m.div
          initial={reducedMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition(0.12)}
          className="lg:col-span-6"
        >
          <div
            data-ui="technical-equivalence-example"
            className="rounded-xl bg-surface-container-low p-5 sm:p-7"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                Ejemplo de equivalencia técnica
              </h2>
              <span className="text-sm text-muted-foreground">Experiencia científica</span>
            </div>
            <div className="grid gap-3">
              {techniquePairs.map((pair, index) => (
                <m.div
                  key={pair.short}
                  initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={transition(0.3 + index * 0.1)}
                  className="grid grid-cols-[4rem_1fr] items-center gap-3 rounded-lg bg-surface-container-lowest p-4 sm:grid-cols-[5rem_1fr] sm:gap-5 sm:p-5"
                >
                  <code className="w-fit rounded-md bg-primary px-2.5 py-2 text-sm font-semibold text-primary-foreground sm:text-base">
                    {pair.short}
                  </code>
                  <div>
                    <p className="text-xs text-muted-foreground">También se conoce como</p>
                    <p className="mt-1 text-sm font-medium leading-snug text-foreground sm:text-base">
                      {pair.full}
                    </p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
