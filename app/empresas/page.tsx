import type { Metadata } from "next"
import { ComoFuncionaEmpresas } from "@/components/landing/empresas/ComoFuncionaEmpresas"
import { CTAContacto } from "@/components/landing/empresas/CTAContacto"
import { FAQ } from "@/components/landing/empresas/FAQ"
import { FeaturesATS } from "@/components/landing/empresas/FeaturesATS"
import { HeroEmpresas } from "@/components/landing/empresas/HeroEmpresas"
// import { LogosEmpresas } from "@/components/landing/empresas/LogosEmpresas"
import { Pricing } from "@/components/landing/empresas/Pricing"
import { PropuestaValor } from "@/components/landing/empresas/PropuestaValor"
// import { Testimonios } from "@/components/landing/empresas/Testimonios"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
  WebSiteJsonLd,
} from "../../components/seo/JsonLd"
import { FAQS_EMPRESAS } from "../../lib/data/empresas-data"

export const metadata: Metadata = {
  title: "Recluta Talento en Biotecnología y Biociencias | Biovity para Empresas",
  description:
    "ATS y portal de empleo para reclutar científicos en biotecnología, bioquímica, química, ingeniería química y salud. Encuentra candidatos cualificados en Chile.",
  keywords: [
    "reclutar empleados biotecnología chile",
    "reclutar bioquímicos chile",
    "reclutar químicos chile",
    "reclutar ingenieros químicos chile",
    "ATS biotecnología chile",
    "software reclutamiento ciencias chile",
    "talento científico chile",
    "contratar bioquímicos chile",
    "contratar biotecnólogos chile",
    "empleos para empresas ciencias chile",
    "portal empresas biotecnología",
    "contratar personal laboratorio chile",
    "contratar investigadores chile",
    "reclutamiento científico chile",
    "reclutamiento biotech chile",
    "reclutamiento bioquímica chile",
  ],
  openGraph: {
    title: "Recluta Talento en Biotecnología y Biociencias | Biovity Empresas",
    description:
      "ATS especializado para reclutar talento científico en biotecnología, bioquímica, química e ingeniería química en Chile.",
    url: "/empresas",
    images: [
      {
        url: "/og/empresas.png",
        width: 1200,
        height: 630,
        alt: "Biovity para Empresas - Recluta Talento Científico",
      },
    ],
  },
  twitter: {
    title: "Recluta Talento en Biotecnología | Biovity Empresas",
    description:
      "Conecta con el nuevo talento científico de Chile. ATS especializado para empresas en biotecnología, bioquímica y química.",
    images: ["/og/empresas.png"],
  },
  alternates: {
    canonical: "/empresas",
  },
}

export default function EmpresasPage() {
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
        ]}
      />
      <main className="flex flex-col relative">
        <HeroEmpresas />
        {/* TODO: Descomentar cuando tengamos logos de empresas clientes */}
        {/* <LogosEmpresas /> */}
        <PropuestaValor />
        <ComoFuncionaEmpresas />
        <FeaturesATS />
        <Pricing />
        {/* TODO: Descomentar cuando tengamos testimonios reales */}
        {/* <Testimonios /> */}
        <FAQ />
        <CTAContacto />
      </main>
    </LandingLayout>
  )
}
