"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { APRENDE_BENEFITS } from "@/lib/data/aprende-data"

export function SectionBenefits() {
  const reducedMotion = useReducedMotion()
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <m.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
            ¿Por qué aprender con Biovity?
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Contenido diseñado para profesionales y estudiantes del sector biocientífico.
          </p>
        </m.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {APRENDE_BENEFITS.map((benefit, i) => (
            <m.div
              key={benefit.title}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                <HugeiconsIcon
                  icon={benefit.icon}
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">{benefit.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {benefit.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
