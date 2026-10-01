"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
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

  return (
    <section className="py-28 md:py-40 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight tracking-tight text-balance">
            Forma parte del futuro de la{" "}
            <span className="text-accent font-semibold">ciencia chilena</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto text-pretty">
            Profesionales, universidades y empresas, en una sola red.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
      </div>
    </section>
  )
}
