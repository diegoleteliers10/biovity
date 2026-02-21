import type { Metadata } from "next";
import { ComoFuncionaEmpresas } from "@/components/landing/empresas/ComoFuncionaEmpresas";
import { CTAContacto } from "@/components/landing/empresas/CTAContacto";
import { FAQ } from "@/components/landing/empresas/FAQ";
import { FeaturesATS } from "@/components/landing/empresas/FeaturesATS";
import { HeroEmpresas } from "@/components/landing/empresas/HeroEmpresas";
// import { LogosEmpresas } from "@/components/landing/empresas/LogosEmpresas"
import { Pricing } from "@/components/landing/empresas/Pricing";
import { PropuestaValor } from "@/components/landing/empresas/PropuestaValor";
// import { Testimonios } from "@/components/landing/empresas/Testimonios"
import { LandingLayout } from "@/components/layouts/LandingLayout";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  SoftwareApplicationJsonLd,
} from "../../components/seo/JsonLd";
import { FAQS_EMPRESAS } from "../../lib/data/empresas-data";

export const metadata: Metadata = {
  title: "Para Empresas | Recluta Talento Científico con Biovity",
  description:
    "Simplifica tu proceso de reclutamiento y accede a profesionales cualificados en biotecnología, bioquímica, química e ingeniería química. ATS especializado en ciencias.",
  keywords: [
    "reclutar científicos Chile",
    "ATS biotecnología",
    "contratar bioquímicos",
    "reclutamiento químicos",
    "portal empleo empresas científicas",
    "talento científico Chile",
    "contratar ingenieros químicos",
    "software reclutamiento ciencias",
  ],
  openGraph: {
    title: "Para Empresas | Recluta Talento Científico con Biovity",
    description:
      "Conecta con el nuevo talento científico de Chile. ATS especializado para empresas en biotecnología, bioquímica y química.",
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
    title: "Para Empresas | Recluta Talento Científico con Biovity",
    description:
      "Conecta con el nuevo talento científico de Chile. ATS especializado para biotecnología, bioquímica y química.",
    images: ["/og/empresas.png"],
  },
  alternates: {
    canonical: "/empresas",
  },
};

export default function EmpresasPage() {
  return (
    <LandingLayout>
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
  );
}
