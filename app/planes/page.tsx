import type { Metadata } from "next"
import { Pricing } from "@/components/landing/empresas/Pricing"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"
import { FAQS_EMPRESAS } from "@/lib/data/empresas-data"

export const metadata: Metadata = {
  title: "Planes y Precios para Empresas | Biovity",
  description:
    "Elige el plan perfecto para tu empresa. Acceso a talento científico especializado en biotecnología, bioquímica, química e ingeniería. Planes desde gratis.",
  keywords: [
    "planes empresas biotecnología",
    "precios ATS científico",
    "suscripción reclutamiento ciencias",
    "planes empresas chemistry",
    "precios software reclutamiento Chile",
    "talento científico planes",
  ],
  openGraph: {
    title: "Planes y Precios para Empresas | Biovity",
    description:
      "Planes simples y transparentes para empresas que buscan talento científico. Desde gratis hasta soluciones Enterprise.",
    url: "/planes",
    images: [
      {
        url: "/og/empresas.png",
        width: 1200,
        height: 630,
        alt: "Planes y Precios para Empresas - Biovity",
      },
    ],
  },
  twitter: {
    title: "Planes y Precios para Empresas | Biovity",
    description: "Planes simples y transparentes para empresas que buscan talento científico.",
    images: ["/og/empresas.png"],
  },
  alternates: {
    canonical: "/planes",
  },
}

export default function PlanesPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQJsonLd faqs={FAQS_EMPRESAS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Para Empresas", url: "https://biovity.cl/empresas" },
          { name: "Planes y Precios", url: "https://biovity.cl/planes" },
        ]}
      />
      <main className="flex flex-col relative pt-20 md:pt-28">
        <Pricing />
      </main>
    </LandingLayout>
  )
}
