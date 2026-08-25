"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { APRENDE_STATS } from "@/lib/data/aprende-data"

export function SectionHero() {
  const reducedMotion = useReducedMotion()
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <m.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-3xl"
        >
          <span className="inline-block text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
            Aprende
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Cápsulas de aprendizaje para el sector biocientífico
          </h1>
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Aprende programación aplicada a biociencia con cápsulas prácticas. Cada una incluye
            ejercicios, un quiz y un certificado al aprobar.
          </p>
        </m.div>

        <m.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-12 grid grid-cols-3 gap-8 max-w-lg"
        >
          {APRENDE_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
