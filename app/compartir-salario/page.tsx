import type { Metadata } from "next"
import { SalariosCrowdsourcing } from "@/components/landing/salarios/SalariosCrowdsourcing"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Compartir Salario | Biovity Chile",
  description:
    "Comparte tu sueldo de forma anónima y ayuda a construir el primer dataset abierto de sueldos STEM, salud y ciencias en Chile.",
  keywords: [
    "compartir salario Chile",
    "encuesta salarial anónima",
    "sueldos biociencias",
    "datos salariales Chile",
  ],
  openGraph: {
    title: "Compartir Salario | Biovity Chile",
    description:
      "Comparte tu sueldo de forma anónima y ayuda a construir el primer dataset abierto de sueldos STEM, salud y ciencias en Chile.",
    url: "/compartir-salario",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Compartir Salario - Biovity Chile",
      },
    ],
  },
  twitter: {
    title: "Compartir Salario | Biovity Chile",
    description:
      "Comparte tu sueldo de forma anónima y ayuda a construir el primer dataset abierto de sueldos STEM, salud y ciencias en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/compartir-salario",
  },
}

export default function CompartirSalarioPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Salarios", url: "https://biovity.cl/salarios" },
          { name: "Compartir Salario", url: "https://biovity.cl/compartir-salario" },
        ]}
      />
      <main className="flex flex-col relative">
        <SalariosCrowdsourcing />
      </main>
    </LandingLayout>
  )
}
