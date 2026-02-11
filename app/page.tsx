import type { Metadata } from "next"
import { Categories } from "@/components/landing/home/Categories"
import { CTA } from "@/components/landing/home/CTA"
import { ForStudents } from "@/components/landing/home/ForStudents"
import { Hero } from "@/components/landing/home/Hero"
import { HowItWorks } from "@/components/landing/home/HowItWorks"
import { TransparencyGuarantee } from "@/components/landing/home/TransparencyGuarantee"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { JobBoardJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "../components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Biovity | Encuentra Trabajo en Biotecnología, Bioquímica y Ciencias en Chile",
  description:
    "Biovity es el portal de empleo especializado en biotecnología, bioquímica, química, ingeniería química y salud. Encuentra tu próximo trabajo en ciencias en Chile.",
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
    title: "Biovity | Encuentra Trabajo en Biotecnología y Ciencias",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química e ingeniería química. Donde el talento y la ciencia se encuentran.",
    url: "/",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Donde el talento y la ciencia se encuentran",
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
        <TransparencyGuarantee />
        <HowItWorks />
        <ForStudents />
        <Categories />
        <CTA />
      </main>
    </LandingLayout>
  )
}
