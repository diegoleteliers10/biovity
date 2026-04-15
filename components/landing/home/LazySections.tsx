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
      <div className="py-24 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-muted rounded mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted/50 rounded-xl" />
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
      <div className="py-24 bg-[#f3f3f5] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-lg" />
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
      <div className="py-24 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 bg-muted rounded mb-8" />
          <div className="space-y-4">
            <div className="h-24 bg-muted/50 rounded-xl" />
            <div className="h-24 bg-muted/50 rounded-xl" />
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
      <div className="py-24 bg-[#f3f3f5] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-28 bg-muted/50 rounded-lg" />
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
    <div className="py-24 bg-white animate-pulse">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="h-10 w-80 bg-muted rounded mx-auto mb-6" />
        <div className="h-6 w-96 bg-muted/50 rounded mx-auto mb-8" />
        <div className="h-12 w-40 bg-muted rounded mx-auto" />
      </div>
    </div>
  ),
})

const ConexionTalento = dynamic(
  () => import("@/components/landing/home/BeamSection").then((mod) => mod.ConexionTalento),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 bg-[#f3f3f5] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-64 bg-muted rounded mb-8" />
          <div className="h-64 bg-muted/50 rounded-xl" />
        </div>
      </div>
    ),
  }
)

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
