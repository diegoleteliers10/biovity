"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  getSpringTransition,
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"

export function CTA() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 14 : 20

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="py-28 md:py-40 bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight tracking-tight text-balance">
            Empieza tu próxima etapa en la{" "}
            <span className="text-accent font-semibold">ciencia</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto text-pretty">
            Profesionales y empresas, en un solo lugar.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: yOffset, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={ts(
            isMobile ? LANDING_ANIMATION_MOBILE.sequenceDelay : LANDING_ANIMATION.sequenceDelay
          )}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/professional">
              Crear cuenta gratis
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 bg-surface-container-lowest border-border hover:bg-surface-container-low rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/organization">Soy empresa</Link>
          </Button>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 8 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(
            isMobile
              ? LANDING_ANIMATION_MOBILE.sequenceDelay * 2
              : LANDING_ANIMATION.sequenceDelay * 2
          )}
        >
          <Link
            href="/jobs?experiencia=junior"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary font-medium transition-colors"
          >
            ¿Estudiante o recién graduado? Explora prácticas y vacantes junior
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="shrink-0" />
          </Link>
        </m.div>
      </div>
    </section>
  )
}
