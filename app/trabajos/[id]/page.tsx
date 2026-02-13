import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Location05Icon,
  Cash02Icon,
  Clock01Icon,
  Briefcase01Icon,
  HeartAddIcon,
  AirplaneLanding01Icon,
  GraduationScrollIcon,
  LaptopIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BreadcrumbJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"
import { TRABAJOS_MOCK } from "@/lib/data/trabajos-data"
import type { TipoBeneficio } from "@/lib/types/trabajos"
import {
  formatFechaLarga,
  formatSalarioRango,
  getFormatoBadgeColor,
  getModalidadBadgeColor,
} from "@/lib/utils"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const trabajo = TRABAJOS_MOCK.find((t) => t.slug === id)

  if (!trabajo) {
    return {
      title: "Trabajo no encontrado | Biovity",
    }
  }

  const url = `/trabajos/${trabajo.slug}`
  return {
    title: `${trabajo.titulo} | ${trabajo.empresa} | Biovity`,
    description: trabajo.descripcion.substring(0, 160),
    openGraph: {
      title: `${trabajo.titulo} | ${trabajo.empresa} | Biovity`,
      description: trabajo.descripcion.substring(0, 160),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${trabajo.titulo} | ${trabajo.empresa}`,
      description: trabajo.descripcion.substring(0, 160),
    },
    alternates: {
      canonical: url,
    },
  }
}

const getBeneficioIcon = (tipo: TipoBeneficio) => {
  switch (tipo) {
    case "salud":
      return HeartAddIcon
    case "vacaciones":
      return AirplaneLanding01Icon
    case "formacion":
      return GraduationScrollIcon
    case "equipo":
      return LaptopIcon
    default:
      return null
  }
}

export default async function TrabajoDetailPage({ params }: Props) {
  const { id } = await params
  const trabajo = TRABAJOS_MOCK.find((t) => t.slug === id)

  if (!trabajo) {
    notFound()
  }

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Trabajos", url: "https://biovity.cl/trabajos" },
          { name: trabajo.titulo, url: `https://biovity.cl/trabajos/${trabajo.slug}` },
        ]}
      />
      <article className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/trabajos">Trabajos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{trabajo.titulo}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero del trabajo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="h-6 w-6"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="text-lg font-semibold text-foreground">
                  {trabajo.empresa}
                </p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {trabajo.titulo}
            </h1>

            {/* Meta información */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Location05Icon} size={20} className="text-muted-foreground" />
                <span>{trabajo.ubicacion}</span>
              </div>
              <Badge className={`${getModalidadBadgeColor(trabajo.modalidad)} capitalize`}>
                {trabajo.modalidad === "hibrido" ? "Híbrido" : trabajo.modalidad}
              </Badge>
              <Badge className={`${getFormatoBadgeColor(trabajo.formato)} capitalize`}>
                {trabajo.formato === "full-time"
                  ? "Full Time"
                  : trabajo.formato === "part-time"
                    ? "Part Time"
                    : trabajo.formato}
              </Badge>
              {trabajo.experiencia && (
                <Badge className="bg-gray-100 text-gray-800 capitalize">
                  {trabajo.experiencia === "mid" ? "Semi Senior" : trabajo.experiencia}
                </Badge>
              )}
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <HugeiconsIcon icon={Cash02Icon} size={20} className="text-muted-foreground" />
                <span>
                  {formatSalarioRango(trabajo.rangoSalarial.min, trabajo.rangoSalarial.max)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={20} className="text-muted-foreground" />
                <span>Publicado {formatFechaLarga(trabajo.fechaPublicacion)}</span>
              </div>
            </div>
          </div>

          {/* Contenido principal - 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* Columna izquierda (70%) */}
            <div className="space-y-8">
              {/* Descripción */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{trabajo.descripcion}</p>
              </section>

              {/* Requisitos */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {trabajo.requisitos.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>

              {/* Responsabilidades */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilidades</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {trabajo.responsabilidades.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </section>

              {/* Beneficios */}
              {trabajo.beneficios && trabajo.beneficios.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Beneficios</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trabajo.beneficios.map((beneficio, index) => {
                      const IconComponent = getBeneficioIcon(beneficio.tipo)
                      if (!IconComponent) return null
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <HugeiconsIcon icon={IconComponent} className="h-5 w-5 text-primary" />
                          <span className="text-gray-700">{beneficio.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Columna derecha (30%) - Card fija */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información del Trabajo</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Empresa:</span>
                        <span className="font-medium text-gray-900">{trabajo.empresa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ubicación:</span>
                        <span className="font-medium text-gray-900">{trabajo.ubicacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modalidad:</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {trabajo.modalidad === "hibrido" ? "Híbrido" : trabajo.modalidad}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Formato:</span>
                        <span className="font-medium text-gray-900">
                          {trabajo.formato === "full-time"
                            ? "Full Time"
                            : trabajo.formato === "part-time"
                              ? "Part Time"
                              : trabajo.formato}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salario:</span>
                        <span className="font-medium text-gray-900">
                          {formatSalarioRango(trabajo.rangoSalarial.min, trabajo.rangoSalarial.max)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href={`/login?redirect=/trabajos/${trabajo.slug}`}>
                      <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        Postular ahora
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Inicia sesión para postular a este trabajo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
