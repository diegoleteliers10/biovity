"use client"

import dynamic from "next/dynamic"

const DashboardPreview = dynamic(
  () => import("@/components/landing/home/dashboard-preview").then((mod) => mod.DashboardPreview),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-44 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-80 bg-muted rounded-lg mx-auto mb-16" />
          <div className="h-[560px] lg:h-[620px] bg-surface-container-low border border-border/50 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

const TransparencyGuarantee = dynamic(
  () =>
    import("@/components/landing/home/TransparencyGuarantee").then(
      (mod) => mod.TransparencyGuarantee
    ),
  {
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-low animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-72 bg-muted rounded-lg mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-surface-container-lowest rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
)

const ConexionTalento = dynamic(
  () => import("@/components/landing/home/BeamSection").then((mod) => mod.ConexionTalento),
  {
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-72 bg-muted rounded-lg mx-auto mb-16" />
          <div className="h-48 bg-surface-container-low rounded-2xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 bg-surface-container-low border border-border rounded-xl"
              />
            ))}
          </div>
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
      <div className="py-20 md:py-28 bg-surface-container-low animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="h-4 w-36 bg-muted rounded-full" />
            <div className="h-9 w-64 bg-muted rounded-lg" />
            <div className="h-24 w-full bg-surface-container-lowest rounded-xl" />
          </div>
          <div className="h-[520px] lg:h-[560px] bg-surface-container-lowest border border-border/50 rounded-2xl" />
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
      <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-32 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-72 bg-muted rounded-lg mx-auto mb-16" />
          <div className="h-[520px] bg-surface-container-low border border-border/50 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

const HowItWorks = dynamic(
  () => import("@/components/landing/home/HowItWorks").then((mod) => mod.HowItWorks),
  {
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-low animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-64 bg-muted rounded-lg mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-40 bg-surface-container-lowest rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
)

const ForStudents = dynamic(
  () => import("@/components/landing/home/ForStudents").then((mod) => mod.ForStudents),
  {
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-72 bg-muted rounded-lg mx-auto mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-surface-container-low rounded-xl" />
            <div className="h-80 bg-surface-container-low border border-border rounded-xl" />
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
      <div className="py-20 md:py-28 bg-surface-container-low animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-64 bg-muted rounded-lg mx-auto mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-24 bg-surface-container-lowest rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
)

const CTA = dynamic(() => import("@/components/landing/home/CTA").then((mod) => mod.CTA), {
  loading: () => (
    <div className="py-24 bg-surface-container-lowest animate-pulse">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="h-8 w-32 bg-muted rounded-full mx-auto mb-6" />
        <div className="h-10 w-80 bg-muted rounded-lg mx-auto mb-4" />
        <div className="h-6 w-96 bg-muted/60 rounded mx-auto mb-8" />
        <div className="h-11 w-44 bg-muted rounded-lg mx-auto" />
      </div>
    </div>
  ),
})

export function LazyLandingSections() {
  return (
    <>
      <DashboardPreview />
      <TransparencyGuarantee />
      <ConexionTalento />
      <MessagesShowcase />
      <MetricsShowcase />
      <HowItWorks />
      <ForStudents />
      <Categories />
      <CTA />
    </>
  )
}
