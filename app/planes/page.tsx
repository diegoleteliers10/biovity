import type { Metadata } from "next"
import { Pricing } from "@/components/landing/empresas/Pricing"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Planes y Precios para Empresas | Biovity",
  description:
    "Elige el plan perfecto para tu empresa. Acceso a talento científico especializado en biotecnología, bioquímica, química e ingeniería química. Planes desde gratis.",
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
    description:
      "Planes simples y transparentes para empresas que buscan talento científico.",
    images: ["/og/empresas.png"],
  },
  alternates: {
    canonical: "/planes",
  },
}

export default function PlanesPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Para Empresas", url: "https://biovity.cl/empresas" },
          { name: "Planes y Precios", url: "https://biovity.cl/planes" },
        ]}
      />
      <main className="flex flex-col relative">
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-white pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Planes y Precios
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a las necesidades de tu empresa y comienza a reclutar
              talento científico hoy.
            </p>
          </div>
        </section>
        <Pricing />
      </main>
    </LandingLayout>
  )
}