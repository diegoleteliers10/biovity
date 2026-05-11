type JsonLdProps = {
  data: Record<string, unknown>
}

/* eslint-disable react-doctor/no-danger -- JSON-LD structured data must be injected via dangerouslySetInnerHTML in script tags */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      id="json-ld"
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export type JobPostingJsonLdProps = {
  jobId: string
  title: string
  description: string
  organizationName: string
  organizationUrl?: string
  datePosted: string
  validThrough?: string
  employmentType: string
  experienceLevel?: string
  locationCity?: string
  locationRegion?: string
  locationCountry?: string
  isRemote?: boolean
  isHybrid?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  benefits?: string[]
  url: string
}

export function JobPostingJsonLd({
  title,
  description,
  organizationName,
  datePosted,
  validThrough,
  employmentType,
  experienceLevel,
  locationCity,
  locationRegion,
  locationCountry,
  isRemote,
  isHybrid,
  salaryMin,
  salaryMax,
  salaryCurrency = "CLP",
  url,
}: JobPostingJsonLdProps) {
  const jobData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough,
    employmentUnit: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: organizationName,
    },
    jobLocation: isRemote
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "CL",
          },
        }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: locationCity,
            addressRegion: locationRegion,
            addressCountry: locationCountry,
          },
        },
    jobLocationType: isRemote ? "REMOTE" : isHybrid ? "HYBRID" : "ONSITE",
    employmentType: employmentType.toUpperCase(),
    experienceRequirements: experienceLevel
      ? {
          "@type": "OccupationalExperienceRequirements",
          yearsOfExperience: experienceLevel.includes("Senior")
            ? "5-"
            : experienceLevel.includes("Mid")
              ? "3-5"
              : experienceLevel.includes("Junior")
                ? "1-3"
                : undefined,
        }
      : undefined,
    baseSalary:
      salaryMin || salaryMax
        ? {
            "@type": "MonetaryAmount",
            currency: salaryCurrency,
            value:
              salaryMin && salaryMax
                ? {
                    "@type": "QuantitativeValue",
                    minValue: salaryMin,
                    maxValue: salaryMax,
                    unitText: "MONTH",
                  }
                : {
                    "@type": "QuantitativeValue",
                    value: salaryMin || salaryMax,
                    unitText: "MONTH",
                  },
          }
        : undefined,
    url,
  }

  return <JsonLd data={jobData} />
}

export type ArticleJsonLdProps = {
  title: string
  description: string
  authorName: string
  authorUrl?: string
  datePublished: string
  dateModified?: string
  image: string
  url: string
}

export function ArticleJsonLd({
  title,
  description,
  authorName,
  authorUrl,
  datePublished,
  dateModified,
  image,
  url,
}: ArticleJsonLdProps) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url:
        authorUrl ||
        `https://biovity.cl/blog/author/${authorName.toLowerCase().replace(/\s+/g, "-")}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Biovity",
      url: "https://biovity.cl",
      logo: {
        "@type": "ImageObject",
        url: "https://biovity.cl/logoIconBiovity.png",
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return <JsonLd data={articleData} />
}

// BlogPosting schema for individual blog posts
export type BlogPostingJsonLdProps = {
  title: string
  description: string
  authorName: string
  authorUrl?: string
  datePublished: string
  dateModified?: string
  image: string
  url: string
}

export function BlogPostingJsonLd({
  title,
  description,
  authorName,
  authorUrl,
  datePublished,
  dateModified,
  image,
  url,
}: BlogPostingJsonLdProps) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url:
        authorUrl ||
        `https://biovity.cl/blog/author/${authorName.toLowerCase().replace(/\s+/g, "-")}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Biovity",
      url: "https://biovity.cl",
      logo: {
        "@type": "ImageObject",
        url: "https://biovity.cl/logoIconBiovity.png",
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: "Blog",
    wordCount: description.split(" ").length * 5,
  }

  return <JsonLd data={articleData} />
}

