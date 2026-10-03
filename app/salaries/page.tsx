import type { Metadata } from "next"
import { SalariosEmpresasB2B } from "@/components/landing/salarios/SalariosEmpresasB2B"
import { SalariosHero } from "@/components/landing/salarios/SalariosHero"
import { SalariosInteractiveFilter } from "@/components/landing/salarios/SalariosInteractiveFilter"
import { SalariosMetodologia } from "@/components/landing/salarios/SalariosMetodologia"
import { SalariosUpskilling } from "@/components/landing/salarios/SalariosUpskilling"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Sueldos en biotecnología, ciencias e ingeniería en Chile",
  description:
    "Explora rangos salariales orientativos en biotecnología, bioquímica, farmacia e ingeniería en Chile. Compara carreras y experiencia en pesos chilenos.",
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
      "Rangos salariales orientativos en biotecnología, bioquímica, farmacia e ingeniería en Chile. Compara carreras y experiencia en CLP.",
    url: "/salaries",
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
    description: "Rangos salariales orientativos en biotecnología y ciencias en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/salaries",
  },
}

export default function SalariosPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Salarios", url: "https://biovity.cl/salaries" },
        ]}
      />
      <main className="flex flex-col relative">
        <SalariosHero />
        <SalariosInteractiveFilter />
        <SalariosUpskilling />
        <SalariosEmpresasB2B />
        <SalariosMetodologia />
      </main>
    </LandingLayout>
  )
}
