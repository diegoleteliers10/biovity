import { Result } from "better-result"
import type { Metadata } from "next"
import { AprendeMotion } from "@/components/landing/aprende/AprendeMotion"
import { SectionBenefits } from "@/components/landing/aprende/SectionBenefits"
import type { CategoryListing } from "@/components/landing/aprende/SectionCategories"
import { SectionCategories } from "@/components/landing/aprende/SectionCategories"
import { SectionCTA } from "@/components/landing/aprende/SectionCTA"
import { SectionHero } from "@/components/landing/aprende/SectionHero"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"
import { APRENDE_CATEGORIES } from "@/lib/data/aprende-data"
import { getCapsulesByCategory } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Aprende bioinformática e IA para biotecnología",
  description:
    "Aprende bioinformática e inteligencia artificial aplicada a biotecnología con cápsulas prácticas, ejercicios y evaluación.",
  keywords: ["aprendizaje", "bioinformática", "programación", "biociencia", "certificados"],
  openGraph: {
    title: "Aprende | Biovity",
    description:
      "Cápsulas de aprendizaje para el sector biocientífico. Aprende programación aplicada a biociencia.",
    url: "/learn",
    images: [{ url: "/og/learn.png", width: 1200, height: 630, alt: "Aprende en Biovity" }],
  },
  twitter: {
    title: "Aprende | Biovity",
    description:
      "Cápsulas de aprendizaje para el sector biocientífico. Aprende programación aplicada a biociencia.",
    images: ["/og/learn.png"],
  },
  alternates: { canonical: "/learn" },
}

export default async function AprendePage() {
  const listings = await Promise.all(
    APRENDE_CATEGORIES.map(async (category): Promise<CategoryListing> => {
      const result = await getCapsulesByCategory(category.slug)
      if (!Result.isOk(result)) return { category, status: "unavailable" }
      if (result.value.length === 0) return { category, status: "empty" }
      return { category, status: "available", capsules: result.value }
    })
  )

  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Aprende", url: "https://biovity.cl/learn" },
        ]}
      />
      <AprendeMotion>
        <SectionHero />
        <SectionBenefits />
        <SectionCategories listings={listings} />
        <SectionCTA />
      </AprendeMotion>
    </LandingLayout>
  )
}
