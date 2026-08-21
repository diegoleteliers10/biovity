"use client"

import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function CTANosotros() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const benefits = [
    "100% Gratuito para profesionales",
    "Datos salariales 100% anónimos",
    "Ofertas de empleo reales y verificadas",
  ]

  return (
    <section className="py-24 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Únete a la red
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
            ¿Listo para formar parte del futuro de la{" "}
            <span className="text-accent font-semibold">ciencia en Chile</span>?
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto text-pretty">
            Ya seas un investigador explorando nuevas oportunidades o una empresa buscando talento
            especializado, Biovity es tu punto de encuentro.
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
            <Link href="/register/professional">
              Crear perfil profesional
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 bg-surface-container-lowest border-border/30 hover:bg-surface-container-low rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/organization">Soy empresa o institución</Link>
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
