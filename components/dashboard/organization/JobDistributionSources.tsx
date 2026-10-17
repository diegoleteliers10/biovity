"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateJobDistributionSource,
  useDisableJobDistributionSource,
  useJobDistributionSources,
} from "@/lib/api/use-jobs"

const channelLabels = {
  biovity: "Biovity",
  linkedin: "LinkedIn",
  laborum: "Laborum",
  other_job_board: "Otro portal de empleo",
  company_website: "Sitio web de la empresa",
  social_media: "Redes sociales",
  university: "Universidad o institución",
  referral: "Recomendación",
  event: "Feria o evento",
  other: "Otro",
} as const

type DistributionChannel = keyof typeof channelLabels

const isDistributionChannel = (value: string): value is DistributionChannel =>
  Object.hasOwn(channelLabels, value)

export function JobDistributionSources({ jobId }: { jobId: string }) {
  const sources = useJobDistributionSources(jobId)
  const createSource = useCreateJobDistributionSource(jobId)
  const disableSource = useDisableJobDistributionSource(jobId)
  const [channel, setChannel] = useState<DistributionChannel>("linkedin")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copyError, setCopyError] = useState(false)

  const handleCopy = (sourceId: string) => {
    const url = new URL(`/jobs/${jobId}`, window.location.origin)
    url.searchParams.set("sourceId", sourceId)
    void navigator.clipboard.writeText(url.toString()).then(
      () => {
        setCopiedId(sourceId)
        setCopyError(false)
      },
      () => {
        setCopiedId(null)
        setCopyError(true)
      }
    )
  }

  return (
    <section className="space-y-3 rounded-lg border border-border/40 bg-surface-container-low p-4">
      <h2 className="text-xs leading-4 font-medium text-foreground">Enlaces de difusión</h2>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={channel}
          onValueChange={(value) => {
            if (isDistributionChannel(value)) setChannel(value)
          }}
        >
          <SelectTrigger
            aria-label="Canal de difusión"
            className="h-9 min-w-52 bg-background text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(channelLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-md"
          disabled={createSource.isPending}
          onClick={() => createSource.mutate(channel)}
        >
          {createSource.isPending ? "Creando..." : "Crear enlace"}
        </Button>
      </div>

      {createSource.isError && (
        <p className="text-xs text-destructive">No se pudo crear el enlace.</p>
      )}
      {disableSource.isError && (
        <p className="text-xs text-destructive">No se pudo desactivar el enlace.</p>
      )}
      {copyError && <p className="text-xs text-destructive">No se pudo copiar el enlace.</p>}
      {sources.isLoading ? (
        <p className="text-xs text-muted-foreground">Cargando enlaces...</p>
      ) : sources.isError ? (
        <p className="text-xs text-destructive">No se pudieron cargar los enlaces.</p>
      ) : sources.data?.length ? (
        <ul className="divide-y divide-border/40">
          {sources.data.map((source) => (
            <li key={source.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {channelLabels[source.sourceChannel]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {source.disabledAt ? "Desactivado" : "Activo"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!source.disabledAt && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-md"
                      onClick={() => handleCopy(source.id)}
                    >
                      {copiedId === source.id ? "Copiado" : "Copiar enlace"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-9 rounded-md"
                      disabled={disableSource.isPending}
                      onClick={() => disableSource.mutate(source.id)}
                    >
                      Desactivar
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No hay enlaces de difusión.</p>
      )}
    </section>
  )
}
