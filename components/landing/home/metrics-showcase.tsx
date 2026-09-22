"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { ChartsGrid } from "@/components/dashboard/employee/metrics/MetricsCharts"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { ProductShot } from "@/components/landing/demo/product-shot"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { DEMO_USER_METRICS_DATA } from "@/lib/data/demo/user-demo"

/**
 * Metrics visualization for the landing: the real ChartsGrid (recharts) fed
 * with a year of fixture data, framed as a product shot of the Métricas page.
 */
export function MetricsShowcase() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="w-full bg-surface-container-lowest py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t()}
          className="mb-10 text-center md:mb-12"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Tus métricas
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
            Tu búsqueda, <span className="text-accent font-semibold">con datos</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed text-pretty">
            Cada postulación deja un rastro: cuántas enviaste, cuánto tardan en responderte y en qué
            etapa va cada proceso. Todo medido automáticamente en tu panel de métricas.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0.1)}
          className="mx-auto max-w-6xl"
        >
          <ProductShot
            url="biovity.cl/dashboard/metrics"
            height="h-auto"
            caption="Vista: Métricas · datos ilustrativos de 12 meses"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <DemoHeader
                title="Métricas"
                subtitle="Analiza el rendimiento de tu búsqueda de empleo."
                unreadNotifications={2}
              />
              <ChartsGrid metricsData={DEMO_USER_METRICS_DATA} period="year" />
            </div>
          </ProductShot>
        </m.div>
      </div>
    </section>
  )
}

export default MetricsShowcase
