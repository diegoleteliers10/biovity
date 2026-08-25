"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { APRENDE_CATEGORIES } from "@/lib/data/aprende-data"

export function SectionCategories() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t()}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            CATEGORÍAS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Contenido <span className="text-accent font-semibold">organizado</span> por área
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed text-pretty">
            Explora cápsulas por disciplina científica.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APRENDE_CATEGORIES.map((category, i) => (
            <m.div
              key={category.slug}
              initial={isReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={t(
                isMobile ? LANDING_ANIMATION_MOBILE.stagger * i : LANDING_ANIMATION.stagger * i
              )}
            >
              <Link
                href={`/aprende/${category.slug}`}
                className="block group p-6 rounded-xl bg-surface-container-low border border-border/40 hover:border-secondary/40 transition-colors shadow-none"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <HugeiconsIcon icon={category.icon} size={20} className="text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-5 line-clamp-2 min-h-10">
                  {category.description}
                </p>
                <div className="mt-4 text-xs font-medium text-secondary">
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
