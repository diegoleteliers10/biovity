import type { Metadata } from "next"
import { CTANosotros } from "@/components/landing/nosotros/CTANosotros"
import { Equipo } from "@/components/landing/nosotros/Equipo"
import { HistoriaMision } from "@/components/landing/nosotros/HistoriaMision"
import { NosotrosHero } from "@/components/landing/nosotros/NosotrosHero"
import { ProblemaSolucion } from "@/components/landing/nosotros/ProblemaSolucion"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "../../components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Nosotros | Conectando Talento Científico en Biovity",
  description:
    "Conoce a Biovity y su misión de conectar talento científico con oportunidades significativas en el sector de biociencias en Chile.",
  keywords: [
    "nosotros Biovity",
    "misión Biovity",
    "talento científico Chile",
    "plataforma empleos ciencias",
    "comunidad científica",
    "reclutamiento biotecnología",
  ],
  openGraph: {
    title: "Nosotros | Conectando Talento Científico en Biovity",
    description:
      "Conoce a Biovity y su misión de conectar talento científico con oportunidades significativas en el sector de biociencias.",
    url: "/nosotros",
    images: [
      {
        url: "/og/nosotros.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Nosotros",
      },
    ],
  },
  twitter: {
    title: "Nosotros | Conectando Talento Científico en Biovity",
    description:
      "Conoce a Biovity y su misión de conectar talento científico con oportunidades significativas.",
    images: ["/og/nosotros.png"],
  },
  alternates: {
    canonical: "/nosotros",
  },
}

export default function NosotrosPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Nosotros", url: "https://biovity.cl/nosotros" },
        ]}
      />
      <main className="flex flex-col relative">
        <NosotrosHero />
        <HistoriaMision />
        <ProblemaSolucion />
        <Equipo />
        <CTANosotros />
      </main>
    </LandingLayout>
  )
}
