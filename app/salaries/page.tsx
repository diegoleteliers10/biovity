import type { Metadata } from "next"
import { SalariosEmpresasB2B } from "@/components/landing/salarios/SalariosEmpresasB2B"
import { SalariosHero } from "@/components/landing/salarios/SalariosHero"
import { SalariosInteractiveFilter } from "@/components/landing/salarios/SalariosInteractiveFilter"
import { SalariosMetodologia } from "@/components/landing/salarios/SalariosMetodologia"
import { SalariosUpskilling } from "@/components/landing/salarios/SalariosUpskilling"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  JsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"
import {
  FAQS_SALARIOS,
  SALARIES_UPDATED_AT,
  SALARY_BENCHMARKS,
  SALARY_CAREER_VALUES,
  SALARY_SOURCES,
} from "@/lib/data/salarios-benchmark"

const qf = SALARY_BENCHMARKS.quimica_farmacia.official
const salaryDescription = qf
  ? `Según MiFuturo.cl, Química y Farmacia promedia $${qf.firstYear.average.amountClp.toLocaleString("es-CL")} bruto mensual en el primer año y $${qf.fourthYear.amountClp.toLocaleString("es-CL")} al cuarto año. Datos de Chile, actualizados en ${SALARIES_UPDATED_AT}.`
  : `Consulta referencias salariales con fuentes y límites claros. Actualizado en ${SALARIES_UPDATED_AT}.`

export const metadata: Metadata = {
  title: "Sueldos en ciencias e ingeniería en Chile | Biovity",
  description: salaryDescription,
  keywords: [
    "sueldos ciencias Chile",
    "salario biotecnología Chile",
    "sueldo química y farmacia Chile",
    "ingresos por carrera MiFuturo",
    "salarios ingeniería química Chile",
    "empleabilidad titulados Chile",
  ],
  openGraph: {
    title: "Sueldos en ciencias e ingeniería en Chile | Biovity",
    description: salaryDescription,
    url: "/salaries",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Datos salariales con fuente para carreras en Chile",
      },
    ],
  },
  twitter: {
    title: "Sueldos en ciencias e ingeniería en Chile | Biovity",
    description: salaryDescription,
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/salaries",
  },
}

const salaryDatasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Referencias salariales por carrera en Chile",
  description:
    "Ingresos mensuales brutos de MiFuturo, referencias de mercado identificadas y datos agregados de la comunidad Biovity con umbral mínimo de muestra.",
  url: "https://biovity.cl/salaries",
  dateModified: "2026-10-18",
  creator: { "@type": "Organization", name: "Biovity", url: "https://biovity.cl" },
  citation: SALARY_SOURCES.map((source) => source.url),
  variableMeasured: SALARY_CAREER_VALUES.map((careerValue) => {
    const item = SALARY_BENCHMARKS[careerValue]
    return {
      "@type": "PropertyValue",
      name: item.careerLabel,
      description: item.official
        ? `Ingreso bruto promedio al primer año: $${item.official.firstYear.average.amountClp.toLocaleString("es-CL")} CLP mensuales. Fuente: MiFuturo.cl.`
        : item.marketProxy
          ? `Referencia de Data Scientist P50: $${item.marketProxy.p50.amountClp.toLocaleString("es-CL")} CLP mensuales. No equivale directamente a esta carrera.`
          : "Sin datos suficientes para una cifra confiable.",
    }
  }),
}

export default function SalariosPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <FAQJsonLd faqs={FAQS_SALARIOS} />
      <JsonLd data={salaryDatasetJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Salarios", url: "https://biovity.cl/salaries" },
        ]}
      />
      <main className="flex flex-col relative">
        <SalariosHero />
        <SalariosInteractiveFilter />
        <SalariosUpskilling />
        <SalariosEmpresasB2B />
        <SalariosMetodologia />
      </main>
    </LandingLayout>
  )
}