// Dataset schema for salary data pages
type DatasetJsonLdProps = {
  name: string
  description: string
  url: string
  creatorName: string
  datePublished: string
  keywords: string[]
}

export function DatasetJsonLd({
  name,
  description,
  url,
  creatorName,
  datePublished,
  keywords,
}: DatasetJsonLdProps) {
  const datasetData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url,
    creator: {
      "@type": "Organization",
      name: creatorName,
      url: "https://biovity.cl",
    },
    datePublished,
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: keywords.join(", "),
    measurementTechnique: "https://schema.org/measurementTechnique/Survey",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Salario Promedio",
        unitCode: "CLP",
        description: "Sueldo promedio mensual en pesos chilenos",
      },
      {
        "@type": "PropertyValue",
        name: "Salario Minimo",
        unitCode: "CLP",
        description: "Sueldo minimo del rango",
      },
      {
        "@type": "PropertyValue",
        name: "Salario Maximo",
        unitCode: "CLP",
        description: "Sueldo maximo del rango",
      },
    ],
  }

  return <JsonLd data={datasetData} />
}

export type PersonJsonLdProps = {
  name: string
  jobTitle?: string
  description?: string
  url?: string
  image?: string
  sameAs?: string[]
}

export function PersonJsonLd({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs,
}: PersonJsonLdProps) {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    url,
    image,
    sameAs,
  }

  return <JsonLd data={personData} />
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

type FAQJsonLdProps = {
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

// Collection page schema for blog listing
type CollectionJsonLdProps = {
  name: string
  description: string
  url: string
  items: Array<{
    name: string
    url: string
  }>
}

export function CollectionJsonLd({ name, description, url, items }: CollectionJsonLdProps) {
  const collectionData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    hasPart: items.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: item.url,
    })),
  }

  return <JsonLd data={collectionData} />
}

// Breadcrumb schema
type BreadcrumbItem = {
  name: string
  url: string
}

type BreadcrumbJsonLdProps = {
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

// WebApplication schema
export function WebApplicationJsonLd() {
  const webAppData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Biovity",
    url: "https://biovity.cl",
    description:
      "Portal de empleo especializado en biotecnología, bioquímica, química, ingeniería química y salud en Chile.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CLP",
      description: "Free for job seekers",
    },
  }

  return <JsonLd data={webAppData} />
}

// AboutPage schema for nosotros page
export function AboutPageJsonLd() {
  const aboutData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Nosotros | Biovity",
    description:
      "Conoce a Biovity y su misión de conectar talento científico con oportunidades significativas en el sector de biociencias en Chile.",
    url: "https://biovity.cl/nosotros",
    mainEntity: {
      "@type": "Organization",
      name: "Biovity",
      url: "https://biovity.cl",
      logo: "https://biovity.cl/logoIconBiovity.png",
      description:
        "Portal de empleo especializado en biotecnología, bioquímica, química, ingeniería química y salud en Chile.",
      foundingDate: "2024",
      areaServed: {
        "@type": "Country",
        name: "Chile",
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish"],
      },
    },
  }

  return <JsonLd data={aboutData} />
}

// FAQPage schema (QAPage) for general use
export function QAPageJsonLd({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const qaData = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    name: "Preguntas Frecuentes | Biovity",
    description: "Respuestas a las preguntas más frecuentes sobre Biovity",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={qaData} />
}

// CollectionPage for blog
type BlogCollectionJsonLdProps = {
  name: string
  description: string
  url: string
  items: Array<{
    name: string
    url: string
    datePublished?: string
  }>
}

export function BlogCollectionJsonLd({ name, description, url, items }: BlogCollectionJsonLdProps) {
  const collectionData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url,
    about: items.map((item) => ({
      "@type": "BlogPosting",
      name: item.name,
      url: item.url,
      ...(item.datePublished ? { datePublished: item.datePublished } : {}),
    })),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  }

  return <JsonLd data={collectionData} />
}
