import type { Metadata } from "next"
import { TrabajosPageContent } from "@/components/landing/trabajos/TrabajosPageContent"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  OrganizationJsonLd,
} from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Trabajos en Ciencias | Biovity",
  description:
    "Encuentra oportunidades laborales en biotecnología, bioquímica, química e ingeniería química en Chile. Portal de empleo especializado en ciencias.",
  keywords: [
    "empleo biotecnología Chile",
    "trabajo bioquímica",
    "ofertas empleo química",
    "trabajo ingeniería química",
    "empleo laboratorio",
    "trabajo investigación científica",
    "portal empleo científico Chile",
    "buscar trabajo ciencias",
  ],
  openGraph: {
    title: "Trabajos en Ciencias | Biovity",
    description:
      "Encuentra oportunidades laborales en biotecnología, bioquímica, química e ingeniería química en Chile.",
    url: "/trabajos",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Trabajos en Ciencias",
      },
    ],
  },
  twitter: {
    title: "Trabajos en Ciencias | Biovity",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química e ingeniería química en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/trabajos",
  },
}

export default function TrabajosPage() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Trabajos", url: "https://biovity.cl/trabajos" },
        ]}
      />
      <main className="flex flex-col relative">
        <TrabajosPageContent />
      </main>
    </LandingLayout>
  )
}
