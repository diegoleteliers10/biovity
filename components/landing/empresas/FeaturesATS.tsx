"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { FEATURES_ATS } from "@/lib/data/empresas-data"

export function FeaturesATS() {
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
            Sistema ATS avanzado
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
          >
            Herramientas profesionales para gestionar el reclutamiento científico de principio a
            fin.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES_ATS.map((feature, index) => {
            const iconColor =
              index % 3 === 0
                ? "text-accent"
                : index % 3 === 1
                  ? "text-secondary"
                  : "text-muted-foreground"
            const iconBg =
              index % 3 === 0
                ? "bg-accent/10"
                : index % 3 === 1
                  ? "bg-secondary/10"
                  : "bg-[#e2e2e4]"
            return (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
                className="relative group"
              >
                <div className="bg-[#f3f3f5] rounded-2xl p-6 h-full border border-border/10 hover:border-secondary/20 hover:bg-secondary/5 transition-all duration-200">
                  <div
                    className={`size-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200 ${iconBg}`}
                  >
                    <HugeiconsIcon icon={feature.icon} size={28} className={iconColor} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </m.div>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
