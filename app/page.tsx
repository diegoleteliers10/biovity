import type { Metadata } from "next"
import { Hero } from "@/components/landing/home/Hero"
import { LazyLandingSections } from "@/components/landing/home/LazySections"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { JobBoardJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "../components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Biovity | Empleos en Biotecnología, Bioquímica y Ciencias en Chile",
  description:
    "Encuentra empleos en biotecnología, bioquímica, química, ingeniería química, salud y laboratorios en Chile. Portal de empleo especializado en biociencias. Gratis para profesionales.",
  keywords: [
    "empleos biotecnología chile",
    "empleos biociencias chile",
    "empleos bioquímica chile",
    "empleos química chile",
    "empleos ingeniería química chile",
    "empleos salud chile",
    "empleos laboratorio chile",
    "empleos farmacéutico chile",
    "empleos I+D chile",
    "empleos investigación chile",
    "portal empleo biociencias",
    "portal empleo biotecnología chile",
    "portal empleo científico chile",
    "trabajo biotecnología chile",
    "trabajo bioquímica chile",
    "trabajo laboratorio chile",
    "bolsa trabajo biotecnología",
    "bolsa trabajo ciencias",
    "empleo científico chile",
  ],
  openGraph: {
    title: "Biovity | Empleos en Biotecnología y Biociencias en Chile",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química e ingeniería química. Encuentra tu trabajo ideal en ciencias en Chile.",
    url: "/",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Portal de Empleo en Biotecnología y Biociencias",
      },
    ],
  },
  twitter: {
    title: "Biovity | Encuentra Trabajo en Biotecnología y Ciencias",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química e ingeniería química en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <LandingLayout>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <JobBoardJsonLd />
      <main className="flex flex-col relative">
        <Hero />
        <LazyLandingSections />
      </main>
    </LandingLayout>
  )
}
