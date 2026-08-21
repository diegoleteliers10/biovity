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
      "En Biovity encuentras ofertas en biotecnología, bioquímica, química, ingeniería química, salud y áreas relacionadas. Incluye posiciones de investigación, desarrollo, control de calidad, producción y más.",
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
      "Encuentra ofertas de empleo en biotecnología, bioquímica, química, ingeniería química y salud en Chile. Búsqueda avanzada por área, ubicación y modalidad.",
    url: "/trabajos",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Empleos en Biotecnología y Biociencias Chile",
      },
    ],
  },
  twitter: {
    title: "Empleos en Biotecnología y Biociencias | Biovity Chile",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química y ciencias. Encuentra tu próximo trabajo en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/trabajos",
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
          { name: "Trabajos", url: "https://biovity.cl/trabajos" },
        ]}
      />
      <main className="flex flex-col relative bg-surface-container-lowest">
        <section className="bg-surface-container-lowest pt-32 pb-4 md:pt-40 md:pb-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Oportunidades Laborales • Chile
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance mb-4">
              Empleos en <span className="text-secondary">Biotecnología</span> y{" "}
              <span className="text-accent">Ciencias</span>
            </h1>

            <p className="max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty mb-6">
              Explora ofertas de trabajo verificadas en biotecnología, bioquímica, química, farmacéutica, laboratorio e I+D en Chile. Postula gratis y conecta directamente con empresas líderes del ecosistema.
            </p>

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
