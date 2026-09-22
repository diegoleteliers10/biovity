"use client"

import dynamic from "next/dynamic"

const shotSkeleton = (
  <div className="py-20 md:py-28 bg-surface-container-low animate-pulse">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-4 w-48 bg-muted rounded-full mx-auto mb-3" />
      <div className="h-9 w-96 bg-muted rounded-lg mx-auto mb-16" />
      <div className="h-[420px] bg-surface-container-lowest border border-border/50 rounded-2xl" />
    </div>
  </div>
)

const shotSkeletonLowest = (
  <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-4 w-48 bg-muted rounded-full mx-auto mb-3" />
      <div className="h-9 w-96 bg-muted rounded-lg mx-auto mb-16" />
      <div className="h-[420px] bg-surface-container-low border border-border/50 rounded-2xl" />
    </div>
  </div>
)

const FunnelGeoShowcase = dynamic(
  () =>
    import("@/components/landing/empresas/funnel-geo-showcase").then(
      (mod) => mod.FunnelGeoShowcase
    ),
  { ssr: false, loading: () => shotSkeletonLowest }
)

const TalentShowcase = dynamic(
  () => import("@/components/landing/empresas/talent-showcase").then((mod) => mod.TalentShowcase),
  { ssr: false, loading: () => shotSkeleton }
)

export function LazyFunnelGeoShowcase() {
  return <FunnelGeoShowcase />
}

export function LazyTalentShowcase() {
  return <TalentShowcase />
}
