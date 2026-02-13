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
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Trabajo, TipoBeneficio } from "@/lib/types/trabajos"
import {
  formatFechaRelativa,
  formatSalarioRango,
  getFormatoBadgeColor,
  getModalidadBadgeColor,
} from "@/lib/utils"

interface TrabajosListProps {
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
  const router = useRouter()

  if (trabajos.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No se encontraron trabajos con los filtros seleccionados.
            </p>
            <p className="text-sm text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {trabajos.map((trabajo) => (
            <Card
              key={trabajo.id}
              onClick={() => router.push(`/trabajos/${trabajo.slug}`)}
              className="hover:shadow-lg transition-all duration-200 border-0 shadow-md cursor-pointer hover:scale-[1.01] py-4"
            >
              <CardContent className="px-6 py-3">
                <div className="flex flex-col gap-1.5">
                  {/* Header: Título y Fecha */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex-1">{trabajo.titulo}</h2>
                    {/* Fecha al lado derecho del título */}
                    <div className="flex items-center gap-1.5 text-gray-700 text-xs shrink-0">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={16}
                        className="text-muted-foreground shrink-0"
                      />
                      <span>{formatFechaRelativa(trabajo.fechaPublicacion)}</span>
                    </div>
                  </div>

                  {/* Segunda fila: Empresa | Ubicación, Salario, Beneficios — col en mobile para evitar desborde */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Empresa | Ubicación */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0 shrink-0">
                      <span className="truncate">{trabajo.empresa}</span>
                      <span className="text-gray-400 shrink-0">|</span>
                      <div className="flex items-center gap-1.5 text-gray-700 min-w-0">
                        <HugeiconsIcon
                          icon={Location05Icon}
                          size={18}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="truncate">{trabajo.ubicacion}</span>
                      </div>
                    </div>

                    {/* Beneficios y Salario — en mobile en columna (beneficios arriba, salario abajo); en desktop en fila */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
                      {/* Beneficios */}
                      {trabajo.beneficios && trabajo.beneficios.length > 0 && (
                        <div className="flex items-center gap-2 sm:mr-20">
                          {trabajo.beneficios.map((beneficio, index) => {
                            const icon = getBeneficioIcon(beneficio.tipo)
                            if (!icon) return null
                            return (
                              <div key={index} className="text-gray-600" title={beneficio.label}>
                                <HugeiconsIcon icon={icon} size={16} className="text-muted-foreground" />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Rango salarial — min-w-0 en mobile; margen top solo en mobile respecto a beneficios */}
                      <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-sm min-w-0 mt-1.5 sm:mt-0">
                        <HugeiconsIcon
                          icon={Cash02Icon}
                          size={18}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="break-words min-w-0">
                          {formatSalarioRango(trabajo.rangoSalarial.min, trabajo.rangoSalarial.max)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tercera fila: Modalidad y Formato — margen top solo en mobile */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-3 sm:mt-0">
                    {/* Modalidad */}
                    <Badge
                      className={`${getModalidadBadgeColor(trabajo.modalidad)} capitalize shrink-0`}
                    >
                      {trabajo.modalidad === "hibrido" ? "Híbrido" : trabajo.modalidad}
                    </Badge>

                    {/* Formato */}
                    <Badge
                      className={`${getFormatoBadgeColor(trabajo.formato)} capitalize shrink-0`}
                    >
                      {trabajo.formato === "full-time"
                        ? "Full Time"
                        : trabajo.formato === "part-time"
                          ? "Part Time"
                          : trabajo.formato}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
