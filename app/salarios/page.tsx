import type { Metadata } from "next"
import { SalariosCrowdsourcing } from "@/components/landing/salarios/SalariosCrowdsourcing"
import { SalariosEmpresasB2B } from "@/components/landing/salarios/SalariosEmpresasB2B"
import { SalariosHero } from "@/components/landing/salarios/SalariosHero"
import { SalariosInteractiveFilter } from "@/components/landing/salarios/SalariosInteractiveFilter"
import { SalariosMetodologia } from "@/components/landing/salarios/SalariosMetodologia"
import { SalariosUpskilling } from "@/components/landing/salarios/SalariosUpskilling"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  DatasetJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"
import { FAQS_SALARIOS } from "@/lib/data/salarios-data"

export const metadata: Metadata = {
  title: "Portal de Salarios en Ciencias e Ingeniería | Biovity Chile",
  description:
    "Inteligencia salarial del mercado chileno en biociencias, química, farmacia, ingeniería y salud. Encuesta anónima Give to Get, impacto de habilidades y guías B2B en CLP.",
  keywords: [
    "sueldos biotecnología Chile",
    "salarios bioinformática",
    "remuneraciones ingeniería química",
    "sueldos ingeniería alimentos",
    "salarios química farmacia",
    "estudio salarial biociencias",
    "sueldos por región Chile",
    "salarios postgrado ciencias",
    "bandas salariales empresas Chile",
    "encuesta salarial anónima",
    "percentil sueldo Chile",
  ],
  openGraph: {
    title: "Portal de Salarios en Ciencias e Ingeniería | Biovity Chile",
    description:
      "Inteligencia salarial del mercado chileno en biociencias, química, farmacia, ingeniería y salud. Encuesta anónima, impacto de habilidades y guías B2B en CLP.",
    url: "/salarios",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Portal de Salarios en Ciencias e Ingeniería - Biovity Chile",
      },
    ],
  },
  twitter: {
    title: "Portal de Salarios en Ciencias e Ingeniería | Biovity Chile",
    description:
      "Inteligencia salarial del mercado chileno en biociencias, química, farmacia, ingeniería y salud.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/salarios",
  },
}

export default function SalariosPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <DatasetJsonLd
        name="Portal de Salarios en Ciencias e Ingeniería | Biovity Chile"
        description="Inteligencia salarial del mercado chileno en biociencias, quimica, farmacia, ingenieria y salud. Encuesta anonima Give to Get, impacto de habilidades y guias B2B en CLP."
        url="https://biovity.cl/salarios"
        creatorName="Biovity"
        datePublished="2025-01-01"
        keywords={[
          "sueldos biotecnologia Chile",
          "salarios bioinformatica",
          "remuneraciones ingenieria quimica",
          "sueldos por region Chile",
          "biociencias salarios",
          "bandas salariales empresas Chile",
        ]}
      />
      <OrganizationJsonLd />
      <FAQJsonLd faqs={FAQS_SALARIOS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Salarios", url: "https://biovity.cl/salarios" },
        ]}
      />
      <main className="flex flex-col relative">
        <SalariosHero />
        <SalariosInteractiveFilter />
        <SalariosCrowdsourcing />
        <SalariosUpskilling />
        <SalariosEmpresasB2B />
        <SalariosMetodologia />
      </main>
    </LandingLayout>
  )
}
