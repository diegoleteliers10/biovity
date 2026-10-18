import type { Metadata } from "next"
import { Suspense } from "react"
import { TrabajosCategoryBadges } from "@/components/landing/trabajos/TrabajosCategoryBadges"
import { TrabajosPageContent } from "@/components/landing/trabajos/TrabajosPageContent"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  JobBoardJsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd"

const FAQS_TRABAJOS = [
  {
    question: "¿Cómo me postulo a un trabajo en Biovity?",
    answer:
      "Para postular a un trabajo, necesitas crear una cuenta profesional. Una vez registrado, puedes buscar empleos en la sección de trabajos y hacer clic en 'Postular' en la oferta que te interese. Tu perfil y CV estarán disponibles para la empresa.",
  },
  {
    question: "¿Biovity es gratis para profesionales?",
    answer:
      "Sí, Biovity es completamente gratis para profesionales y estudiantes. Puedes buscar empleos, postular a ofertas, guardar trabajos favoritos y recibir alertas de nuevas oportunidades sin ningún costo.",
  },
  {
    question: "¿Qué tipos de trabajos científicos encuentro en Biovity?",
    answer:
      "En Biovity puedes explorar ofertas en biotecnología, bioquímica, química, ingeniería química, salud, investigación, desarrollo y control de calidad.",
  },
  {
    question: "¿Cómo funciona el matching por IA?",
    answer:
      "Nuestro sistema de AI Match analiza tu perfil profesional, experiencia y preferencias para sugerirte las ofertas más relevantes. Esto te ahorra tiempo en la búsqueda y aumenta tus posibilidades de encontrar el trabajo ideal.",
  },
  {
    question: "¿Puedo filtrar trabajos por ubicación o modalidad?",
    answer:
      "Sí, puedes filtrar por ubicación (ciudad o región), modalidad (presencial, remoto, híbrido), nivel de experiencia, área científica y rango salarial para encontrar las oportunidades que mejor se adapten a tus necesidades.",
  },
]

export const metadata: Metadata = {
  title: "Empleos en Biotecnología, Bioquímica y Ciencias",
  description:
    "Buscar empleos en biotecnología, bioquímica, química, ingeniería química, salud, laboratorio, I+D y farmacéutica en Chile. Encuentra trabajo en ciencias cerca de ti.",
  keywords: [
    "empleos biotecnología chile",
    "empleos bioquímica chile",
    "empleos química chile",
    "empleos ingeniería química chile",
    "empleos salud chile",
    "empleos laboratorio chile",
    "empleos farmacéutico chile",
    "empleos I+D chile",
    "empleos investigación chile",
    "empleos biotech chile",
    "empleos food science chile",
    "empleos microbiología chile",
    "portal empleo biotecnología",
    "portal empleo biociencias",
    "portal empleo científico",
    "buscar empleo ciencias chile",
    "ofertas trabajo biotecnología",
    "ofertas trabajo bioquímica",
    "ofertas trabajo laboratorio",
    "vacantes biotecnología chile",
    "vacantes bioquímica chile",
    "bolsa empleo biotecnología",
    "bolsa empleo ciencias chile",
  ],
  openGraph: {
    title: "Empleos en Biotecnología y Biociencias | Biovity Chile",
    description:
      "Explora ofertas de empleo en biotecnología, bioquímica, química, ingeniería química y salud en Chile. Filtra por área, ubicación y modalidad.",
    url: "/jobs",
    images: [
      {
        url: "/og/jobs.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Empleos en Biotecnología y Biociencias Chile",
      },
    ],
  },
  twitter: {
    title: "Empleos en Biotecnología y Biociencias | Biovity Chile",
    description:
      "Ofertas de empleo en biotecnología, bioquímica, química y ciencias. Explora oportunidades en Chile.",
    images: ["/og/jobs.png"],
  },
  alternates: {
    canonical: "/jobs",
  },
}

export default function TrabajosPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <JobBoardJsonLd />
      <OrganizationJsonLd />
      <FAQJsonLd faqs={FAQS_TRABAJOS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Trabajos", url: "https://biovity.cl/jobs" },
        ]}
      />
      <main className="flex flex-col relative bg-surface-container-lowest">
        <section className="bg-surface-container-lowest pb-6 pt-32 md:pt-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 pb-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <span className="mb-3 block text-sm font-medium text-secondary">
                  Trabajo científico · Chile
                </span>
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
                  Encuentra tu lugar en la <span className="text-accent">ciencia.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Explora oportunidades en biotecnología, bioquímica, química, salud e
                  investigación.
                </p>
              </div>
              <p className="text-sm font-medium text-muted-foreground lg:pb-1">
                Áreas de especialidad
              </p>
            </div>

            <Suspense>
              <TrabajosCategoryBadges />
            </Suspense>
          </div>
        </section>

        <Suspense>
          <TrabajosPageContent />
        </Suspense>
      </main>
    </LandingLayout>
  )
}
