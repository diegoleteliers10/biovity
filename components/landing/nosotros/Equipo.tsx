"use client"

import { Linkedin02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function Equipo() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance"
          >
            Nuestro <span className="text-accent font-semibold">Equipo</span>
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground text-pretty"
          >
            Conecta con nosotros
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex justify-center"
        >
          <div className="bg-[#f3f3f5] rounded-2xl p-8 border border-border/10 max-w-md w-full text-center hover:bg-secondary/5 transition-colors">
            {/* Photo/Avatar */}
            <div className="mx-auto mb-6 size-28 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-4xl font-semibold text-white">DL</span>
            </div>

            {/* Name and Role */}
            <m.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={t(LANDING_ANIMATION.sequenceDelay * 3)}
              className="text-2xl font-semibold text-foreground mb-1"
            >
              Diego Letelier
            </m.h3>
            <p className="text-base text-accent mb-4 font-semibold">CEO/CTO & Fundador</p>

            {/* Brief Description */}
            <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">
              Apasionado por conectar talento científico con oportunidades significativas en el
              sector de biociencias en Chile.
            </p>

            {/* LinkedIn Link */}
            <a
              href="https://linkedin.com/in/diegoleteliers10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium align-center"
              aria-label="Ir al perfil de LinkedIn de Diego Letelier"
            >
              <HugeiconsIcon icon={Linkedin02Icon} className="size-4" />
            </a>
          </div>
        </m.div>
      </div>
    </section>
  )
}
