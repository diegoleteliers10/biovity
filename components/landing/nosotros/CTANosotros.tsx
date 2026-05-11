"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { Button } from "../../ui/button"

export function CTANosotros() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight text-balance"
          >
            ¿Listo para <span className="text-accent font-semibold">unirte</span>?
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto text-pretty"
          >
            Ya seas un profesional buscando oportunidades o una empresa buscando talento.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/register">
              <span>Crear cuenta gratis</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link
              href="/register/organization"
              className="inline-flex items-center justify-center gap-2"
            >
              Soy empresa
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 shrink-0" />
            </Link>
          </Button>
        </m.div>
      </div>
    </section>
  )
}
