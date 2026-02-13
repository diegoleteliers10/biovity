"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location05Icon,
  Cash02Icon,
  Clock01Icon,
  Briefcase01Icon,
  Bookmark02Icon,
  Share05Icon,
  Link04Icon,
  Linkedin02Icon,
  Mail01Icon,
  WhatsappIcon,
  HeartPulse01Icon,
  Laptop01Icon,
  Airplane01Icon,
  GraduationCap01Icon,
} from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"
import { useRouter } from "next/navigation"

const toTitle = (slug: string | undefined) => {
  if (!slug) return "Vacante"
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = params?.id
  const jobTitle = toTitle(jobId)

  const benefits: {
    id: string
    label: string
    type: "health" | "vacation" | "learning" | "equipment"
  }[] = [
    { id: "b1", label: "Seguro de salud y dental", type: "health" },
    { id: "b2", label: "Vacaciones pagadas y días personales", type: "vacation" },
    { id: "b3", label: "Presupuesto anual para formación", type: "learning" },
    { id: "b4", label: "Equipo (computador) y trabajo híbrido", type: "equipment" },
  ]

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero header */}
      <section
        className="relative border-b border-border bg-gradient-to-br from-accent/60 via-accent/30 to-transparent"
        aria-label="Encabezado de la vacante"
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => router.back()}
              className="hover:text-foreground cursor-pointer"
            >
              ← Volver a empleos
            </button>
            <span className="text-muted-foreground/60">/</span>
            <span>{jobId}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center"
              aria-hidden
            >
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={24}
                strokeWidth={1.5}
                className="h-5 w-5"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="text-sm font-medium text-foreground">Compañía Ejemplo</p>
            </div>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{jobTitle}</h1>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={Location05Icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4"
              />
              Buenos Aires · Híbrido
            </span>
            <span className="inline-flex items-center gap-1">Senior · Full time</span>
            <span className="inline-flex items-center gap-1">Programación</span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <HugeiconsIcon icon={Cash02Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
              $2,500 - 3,000 USD/mes
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button className="px-6">Postular</Button>
            <Button variant="outline" className="px-3" aria-label="Guardar">
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4"
              />
            </Button>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Compartir</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Compartir">
                    <HugeiconsIcon
                      icon={Share05Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="h-4 w-4"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Compartir</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href)
                      } catch {}
                    }}
                  >
                    <HugeiconsIcon
                      icon={Link04Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="mr-2 h-4 w-4"
                    />
                    Copiar enlace
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href)
                      window.open(
                        `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
                        "_blank"
                      )
                    }}
                  >
                    <HugeiconsIcon
                      icon={Linkedin02Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="mr-2 h-4 w-4"
                    />
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href)
                      window.location.href = `mailto:?subject=${encodeURIComponent(jobTitle)}&body=${url}`
                    }}
                  >
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="mr-2 h-4 w-4"
                    />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href)
                      window.open(`https://wa.me/?text=${url}`, "_blank")
                    }}
                  >
                    <HugeiconsIcon
                      icon={WhatsappIcon}
                      size={24}
                      strokeWidth={1.5}
                      className="mr-2 h-4 w-4"
                    />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto max-w-6xl w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="lg:col-span-2">
          <CardContent className="prose prose-sm max-w-none p-4 md:p-6 text-foreground">
            <h2 className="text-base font-semibold">Descripción</h2>
            <p className="text-sm text-muted-foreground">
              Únete al equipo para construir productos de alto impacto. Esta es una maqueta con el
              diseño adaptado al sistema visual del proyecto. Sustituye este texto con contenido
              real cuando conectemos la fuente de datos.
            </p>

            <h3 className="mt-4 text-sm font-semibold">Requisitos</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Experiencia con TypeScript y React.</li>
              <li>Conocimiento de buenas prácticas y testing.</li>
              <li>Trabajo colaborativo y comunicación efectiva.</li>
            </ul>

            <h3 className="mt-4 text-sm font-semibold">Detalles</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Modalidad: Híbrido (2 días remoto).</li>
              <li>Horario: Tiempo completo.</li>
              <li>Equipo: Producto multidisciplinario.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Publicado</span>
                <span className="inline-flex items-center gap-1">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={24}
                    strokeWidth={1.5}
                    className="h-4 w-4"
                  />
                  21 Oct 2025
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Postulaciones</span>
                <span className="font-medium">36</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Respuesta</span>
                <span className="font-medium">1–14 días</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Beneficios</h3>
              <div className="space-y-2">
                {benefits.map((b) => {
                  const Icon =
                    b.type === "health"
                      ? HeartPulse01Icon
                      : b.type === "vacation"
                        ? Airplane01Icon
                        : b.type === "learning"
                          ? GraduationCap01Icon
                          : Laptop01Icon
                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Icon className="h-4 w-4 text-foreground/80" aria-hidden />
                      <span>{b.label}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
