"use client"

import {
  Cash02Icon,
  Clock01Icon,
  Location05Icon,
  StarIcon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DATA } from "@/lib/data/data-test"

type JobItem = {
  id: number
  jobTitle: string
  company: string
  location: string
  salary: string
  postedTime: string
  tags: string[]
  additionalTags: number
  compatibility: number
  isSaved: boolean
}

export const SavedContent = () => {
  const jobs: JobItem[] = (DATA.recommendedJobs as unknown as JobItem[]).filter(
    (j) => j.isSaved
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Empleos Guardados</h1>
          <p className="text-muted-foreground text-sm">
            Revisa rápidamente los empleos que marcaste para ver más tarde.
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex items-center justify-center py-16 rounded-lg border border-dashed">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Aún no tienes empleos guardados.</p>
            <p className="text-xs text-muted-foreground">Usa el icono de guardar en los listados para añadirlos aquí.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="relative overflow-hidden flex flex-col border-border/60 hover:border-border transition-colors duration-200 group hover:shadow-md"
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <CardTitle className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2">
                      {job.jobTitle}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {job.compatibility}% compatibilidad
                    </span>
                    <Button variant="ghost" size="icon-sm" className="rounded-md" aria-label="Guardado">
                      <HugeiconsIcon icon={Bookmark02Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-3 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Location05Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Clock01Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                    <span className="truncate">{job.postedTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Cash02Icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={StarIcon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                    <span className="truncate">Relevante</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.tags.slice(0, 2).map((tag) => (
                    <span
                      key={`${job.id}-${tag}`}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.additionalTags > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{job.additionalTags}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedContent


