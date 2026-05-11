"use client"

import {
  AirplaneLanding01Icon,
  Cash02Icon,
  Clock01Icon,
  HeartAddIcon,
  LaptopIcon,
  LibraryIcon,
  Location05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import type { TipoBeneficio, Trabajo } from "@/lib/types/trabajos"
import { formatFechaRelativa, formatSalarioRango } from "@/lib/utils"

type TrabajosListProps = {
  trabajos: Trabajo[]
}

const getBeneficioIcon = (tipo: TipoBeneficio) => {
  switch (tipo) {
    case "salud":
      return HeartAddIcon
    case "vacaciones":
      return AirplaneLanding01Icon
    case "formacion":
      return LibraryIcon
    case "equipo":
      return LaptopIcon
    default:
      return null
  }
}

export function TrabajosList({ trabajos }: TrabajosListProps) {
  if (trabajos.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <p className="text-sm text-muted-foreground">0 trabajos encontrados</p>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-foreground">
              No se encontraron trabajos con los filtros seleccionados.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Intenta ajustar tus filtros de búsqueda.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const count = trabajos.length

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <p className="text-sm text-muted-foreground">
            {count === 1 ? "1 trabajo encontrado" : `${count} trabajos encontrados`}
          </p>
        </div>
        <div className="space-y-6">
          {trabajos.map((trabajo) => (
            <Link
              key={trabajo.id}
              href={`/trabajos/${trabajo.slug}`}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/30 bg-muted/20 hover:bg-secondary/5 transition-colors duration-200 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] block"
              aria-label={`Ver detalles de ${trabajo.titulo}`}
            >
              <CardContent className="px-6 py-3">
                <div className="flex flex-col gap-1.5">
                  {/* Header: Título y Fecha */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl flex-1 font-semibold text-foreground tracking-tight">
                      {trabajo.titulo}
                    </h2>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/90">
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={16}
                          className="shrink-0 text-muted-foreground/80"
                        />
                        <span>{formatFechaRelativa(trabajo.fechaPublicacion)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Segunda fila: Empresa | Ubicación, Beneficios, Salario */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 shrink-0 items-center gap-2 text-sm text-muted-foreground/90">
                      <span className="truncate">{trabajo.empresa}</span>
                      <span className="shrink-0 text-muted-foreground/60">|</span>
                      <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground/90">
                        <HugeiconsIcon
                          icon={Location05Icon}
                          size={18}
                          className="shrink-0 text-muted-foreground/80"
                        />
                        <span className="truncate">{trabajo.ubicacion}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
                      {trabajo.beneficios && trabajo.beneficios.length > 0 && (
                        <div className="flex items-center gap-2 sm:mr-5">
                          {trabajo.beneficios.map((beneficio) => {
                            const icon = getBeneficioIcon(beneficio.tipo)
                            if (!icon) return null
                            return (
                              <div
                                key={`${beneficio.tipo}-${beneficio.label}`}
                                className="text-muted-foreground/90"
                                title={beneficio.label}
                              >
                                <HugeiconsIcon
                                  icon={icon}
                                  size={16}
                                  className="text-muted-foreground/80"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="mt-1.5 flex min-w-0 items-center gap-1.5 font-semibold text-foreground text-sm sm:mt-0">
                        <HugeiconsIcon
                          icon={Cash02Icon}
                          size={18}
                          className="shrink-0 text-secondary"
                        />
                        <span className="break-words min-w-0">
                          {formatSalarioRango(trabajo.rangoSalarial.min, trabajo.rangoSalarial.max)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tercera fila: Modalidad y Formato */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-0">
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {trabajo.modalidad === "hibrido" ? "Híbrido" : trabajo.modalidad}
                    </Badge>
                    <Badge variant="default" className="shrink-0 capitalize">
                      {trabajo.formato === "full-time"
                        ? "Full Time"
                        : trabajo.formato === "part-time"
                          ? "Part Time"
                          : trabajo.formato}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
