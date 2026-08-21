"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { AdnBeam } from "@/components/landing/home/common/AdnBeam"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getSpringTransition, getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"

export function ConexionTalento() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const chainStagger = isMobile ? LANDING_ANIMATION_MOBILE.chainStagger : LANDING_ANIMATION.chainStagger
  const viewportMargin = isMobile ? LANDING_ANIMATION_MOBILE.viewportMargin : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 16 : 24

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Ecosistema Integrado
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Conectamos el talento con la <span className="text-accent font-semibold">industria científica</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Facilitamos el encuentro entre profesionales del sector científico y organizaciones que buscan especialistas en biotecnología y ciencias aplicadas en Chile.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: yOffset }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={ts(isMobile ? LANDING_ANIMATION_MOBILE.sequenceDelay : LANDING_ANIMATION.sequenceDelay)}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-4xl mb-14 mx-auto flex justify-center">
            <AdnBeam />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <m.div
              initial={isReduced ? false : { opacity: 0, y: yOffset }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={ts(chainStagger)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-8 border border-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                    Paso 01
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Empresas publican</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  Publica vacantes técnicas especificando técnicas de laboratorio, proyectos y bandas salariales.
                </p>
              </div>
            </m.div>

            <m.div
              initial={isReduced ? false : { opacity: 0, y: yOffset }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={ts(chainStagger * 2)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-8 border border-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                    Paso 02
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Candidatos postulan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  Profesionales e investigadores aplican de forma directa destacando experiencia experimental y proyectos.
                </p>
              </div>
            </m.div>

            <m.div
              initial={isReduced ? false : { opacity: 0, y: yOffset }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: viewportMargin }}
              transition={ts(chainStagger * 3)}
              className="bg-surface-container-low rounded-xl p-6 sm:p-8 border border-accent/30 bg-accent/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-accent bg-accent/10 border border-accent/25 px-2.5 py-1 rounded-full">
                    Paso 03
                  </span>
                  <Badge variant="secondary" className="bg-accent/15 text-accent border-0 text-[10px] px-2 py-0.5 font-mono">
                    AI Match
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Match de precisión</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                  Nuestros filtros científicos conectan los requerimientos del puesto con el candidato ideal.
                </p>
              </div>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
