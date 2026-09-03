import type { Metadata } from "next"
import { ComparativaTabla } from "@/components/landing/reclutamiento/ComparativaTabla"
import { ComoSeUsanHoy } from "@/components/landing/reclutamiento/ComoSeUsanHoy"
import { DiferenciaBiovity } from "@/components/landing/reclutamiento/DiferenciaBiovity"
import { FlujoComparativo } from "@/components/landing/reclutamiento/FlujoComparativo"
import { QueSeUsaHoy } from "@/components/landing/reclutamiento/QueSeUsaHoy"
import { ReclutamientoCTA } from "@/components/landing/reclutamiento/ReclutamientoCTA"
import { ReclutamientoFAQ } from "@/components/landing/reclutamiento/ReclutamientoFAQ"
import { ReclutamientoHero } from "@/components/landing/reclutamiento/ReclutamientoHero"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"
import { FAQS_RECLUTAMIENTO } from "@/lib/data/reclutamiento-data"

export const metadata: Metadata = {
  title: "Herramientas de Reclutamiento Científico en Chile | Biovity",
  description:
    "Compara las herramientas de reclutamiento actuales (ATS tradicionales, portales masivos, headhunters) contra la precisión del ecosistema científico y AI Matching de Biovity.",
  keywords: [
    "herramientas de reclutamiento científico",
    "software de reclutamiento biotecnología",
    "ATS científico Chile",
    "comparativa software ATS",
    "contratar científicos Chile",
    "reclutamiento biociencias",
    "evaluación de técnicas de laboratorio",
    "AI matching científico",
    "contratar bioquímicos",
    "contratar biotecnólogos",
    "portal empleo científico vs general",
  ],
  openGraph: {
    title: "Herramientas de Reclutamiento Científico: Estado Actual vs Biovity",
    description:
      "Descubre qué se usa hoy para contratar en ciencias, sus limitaciones y por qué Biovity reduce un 60% el tiempo de contratación con AI matching especializado.",
    url: "/reclutamiento",
    images: [
      {
        url: "/og/empresas.png",
        width: 1200,
        height: 630,
        alt: "Herramientas de Reclutamiento Científico - Biovity",
      },
    ],
  },
  twitter: {
    title: "Herramientas de Reclutamiento Científico | Biovity",
    description:
      "Qué se usa hoy, cómo se usa y la diferencia de Biovity para contratar talento en biociencias y biotecnología.",
    images: ["/og/empresas.png"],
  },
  alternates: {
    canonical: "/reclutamiento",
  },
}

export default function ReclutamientoPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQJsonLd faqs={FAQS_RECLUTAMIENTO} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Para Empresas", url: "https://biovity.cl/empresas" },
          { name: "Herramientas de Reclutamiento", url: "https://biovity.cl/reclutamiento" },
        ]}
      />
      <main className="flex flex-col relative">
        <ReclutamientoHero />
        <QueSeUsaHoy />
        <ComoSeUsanHoy />
        <DiferenciaBiovity />
        <ComparativaTabla />
        <FlujoComparativo />
        <ReclutamientoFAQ />
        <ReclutamientoCTA />
      </main>
    </LandingLayout>
  )
}
