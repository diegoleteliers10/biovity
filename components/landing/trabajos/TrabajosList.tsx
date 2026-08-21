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
import { Card } from "@/components/ui/card"
import type { TipoBeneficio, Trabajo } from "@/lib/types/trabajos"
import { formatFechaRelativa } from "@/lib/utils"

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
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-low p-12 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              No se encontraron ofertas con los filtros seleccionados
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Intenta ajustar tus criterios de búsqueda o limpiar los filtros para ver todas las oportunidades disponibles.
            </p>
          </Card>
        </div>
      </section>
    )
  }

  const count = trabajos.length

  return (
    <section className="bg-surface-container-lowest pb-24 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm font-mono text-muted-foreground">
            {count === 1 ? "1 oferta disponible" : `${count} ofertas disponibles`}
          </p>
        </div>

        <div className="space-y-4">
          {trabajos.map((trabajo) => (
            <Link
              key={trabajo.id}
              href={`/trabajos/${trabajo.slug}`}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-container-lowest hover:border-secondary/40 hover:bg-surface-container-low/40 transition-all p-5 sm:p-6 block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
              aria-label={`Ver detalles de ${trabajo.titulo}`}
            >
              <div className="flex flex-col gap-3">
                {/* Header: Título y Fecha */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight group-hover:text-secondary transition-colors">
                    {trabajo.titulo}
                  </h2>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={15}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span>{formatFechaRelativa(trabajo.fechaPublicacion)}</span>
                  </div>
                </div>

                {/* Segunda fila: Empresa | Ubicación, Beneficios, Salario */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 shrink-0 items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground truncate">{trabajo.empresa}</span>
                    <span className="shrink-0 text-border">•</span>
                    <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon
                        icon={Location05Icon}
                        size={16}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="truncate">{trabajo.ubicacion}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
                    {trabajo.beneficios && trabajo.beneficios.length > 0 && (
                      <div className="flex items-center gap-2 sm:mr-3">
                        {trabajo.beneficios.map((beneficio) => {
                          const icon = getBeneficioIcon(beneficio.tipo)
                          if (!icon) return null
                          return (
                            <div
                              key={`${beneficio.tipo}-${beneficio.label}`}
                              className="size-7 rounded-md bg-surface-container-low flex items-center justify-center text-muted-foreground border border-border/40"
                              title={beneficio.label}
                            >
                              <HugeiconsIcon
                                icon={icon}
                                size={14}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {(trabajo.rangoSalarial.min > 0 || trabajo.rangoSalarial.max > 0) && (
                      <div className="flex min-w-0 items-center gap-1.5 font-mono font-semibold text-secondary text-sm sm:text-base">
                        <HugeiconsIcon
                          icon={Cash02Icon}
                          size={18}
                          className="shrink-0 text-secondary"
                        />
                        <span className="break-words min-w-0">
                          {trabajo.rangoSalarial.moneda === "USD"
                            ? `US$${new Intl.NumberFormat("en-US").format(trabajo.rangoSalarial.min)} - US$${new Intl.NumberFormat("en-US").format(trabajo.rangoSalarial.max)}`
                            : `$${new Intl.NumberFormat("es-CL").format(trabajo.rangoSalarial.min)} - $${new Intl.NumberFormat("es-CL").format(trabajo.rangoSalarial.max)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tercera fila: Badges */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full font-mono font-medium bg-secondary/10 text-secondary border border-secondary/20 capitalize">
                    {trabajo.modalidad === "hibrido" ? "Híbrido" : trabajo.modalidad}
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-mono font-medium bg-surface-container-highest text-foreground border border-border capitalize">
                    {trabajo.formato === "full-time"
                      ? "Full Time"
                      : trabajo.formato === "part-time"
                        ? "Part Time"
                        : trabajo.formato === "practica"
                          ? "Práctica"
                          : trabajo.formato}
                  </span>
                  {trabajo.categoria && (
                    <span className="px-2.5 py-1 rounded-full font-mono font-medium bg-surface-container-low text-muted-foreground border border-border capitalize">
                      {trabajo.categoria}
                    </span>
                  )}
                  {trabajo.experiencia && (
                    <span className="px-2.5 py-1 rounded-full font-mono font-medium bg-surface-container-low text-muted-foreground border border-border capitalize">
                      Exp. {trabajo.experiencia}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
