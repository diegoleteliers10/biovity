"use client"

import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { Button } from "../../ui/button"

export function CTA() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const benefits = [
    "Acceso a ofertas exclusivas",
    "Perfil destacado para recruiters",
    "Alertas personalizadas",
    "Recursos para tu carrera",
  ]

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
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance"
          >
            ¿Listo para dar el siguiente paso?
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto text-pretty"
          >
            Únete a miles de profesionales que ya encontraron su camino en la ciencia
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button type="button" variant="secondary" size="lg" className="px-8 py-4">
            Crear cuenta gratis
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
          </Button>
          <Button type="button" variant="ghost" size="lg" className="px-8 py-4">
            Soy empresa
          </Button>
        </m.div>

        <m.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(LANDING_ANIMATION.sequenceDelay * 3)}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm"
        >
          {benefits.map((benefit, index) => (
            <m.div
              key={benefit}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger * 0.5)}
              className="flex items-center text-muted-foreground"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 mr-2 text-secondary" />
              {benefit}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
