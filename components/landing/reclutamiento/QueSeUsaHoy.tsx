"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { HERRAMIENTAS_ACTUALES } from "@/lib/data/reclutamiento-data"

export function QueSeUsaHoy() {
  const reducedMotion = useReducedMotion()
  const transition = (delay: number) => getTransition({ delay, reducedMotion })

  return (
    <section className="bg-surface-container-low py-20 sm:py-24" id="que-se-usa-hoy">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <m.header
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={transition(0)}
          className="h-fit lg:col-span-4 lg:sticky lg:top-28"
        >
          <p className="mb-4 text-sm font-semibold text-secondary">El panorama actual</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Lo que se usa <span className="text-accent">hoy</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            Cinco caminos comunes para encontrar talento científico.
          </p>
        </m.header>

        <div className="overflow-hidden rounded-xl bg-surface-container-lowest lg:col-span-8">
          {HERRAMIENTAS_ACTUALES.map((item, index) => (
            <m.article
              key={item.title}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={transition(index * 0.06)}
              className="grid gap-4 border-b border-border/50 p-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.8fr)] sm:gap-8 sm:p-7"
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <HugeiconsIcon icon={item.icon} size={19} className="shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.examples}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.comoSeUsa}
                </p>
              </div>

              <div className="sm:pt-1">
                <p className="mb-3 text-sm font-semibold text-foreground">{item.tag}</p>
                <ul className="space-y-2">
                  {item.limitaciones.map((limitation) => (
                    <li
                      key={limitation}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={15}
                        className="mt-0.5 shrink-0 text-muted-foreground"
                      />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  )
}
