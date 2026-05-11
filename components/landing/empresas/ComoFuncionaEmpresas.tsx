"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PASOS_EMPRESAS } from "@/lib/data/empresas-data"

export function ComoFuncionaEmpresas() {
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
            className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance"
          >
            Cómo funciona para empresas
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            En solo 4 pasos, estarás contratando al talento científico que tu empresa necesita.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {PASOS_EMPRESAS.map((paso, index) => (
            <m.div
              key={paso.number}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="relative group"
            >
              <div className="bg-[#f3f3f5] rounded-2xl p-6 h-full border border-border/10 hover:border-secondary/20 hover:bg-secondary/5 transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="size-14 rounded-xl bg-secondary flex items-center justify-center">
                    <HugeiconsIcon icon={paso.icon} size={28} className="text-white" />
                  </div>
                  <span className="text-4xl font-semibold text-[#e2e2e4] group-hover:text-secondary/30 transition-colors duration-200">
                    {paso.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{paso.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{paso.description}</p>
              </div>
              {/* Connector line for desktop */}
              {paso.number !== "04" && (
                <div
                  className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-[calc(100%+0.5rem)] w-8 h-0.5 bg-gradient-to-r from-secondary/30 to-accent/30 pointer-events-none"
                  aria-hidden
                />
              )}
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
