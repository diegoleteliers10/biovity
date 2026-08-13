import type { Metadata } from "next"
import { ConsejosCTA } from "@/components/landing/consejos/ConsejosCTA"
import { ConsejosFAQ } from "@/components/landing/consejos/ConsejosFAQ"
import { ConsejosGrid } from "@/components/landing/consejos/ConsejosGrid"
import { ConsejosHero } from "@/components/landing/consejos/ConsejosHero"
import { ConsejosHerramientas } from "@/components/landing/consejos/ConsejosHerramientas"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"
import { CONSEJOS_FAQS } from "@/lib/data/consejos-carrera-data"

export const metadata: Metadata = {
  title: "Consejos de Carrera en Biociencias y Biotech | Biovity",
  description:
    "Guías de carrera para científicos, ingenieros en biotecnología y farmacéuticos en Chile. Optimiza tu CV ATS, prepara entrevistas técnicas y pasa de la academia a la industria.",
  keywords: [
    "consejos de carrera ciencias",
    "CV biotecnología ATS",
    "transición academia industria",
    "entrevistas técnicas laboratorio",
    "negociación salarial científico",
    "empleos biociencias Chile",
    "carrera bioinformática",
  ],
  openGraph: {
    title: "Consejos de Carrera en Biociencias y Biotech | Biovity",
    description:
      "Guías prácticas y estrategias de mentores para acelerar tu crecimiento profesional en biotecnología, química y farmacia.",
    url: "/consejos-carrera",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Consejos de Carrera en Biociencias - Biovity",
      },
    ],
  },
  twitter: {
    title: "Consejos de Carrera en Biociencias y Biotech | Biovity",
    description: "Guías prácticas y estrategias para profesionales en biotecnología y biociencias.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/consejos-carrera",
  },
}

export default function ConsejosCarreraPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FAQJsonLd faqs={CONSEJOS_FAQS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Consejos de Carrera", url: "https://biovity.cl/consejos-carrera" },
        ]}
      />
      <main className="flex flex-col relative">
        <ConsejosHero />
        <ConsejosGrid />
        <ConsejosHerramientas />
        <ConsejosFAQ />
        <ConsejosCTA />
      </main>
    </LandingLayout>
  )
}
