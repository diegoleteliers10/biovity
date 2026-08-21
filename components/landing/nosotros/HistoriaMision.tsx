"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PILARES_BIOVITY, VALUES_DATA } from "@/lib/data/nosotros-data"

export function HistoriaMision() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Narrative / Historia Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          <m.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="lg:col-span-5"
          >
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Origen & Manifiesto
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight leading-tight text-balance">
              La ciencia en Chile necesitaba su propio espacio
            </h2>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="lg:col-span-7 space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg text-pretty"
          >
            <p>
              Biovity nació en 2026 a partir de una observación crítica: mientras Chile forma científicos
              y profesionales de altísimo nivel en biotecnología, bioquímica, farmacia e ingeniería,
              el ecosistema laboral permanecía opaco, atomizado y desconectado.
            </p>
            <p>
              Muchos graduados y doctores enfrentaban ofertas sin bandas salariales claras o vacantes
              diluidas en portales genéricos sin rigor técnico. Al mismo tiempo, empresas y startups de
              biociencias luchaban por reclutar talento especializado.
            </p>
            <p className="font-medium text-foreground">
              Nuestra misión es cerrar esa brecha: crear un estándar transparente donde el conocimiento
              científico sea valorado en su justa medida.
            </p>
          </m.div>
        </div>

        {/* Misión, Visión, Valores Cards - Clean borderless white cards on surface-container-low */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {VALUES_DATA.map((item, index) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-white/80"
            >
              <div>
                <div className="size-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-5 text-primary">
                  <HugeiconsIcon icon={item.icon} size={20} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
            </m.div>
          ))}
        </div>

        {/* Pilares de Trabajo - Bordered anchor block */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(LANDING_ANIMATION.sequenceDelay)}
          className="bg-surface-container-lowest rounded-xl border border-border p-6 sm:p-8 md:p-10"
        >
          <h4 className="text-xs font-mono uppercase tracking-wider text-secondary mb-6 font-semibold">
            Nuestros Pilares Fundamentales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILARES_BIOVITY.map((pilar) => (
              <div key={pilar.title} className="flex gap-4 items-start">
                <div className="size-8 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 text-secondary mt-0.5">
                  <HugeiconsIcon icon={pilar.icon} size={16} />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-1">{pilar.title}</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                    {pilar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  )
}
