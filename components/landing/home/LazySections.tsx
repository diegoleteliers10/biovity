"use client"

import dynamic from "next/dynamic"
import { TrustStrip } from "@/components/landing/home/TrustStrip"

/*
 * Each placeholder reserves the same height as the section it stands in for, so
 * a section arriving never moves the scrollbar.
 *
 * No animate-pulse here on purpose. Six pulsing blocks repaint continuously from
 * first paint, which is exactly the cost the sections below are meant to defer.
 * A static block at low opacity communicates the same pending state for free.
 */
const content = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

const DashboardPreview = dynamic(
  () => import("@/components/landing/home/dashboard-preview").then((mod) => mod.DashboardPreview),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 md:py-36 bg-surface-container-lowest content-reserve-600">
        <div className={content}>
          <div className="h-9 w-80 bg-muted/50 rounded-lg mx-auto mb-16" />
          <div className="h-[560px] lg:h-[620px] bg-surface-container-low/60 border border-border/40 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

const MessagesShowcase = dynamic(
  () => import("@/components/landing/home/messages-showcase").then((mod) => mod.MessagesShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 md:py-36 bg-surface-container-low content-reserve-600">
        <div className={`${content} grid lg:grid-cols-2 gap-10 lg:gap-16`}>
          <div className="space-y-4">
            <div className="h-9 w-64 bg-muted/50 rounded-lg" />
            <div className="h-24 w-full bg-surface-container-lowest/60 rounded-xl" />
          </div>
          <div className="h-[520px] lg:h-[560px] bg-surface-container-lowest/60 border border-border/40 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

const MetricsShowcase = dynamic(
  () => import("@/components/landing/home/metrics-showcase").then((mod) => mod.MetricsShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 md:py-36 bg-surface-container-lowest content-reserve">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-72 bg-muted/50 rounded-lg mx-auto mb-16" />
          <div className="h-[520px] bg-surface-container-low/60 border border-border/40 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

const ConexionTalento = dynamic(
  () => import("@/components/landing/home/BeamSection").then((mod) => mod.ConexionTalento),
  {
    loading: () => (
      <div className="py-24 md:py-36 bg-surface-container-low content-reserve">
        <div className={content}>
          <div className="h-9 w-64 bg-muted/50 rounded-lg mx-auto mb-16" />
          <div className="h-48 bg-surface-container-lowest/60 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 bg-surface-container-lowest/60 border border-border/40 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  }
)

const Categories = dynamic(
  () => import("@/components/landing/home/Categories").then((mod) => mod.Categories),
  {
    loading: () => (
      <div className="py-24 md:py-36 bg-surface-container-lowest content-reserve">
        <div className={content}>
          <div className="h-9 w-64 bg-muted/50 rounded-lg mx-auto mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-24 bg-surface-container-low/70 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
)

const CTA = dynamic(() => import("@/components/landing/home/CTA").then((mod) => mod.CTA), {
  loading: () => (
    <div className="py-28 md:py-40 bg-surface-container-low content-reserve">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="h-10 w-80 bg-muted/50 rounded-lg mx-auto mb-4" />
        <div className="h-6 w-64 bg-muted/40 rounded mx-auto mb-8" />
        <div className="h-11 w-44 bg-muted/50 rounded-lg mx-auto" />
      </div>
    </div>
  ),
})

export function LazyLandingSections() {
  return (
    <>
      <TrustStrip />
      <DashboardPreview />
      <MessagesShowcase />
      <MetricsShowcase />
      <ConexionTalento />
      <Categories />
      <CTA />
    </>
  )
}
