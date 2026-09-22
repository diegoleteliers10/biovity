"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { ConversionFunnelCard } from "@/components/dashboard/organization/ConversionFunnelCard"
import { GeographicDistributionCard } from "@/components/dashboard/organization/GeographicDistributionCard"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { ProductShot } from "@/components/landing/demo/product-shot"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { DEMO_FUNNEL, DEMO_GEO_DISTRIBUTION } from "@/lib/data/demo/organization-demo"

/**
 * Hiring-metrics visualization for the companies landing: the real
 * ConversionFunnelCard and GeographicDistributionCard (mapcn/maplibre map) side by
 side, exactly as they render on the organization metrics page.
 */
export function FunnelGeoShowcase() {
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
            Métricas de contratación
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
            Del anuncio al <span className="text-accent font-semibold">contrato</span>, medido
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed text-pretty">
            Cada etapa del proceso queda registrada: cuántos postulan, cuántos llegan a entrevista y
            desde qué ciudades viene el talento. Tus decisiones de contratación, con datos.
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
            caption="Vista: Métricas de organización · datos ilustrativos"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <DemoHeader
                title="Métricas"
                subtitle="Revisa el rendimiento de tus procesos de contratación."
                unreadNotifications={3}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <ConversionFunnelCard isPending={false} {...DEMO_FUNNEL} />
                <GeographicDistributionCard
                  isPending={false}
                  geographicDistribution={DEMO_GEO_DISTRIBUTION}
                />
              </div>
            </div>
          </ProductShot>
        </m.div>
      </div>
    </section>
  )
}

export default FunnelGeoShowcase
