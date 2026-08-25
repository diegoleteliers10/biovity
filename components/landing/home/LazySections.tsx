"use client"

import dynamic from "next/dynamic"

const TransparencyGuarantee = dynamic(
  () =>
    import("@/components/landing/home/TransparencyGuarantee").then(
      (mod) => mod.TransparencyGuarantee
    ),
  {
    ssr: false,
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
    ssr: false,
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

const HowItWorks = dynamic(
  () => import("@/components/landing/home/HowItWorks").then((mod) => mod.HowItWorks),
  {
    ssr: false,
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
    ssr: false,
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
    ssr: false,
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
  ssr: false,
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
      <TransparencyGuarantee />
      <ConexionTalento />
      <HowItWorks />
      <ForStudents />
      <Categories />
      <CTA />
    </>
  )
}
