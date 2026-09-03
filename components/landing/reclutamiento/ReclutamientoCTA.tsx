"use client"

import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function ReclutamientoCTA() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const benefits = [
    "Plan Free disponible para siempre",
    "Sin comisiones sobre contratación",
    "Acceso inmediato a la red científica de Chile",
  ]

  return (
    <section className="py-24 bg-surface-container-low border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Evoluciona tu Selección Científica
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
            Deja atrás los filtros ciegos y{" "}
            <span className="text-accent font-semibold">recluta con precisión</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto text-pretty">
            Crea tu cuenta de organización en 2 minutos y publica tu primera oferta científica con
            evaluación de técnicas y AI Matching integrado.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/organization">
              Comenzar a reclutar gratis
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 bg-surface-container-lowest border-border/40 hover:bg-surface-container-low rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/planes">Ver planes y precios</Link>
          </Button>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground"
        >
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-secondary" />
              <span>{benefit}</span>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
