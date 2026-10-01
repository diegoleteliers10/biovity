"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { APRENDE_BENEFITS } from "@/lib/data/aprende-data"

export function SectionBenefits() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="relative py-24 md:py-36">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t()}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-0 tracking-tight text-balance">
            ¿Por qué aprender con <span className="text-accent font-semibold">Biovity</span>?
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {APRENDE_BENEFITS.map((benefit, i) => (
            <m.div
              key={benefit.title}
              initial={isReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={t(
                isMobile
                  ? LANDING_ANIMATION_MOBILE.sequenceDelay * i
                  : LANDING_ANIMATION.stagger * i
              )}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <HugeiconsIcon icon={benefit.icon} size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
