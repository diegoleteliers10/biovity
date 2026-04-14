"use client"

import { ArrowRight01Icon, GraduationScrollIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { Badge } from "@/components/ui/badge"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { BENEFITS_FOR_STUDENTS } from "@/lib/data/home-data"

export function ForStudents() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
          >
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(0)}
              className="mb-6"
            >
              <Badge variant="secondary">Para estudiantes y graduados</Badge>
            </m.div>
            <m.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(LANDING_ANIMATION.sequenceDelay)}
              className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance"
            >
              Da tu primer paso en la ciencia
            </m.h2>
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(LANDING_ANIMATION.sequenceDelay * 2)}
              className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty"
            >
              Entendemos que dar el primer paso en el mundo laboral puede ser desafiante. Por eso
              creamos una plataforma diseñada específicamente para ayudarte a comenzar tu carrera en
              biotecnología, química y ciencias de la salud.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {BENEFITS_FOR_STUDENTS.map((benefit, index) => (
                <m.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                  transition={ts(index * LANDING_ANIMATION.chainStagger)}
                  className="flex items-start space-x-3 p-4 bg-[#f3f3f5] rounded-xl hover:bg-[#e2e2e4] transition-colors"
                >
                  <div className="p-2 rounded-lg bg-secondary/10 flex-shrink-0">
                    <HugeiconsIcon icon={benefit.icon} size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{benefit.title}</h4>
                    <p className="text-muted-foreground text-xs mt-1">{benefit.description}</p>
                  </div>
                </m.div>
              ))}
            </m.div>

            <button
              type="button"
              className="inline-flex items-center px-8 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full font-medium transition-all duration-200 hover:-translate-y-1"
            >
              Explorar oportunidades
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
            </button>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="relative"
          >
            <div className="bg-accent/5 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <HugeiconsIcon
                      icon={GraduationScrollIcon}
                      className="w-10 h-10 text-secondary"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl">Estudiantes</h3>
                    <p className="text-muted-foreground text-sm">Tu futuro comienza aquí</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#f3f3f5] rounded-xl">
                    <span className="text-foreground font-medium">Ofertas para graduados</span>
                    <span className="text-2xl font-bold text-primary">+200</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#f3f3f5] rounded-xl">
                    <span className="text-foreground font-medium">Prácticas disponibles</span>
                    <span className="text-2xl font-bold text-secondary">+85</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#f3f3f5] rounded-xl">
                    <span className="text-foreground font-medium">Empresas aliadas</span>
                    <span className="text-2xl font-bold text-accent">+50</span>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
