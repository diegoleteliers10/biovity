import type { Metadata } from "next"
import { SectionBenefits } from "@/components/landing/aprende/SectionBenefits"
import { SectionCategories } from "@/components/landing/aprende/SectionCategories"
import { SectionCTA } from "@/components/landing/aprende/SectionCTA"
import { SectionHero } from "@/components/landing/aprende/SectionHero"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Aprende | Biovity",
  description:
    "Cápsulas de aprendizaje para el sector biocientífico. Aprende programación aplicada a biociencia y obtén certificados verificables.",
  keywords: ["aprendizaje", "bioinformática", "programación", "biociencia", "certificados"],
  openGraph: {
    title: "Aprende | Biovity",
    description:
      "Cápsulas de aprendizaje para el sector biocientífico. Aprende programación aplicada a biociencia.",
    url: "/aprende",
    images: [{ url: "/og/aprende.png", width: 1200, height: 630, alt: "Aprende en Biovity" }],
  },
  twitter: {
    title: "Aprende | Biovity",
    description:
      "Cápsulas de aprendizaje para el sector biocientífico. Aprende programación aplicada a biociencia.",
    images: ["/og/aprende.png"],
  },
  alternates: { canonical: "/aprende" },
}

export default function AprendePage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Aprende", url: "https://biovity.cl/aprende" },
        ]}
      />
      <main className="flex flex-col relative">
        <SectionHero />
        <SectionBenefits />
        <SectionCategories />
        <SectionCTA />
      </main>
    </LandingLayout>
  )
}
