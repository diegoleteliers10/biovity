"use client"

import { ChartsGrid } from "@/components/dashboard/employee/metrics/MetricsCharts"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { ProductShot } from "@/components/landing/demo/product-shot"
import { Reveal } from "@/components/ui/scroll-reveal"
import { DEMO_USER_METRICS_DATA } from "@/lib/data/demo/user-demo"

/**
 * Metrics visualization for the landing: the real ChartsGrid (recharts) fed
 * with a year of fixture data, framed as a product shot of the Métricas page.
 */
export function MetricsShowcase() {
  return (
    <section className="w-full bg-surface-container-lowest py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center md:mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-0 tracking-tight text-balance sm:text-4xl md:text-5xl">
            Tu búsqueda, <span className="text-accent font-semibold">con datos</span>
          </h2>
        </Reveal>

        {/* y={0}: tall frame, opacity carries the entrance. See Reveal. */}
        <Reveal className="mx-auto max-w-6xl" delay={0.1} y={0}>
          <ProductShot
            url="biovity.cl/dashboard/metrics"
            height="h-auto"
            caption="Datos ilustrativos de 12 meses"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <DemoHeader
                title="Métricas"
                subtitle="Analiza el rendimiento de tu búsqueda de empleo."
                unreadNotifications={2}
              />
              <ChartsGrid metricsData={DEMO_USER_METRICS_DATA} period="month" animated={false} />
            </div>
          </ProductShot>
        </Reveal>
      </div>
    </section>
  )
}

export default MetricsShowcase
