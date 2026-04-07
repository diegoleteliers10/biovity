"use client"

import dynamic from "next/dynamic"

const TransparencyGuarantee = dynamic(
  () => import("@/components/landing/home/TransparencyGuarantee").then((mod) => mod.TransparencyGuarantee),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-white" />,
  }
)

const HowItWorks = dynamic(
  () => import("@/components/landing/home/HowItWorks").then((mod) => mod.HowItWorks),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-white" />,
  }
)

const ForStudents = dynamic(
  () => import("@/components/landing/home/ForStudents").then((mod) => mod.ForStudents),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-[#f3f3f5]" />,
  }
)

const Categories = dynamic(
  () => import("@/components/landing/home/Categories").then((mod) => mod.Categories),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-[#f3f3f5]" />,
  }
)

const CTA = dynamic(() => import("@/components/landing/home/CTA").then((mod) => mod.CTA), {
  ssr: false,
  loading: () => <div className="py-24 bg-white" />,
})

const ConexionTalento = dynamic(
  () => import("@/components/landing/home/BeamSection").then((mod) => mod.ConexionTalento),
  {
    ssr: false,
    loading: () => <div className="py-24 bg-[#f3f3f5]" />,
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
