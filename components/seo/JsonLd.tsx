import Script from "next/script"

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  )
}

// Organization schema for the entire site
export function OrganizationJsonLd() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Biovity",
    url: "https://biovity.cl",
    logo: "https://biovity.cl/logoIconBiovity.png",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química, ingeniería química y salud en Chile.",
    sameAs: [
      // Add social media URLs when available
      // "https://www.linkedin.com/company/biovity",
      // "https://twitter.com/biovity",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish"],
    },
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
  }

  return <JsonLd data={organizationData} />
}

// WebSite schema with search action
export function WebSiteJsonLd() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Biovity",
    url: "https://biovity.cl",
    description: "Portal de empleo especializado en biotecnología y ciencias en Chile",
    publisher: {
      "@type": "Organization",
      name: "Biovity",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://biovity.cl/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <JsonLd data={websiteData} />
}

// Job posting board / employment agency schema
export function JobBoardJsonLd() {
  const jobBoardData = {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    name: "Biovity",
    url: "https://biovity.cl",
    description:
      "Plataforma especializada en conectar profesionales y estudiantes con oportunidades laborales en biotecnología, bioquímica, química, ingeniería química y salud.",
    image: "https://biovity.cl/og/home.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
    },
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
    serviceType: [
      "Empleo en Biotecnología",
      "Empleo en Bioquímica",
      "Empleo en Química",
      "Empleo en Ingeniería Química",
      "Empleo en Salud",
      "Reclutamiento Científico",
    ],
    priceRange: "Gratuito para candidatos",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  }

  return <JsonLd data={jobBoardData} />
}

// SaaS/Software product schema for empresas page
export function SoftwareApplicationJsonLd() {
  const softwareData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Biovity ATS",
    description:
      "Sistema de seguimiento de candidatos (ATS) especializado para empresas en biotecnología, bioquímica y química.",
    url: "https://biovity.cl/empresas",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CLP",
      lowPrice: "0",
      offerCount: "3",
      offers: [
        {
          "@type": "Offer",
          name: "Plan Starter",
          price: "0",
          priceCurrency: "CLP",
          description: "Plan gratuito para comenzar a reclutar",
        },
        {
          "@type": "Offer",
          name: "Plan Profesional",
          priceCurrency: "CLP",
          description: "Para empresas en crecimiento",
        },
        {
          "@type": "Offer",
          name: "Plan Enterprise",
          priceCurrency: "CLP",
          description: "Para grandes organizaciones",
        },
      ],
    },
    provider: {
      "@type": "Organization",
      name: "Biovity",
      url: "https://biovity.cl",
    },
  }

  return <JsonLd data={softwareData} />
}

import type { FAQItem } from "@/lib/types/empresas"

interface FAQJsonLdProps {
  faqs: FAQItem[]
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={faqData} />
}

// Breadcrumb schema
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={breadcrumbData} />
}
