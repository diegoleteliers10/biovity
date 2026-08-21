import type { Metadata } from "next"
import { MarcaColors } from "@/components/landing/marca/MarcaColors"
import { MarcaComponents } from "@/components/landing/marca/MarcaComponents"
import { MarcaHero } from "@/components/landing/marca/MarcaHero"
import { MarcaLogo } from "@/components/landing/marca/MarcaLogo"
import { MarcaPrinciples } from "@/components/landing/marca/MarcaPrinciples"
import { MarcaTypography } from "@/components/landing/marca/MarcaTypography"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  AboutPageJsonLd,
  BreadcrumbJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Guía de Marca & Sistema de Diseño | Biovity",
  description:
    "Conoce los fundamentos visuales, paleta de colores, tipografía, componentes y principios del System Design 'The Curated Organism' de Biovity.",
  keywords: [
    "Biovity marca",
    "Biovity brand",
    "Biovity design system",
    "sistema de diseño biociencias",
    "paleta de colores biovity",
    "identidad visual biotech",
  ],
  openGraph: {
    title: "Guía de Marca & Sistema de Diseño | Biovity",
    description:
      "Fundamentos visuales, paleta de colores, tipografía y biblioteca de componentes de Biovity.",
    url: "/marca",
    images: [
      {
        url: "/og/nosotros.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Guía de Marca",
      },
    ],
  },
  twitter: {
    title: "Guía de Marca & Sistema de Diseño | Biovity",
    description:
      "Fundamentos visuales, paleta de colores, tipografía y biblioteca de componentes de Biovity.",
    images: ["/og/nosotros.png"],
  },
  alternates: {
    canonical: "/marca",
  },
}

export default function MarcaPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <AboutPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Marca", url: "https://biovity.cl/marca" },
        ]}
      />
      <main className="flex flex-col relative">
        <MarcaHero />
        <MarcaPrinciples />
        <MarcaColors />
        <MarcaTypography />
        <MarcaLogo />
        <MarcaComponents />
      </main>
    </LandingLayout>
  )
}
