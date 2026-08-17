"use client"

import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserMultiple02Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip } from "@/components/ui/map"
import type { GeographicDistributionEntry } from "@/lib/types/organization-metrics"

const CHILE_COORDINATES: Record<string, [number, number]> = {
  arica: [-70.3126, -18.4783],
  "arica y parinacota": [-70.3126, -18.4783],
  iquique: [-70.1431, -20.2307],
  tarapaca: [-70.1431, -20.2307],
  antofagasta: [-70.4000, -23.6500],
  calama: [-68.9300, -22.4550],
  copiapo: [-70.3333, -27.3667],
  atacama: [-70.3333, -27.3667],
  "la serena": [-71.2520, -29.9027],
  coquimbo: [-71.3436, -29.9533],
  valparaiso: [-71.6127, -33.0472],
  "vina del mar": [-71.5518, -33.0245],
  santiago: [-70.6693, -33.4489],
  metropolitana: [-70.6693, -33.4489],
  rancagua: [-70.7444, -34.1708],
  ohiggins: [-70.7444, -34.1708],
  talca: [-71.6667, -35.4264],
  curico: [-71.2400, -34.9850],
  maule: [-71.6667, -35.4264],
  chillan: [-72.1034, -36.6066],
  nuble: [-72.1034, -36.6066],
  concepcion: [-73.0498, -36.8201],
  talcahuano: [-73.1167, -36.7167],
  biobio: [-73.0498, -36.8201],
  temuco: [-72.5901, -38.7359],
  araucania: [-72.5901, -38.7359],
  valdivia: [-73.2459, -39.8196],
  "los rios": [-73.2459, -39.8196],
  osorno: [-73.1333, -40.5667],
  "puerto montt": [-72.9369, -41.4693],
  "puerto varas": [-72.9850, -41.3200],
  castro: [-73.7667, -42.4833],
  "los lagos": [-72.9369, -41.4693],
  coyhaique: [-72.0662, -45.5752],
  aysen: [-72.0662, -45.5752],
  "punta arenas": [-70.9167, -53.1667],
  "puerto natales": [-72.5000, -51.7333],
  magallanes: [-70.9167, -53.1667],
}

function resolveCoordinates(cityName: string): [number, number] {
  const normalized = cityName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,\s*chile/g, "")
    .replace(/^region\s+(de\s+|del\s+)?/g, "")
    .trim()

  for (const [key, coords] of Object.entries(CHILE_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords
    }
  }

  return [-70.6693, -33.4489]
}

type GeographicDistributionCardProps = {
  isPending: boolean
  geographicDistribution?: GeographicDistributionEntry[]
}

export function GeographicDistributionCard({
  isPending,
  geographicDistribution,
}: GeographicDistributionCardProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const items = useMemo(() => {
    if (!geographicDistribution || geographicDistribution.length === 0) return []

    return geographicDistribution.map((entry) => ({
      ...entry,
      coordinates: resolveCoordinates(entry.city),
    }))
  }, [geographicDistribution])

  const totalGeoApplicants = useMemo(() => {
    return items.reduce((acc, item) => acc + item.count, 0)
  }, [items])

  if (isPending) {
    return (
      <Card className="border border-border/80 bg-white dark:bg-card">
        <CardHeader>
          <Skeleton className="h-4 w-44" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[220px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasData = items.length > 0

  return (
    <Card className="border border-border/80 bg-white dark:bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Distribución geográfica</CardTitle>
          {hasData && (
            <Badge variant="outline" className="text-xs font-semibold bg-primary/5 text-primary border-primary/20">
              {items.length} {items.length === 1 ? "región" : "regiones"} · {totalGeoApplicants} postulantes
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasData ? (
          <p className="text-sm text-muted-foreground">No hay datos geográficos disponibles.</p>
        ) : (
          <>
            {/* Interactive Map */}
            <div className="relative h-[230px] w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20">
              <Map
                center={[-70.9, -35.6]}
                zoom={4.1}
                minZoom={3}
                maxZoom={12}
                className="h-full w-full"
              >
                <MapControls position="top-right" showCompass={false} />

                {items.map((item) => {
                  const [lng, lat] = item.coordinates
                  const isSelected = selectedCity === item.city
                  const sizeMultiplier = Math.min(Math.max(item.percentage / 10, 1), 2.2)
                  const bubbleSize = 16 * sizeMultiplier

                  return (
                    <MapMarker
                      key={item.city}
                      longitude={lng}
                      latitude={lat}
                    >
                      <MarkerContent>
                        <div
                          className="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125"
                          onClick={() => setSelectedCity(isSelected ? null : item.city)}
                        >
                          <div
                            className="rounded-full bg-primary/25 animate-ping absolute"
                            style={{ width: `${bubbleSize + 8}px`, height: `${bubbleSize + 8}px` }}
                          />
                          <div
                            className="flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px] shadow-md border-2 border-white dark:border-background transition-all"
                            style={{ width: `${bubbleSize}px`, height: `${bubbleSize}px` }}
                          >
                            {item.count}
                          </div>
                        </div>
                      </MarkerContent>

                      <MarkerTooltip>
                        <div className="text-center font-medium">
                          <p className="font-semibold">{item.city}</p>
                          <p className="text-[10px] opacity-90">{item.count} postulantes ({item.percentage}%)</p>
                        </div>
                      </MarkerTooltip>

                      <MarkerPopup closeButton>
                        <div className="p-1 text-xs space-y-1">
                          <p className="font-semibold text-foreground">{item.city}</p>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <HugeiconsIcon icon={UserMultiple02Icon} size={12} />
                            <span>{item.count} postulaciones registradas</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px] mt-1">
                            {item.percentage}% del total nacional
                          </Badge>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  )
                })}
              </Map>
            </div>

            {/* List breakdown */}
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              {items.map((geo) => (
                <div
                  key={geo.city}
                  className={`flex items-center justify-between p-1.5 rounded-md transition-colors ${
                    selectedCity === geo.city ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedCity(selectedCity === geo.city ? null : geo.city)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-2 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate cursor-pointer">
                      {geo.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 sm:w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${geo.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-foreground w-6 text-right">
                      {geo.count}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-normal text-muted-foreground w-9 text-center">
                      {geo.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
