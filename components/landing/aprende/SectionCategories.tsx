"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { APRENDE_CATEGORIES } from "@/lib/data/aprende-data"

export function SectionCategories() {
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
            Categorías
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Contenido organizado por área de conocimiento.
          </p>
        </m.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APRENDE_CATEGORIES.map((category, i) => (
            <m.div
              key={category.slug}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
            >
              <Link
                href={`/aprende/${category.slug}`}
                className="block group p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-4">
                  <HugeiconsIcon
                    icon={category.icon}
                    size={20}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {category.description}
                </p>
                <div className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {category.capsuleCount} cápsula{category.capsuleCount !== 1 ? "s" : ""}
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
