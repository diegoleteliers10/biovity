import type { Metadata } from "next"
import { SalariosConclusiones } from "@/components/landing/salarios/SalariosConclusiones"
import { SalariosHero } from "@/components/landing/salarios/SalariosHero"
import { SalariosPorCarrera } from "@/components/landing/salarios/SalariosPorCarrera"
import { SalariosPorEducacion } from "@/components/landing/salarios/SalariosPorEducacion"
import { SalariosPorIndustria } from "@/components/landing/salarios/SalariosPorIndustria"
import { SalariosPorRegion } from "@/components/landing/salarios/SalariosPorRegion"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Estudio de Sueldos en Biociencias | Biovity",
  description:
    "Análisis exhaustivo de remuneraciones en el sector de biociencias en Chile. Datos por carrera, industria, región y nivel educativo (2024-2025).",
  keywords: [
    "sueldos biotecnología Chile",
    "salarios bioinformática",
    "remuneraciones ingeniería química",
    "sueldos ingeniería alimentos",
    "salarios química farmacia",
    "estudio salarial biociencias",
    "sueldos por región Chile",
    "salarios postgrado ciencias",
  ],
  openGraph: {
    title: "Estudio de Sueldos en Biociencias | Biovity",
    description:
      "Análisis exhaustivo de remuneraciones en el sector de biociencias en Chile. Datos segmentados por carrera, industria, región y nivel educativo.",
    url: "/salarios",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Estudio de Sueldos en Biociencias - Biovity",
      },
    ],
  },
  twitter: {
    title: "Estudio de Sueldos en Biociencias | Biovity",
    description: "Análisis exhaustivo de remuneraciones en el sector de biociencias en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/salarios",
  },
}

export default function SalariosPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Salarios", url: "https://biovity.cl/salarios" },
        ]}
      />
      <main className="flex flex-col relative">
        <SalariosHero />
        <SalariosPorCarrera />
        <SalariosPorIndustria />
        <SalariosPorRegion />
        <SalariosPorEducacion />
        <SalariosConclusiones />
      </main>
    </LandingLayout>
  )
}
