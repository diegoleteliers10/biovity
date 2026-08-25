"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { APRENDE_CTA } from "@/lib/data/aprende-data"

export function SectionCTA() {
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
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
            {APRENDE_CTA.title}
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            {APRENDE_CTA.description}
          </p>
          <Link
            href={APRENDE_CTA.button.href}
            className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            {APRENDE_CTA.button.text}
          </Link>
        </m.div>
      </div>
    </section>
  )
}
