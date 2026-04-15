import type { Metadata } from "next"
import { Suspense } from "react"
import { TrabajosPageContent } from "@/components/landing/trabajos/TrabajosPageContent"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, FAQJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"

const FAQS_TRABAJOS = [
  {
    question: "¿Cómo me postulo a un trabajo en Biovity?",
    answer:
      "Para postula a un trabajo, necesitas crear una cuenta profesional. Una vez registrado, puedes buscar empleos en la sección de trabajos y hacer clic en 'Postular' en la oferta que te interese. Tu perfil y CV estarán disponibles para la empresa.",
  },
  {
    question: "¿Biovity es gratis para profesionales?",
    answer:
      "Sí, Biovity es completamente gratis para profesionales y estudiantes. Puedes buscar empleos, postula a ofertas, guardar trabajos favoritos y recibir alertas de nuevas oportunidades sin ningún costo.",
  },
  {
    question: "¿Qué tipos de trabajos científicos encuentro en Biovity?",
    answer:
      "En Biovity encuentras ofertas en biotecnología, bioquímica, química, ingeniería química, salud y áreas relacionadas. Incluye posiciones de investigación, desarrollo, control de calidad, producción y más.",
  },
  {
    question: "¿Cómo funciona el matching por IA?",
    answer:
      "Nuestro sistema de AI Matching analiza tu perfil profesional, experiencia y preferencias para sugerirte las ofertas más relevantes. Esto te ahorra tiempo en la búsqueda y aumenta tus posibilidades de encontrar el trabajo ideal.",
  },
  {
    question: "¿Puedo filtrar trabajos por ubicación o modalidad?",
    answer:
      "Sí, puedes filtrar por ubicación (ciudad o región), modalidad (presencial, remoto, híbrido), nivel de experiencia, área científica y rango salarial para encontrar las oportunidades que mejor se adapten a tus necesidades.",
  },
]

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
      <FAQJsonLd faqs={FAQS_TRABAJOS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Trabajos", url: "https://biovity.cl/trabajos" },
        ]}
      />
      <main className="flex flex-col relative">
        <Suspense>
          <TrabajosPageContent />
        </Suspense>
      </main>
    </LandingLayout>
  )
}
