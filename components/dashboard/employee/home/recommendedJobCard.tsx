"use client"

import { memo } from "react"
import {
  Bookmark02Icon,
  Cash02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File02Icon,
  Location05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Job } from "@/lib/types/dashboard"

interface RecommendedJobCardProps {
  job: Job
  onJobClick: (jobTitle: string, company: string) => void
  onApplyJob: (jobId: number, jobTitle: string, company: string) => void
  onSaveJob: (jobId: number, jobTitle: string, company: string) => void
}

export const RecommendedJobCard = memo(function RecommendedJobCard({
  job,
  onJobClick,
  onApplyJob,
  onSaveJob,
}: RecommendedJobCardProps) {
  const handleCardClick = () => {
    onJobClick(job.jobTitle, job.company)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    onApplyJob(job.id, job.jobTitle, job.company)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSaveJob(job.id, job.jobTitle, job.company)
  }

  return (
    <Card
      className="relative overflow-hidden flex flex-col cursor-pointer transition-colors duration-300"
      onClick={handleCardClick}
      aria-label={`Ver detalles del trabajo ${job.jobTitle} en ${job.company}`}
    >
      <CardHeader className="relative">
        <div className="space-y-8">
          <div className="flex items-start justify-start">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {job.compatibility}% compatibilidad
            </span>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <HugeiconsIcon icon={File02Icon} size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                {job.jobTitle}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 truncate">{job.company}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 flex-1 flex flex-col">
        {/* Job Details */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Location05Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3 w-3 flex-shrink-0"
            />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Cash02Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3 w-3 flex-shrink-0"
            />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3 w-3 flex-shrink-0"
            />
            <span className="truncate">{job.postedTime}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 2).map((tag, index) => (
            <span
              key={`${job.jobTitle}-tag-${index}`}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground truncate"
            >
              {tag}
            </span>
          ))}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            +{job.additionalTags}
          </span>
        </div>

        {/* Action Buttons - pushed to bottom */}
        <div className="pt-4 mt-auto">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 text-xs" onClick={handleApply}>
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={24}
                strokeWidth={1.5}
                className="h-3 w-3 mr-1"
              />
              Aplicar
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="px-3 text-xs">
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={24}
                strokeWidth={1.5}
                className={`h-3 w-3 ${job.isSaved ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
