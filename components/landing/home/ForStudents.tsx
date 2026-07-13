"use client"

import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons"
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
              className="text-3xl md:text-5xl font-semibold text-foreground mb-6 text-balance"
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
                  className="flex items-start gap-3 p-4 bg-[#f3f3f5] rounded-xl hover:bg-[#e2e2e4] transition-colors"
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
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 ml-2" />
            </button>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="relative"
          >
            <div className="bg-accent/5 rounded-3xl p-6 sm:p-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="size-14 shrink-0 rounded-full bg-gradient-to-tr from-secondary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    SA
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-foreground text-base truncate">Sofía Alarcón</h3>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-blue-500 shrink-0" />
                    </div>
                    <p className="text-muted-foreground text-xs font-medium truncate">Ingeniería Civil en Biotecnología</p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-0.5">
                      <HugeiconsIcon icon={Location01Icon} size={12} className="shrink-0" />
                      <span>Santiago, Chile</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 border border-green-500/20">
                    Disponible para Práctica / I+D
                  </span>
                </div>

                {/* Divider */}
                <hr className="my-5 border-slate-100" />

                {/* Lab Skills */}
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground/90 uppercase tracking-wider mb-2">
                    Técnicas Experimentales
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/5 text-secondary border border-secondary/15">
                      PCR Tiempo Real
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/5 text-secondary border border-secondary/15">
                      Cultivo Celular
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/5 text-secondary border border-secondary/15">
                      HPLC
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary/5 text-secondary border border-secondary/15">
                      CRISPR-Cas9
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-primary/5 text-primary border border-primary/15">
                      Inglés Técnico (C1)
                    </span>
                  </div>
                </div>

                {/* Thesis Project */}
                <div className="mt-5">
                  <h4 className="text-[10px] font-bold text-muted-foreground/90 uppercase tracking-wider mb-2">
                    Proyecto de Tesis
                  </h4>
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100/80">
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      Optimización de vectores de expresión para la producción a escala de proteínas recombinantes en Escherichia coli.
                    </p>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">Perfil verificado Biovity</span>
                    <span className="font-bold text-primary">95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-primary rounded-full w-[95%]" />
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
