"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { VALUES_DATA } from "@/lib/data/nosotros-data"

export function HistoriaMision() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Historia Section */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="mb-16 max-w-4xl mx-auto"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"
          >
            Nuestra{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Historia
            </span>
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
            className="text-xl text-muted-foreground leading-relaxed text-pretty"
          >
            Biovity nació en 2026 con una misión clara: resolver el problema de dispersión en el
            mercado laboral de ciencias. Vimos que profesionales y estudiantes altamente capacitados
            luchaban por encontrar oportunidades, mientras empresas en biotecnología, química y
            farmacia enfrentaban dificultades para encontrar talento especializado.
          </m.p>
        </m.div>

        {/* Values Grid */}
        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {VALUES_DATA.map((item, index) => {
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
                key={item.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
                className="group bg-[#f3f3f5] rounded-2xl p-8 border border-border/10 hover:border-secondary/20 hover:bg-secondary/5 transition-all duration-200"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}
                >
                  <HugeiconsIcon icon={item.icon} size={32} className={`${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </m.div>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
