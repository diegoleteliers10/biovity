"use client"

import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { formatJobLocation, type Job } from "@/lib/api/jobs"
import { useJobsSearch } from "@/lib/api/use-jobs"
import {
  useRemoveSavedJobMutation,
  useSavedJobsByUser,
  useSaveJobMutation,
} from "@/lib/api/use-saved-jobs"
import { authClient } from "@/lib/auth-client"
import { employeeSearchParsers } from "@/lib/parsers/employee-search"
import { JobListItem } from "./jobListItem"
import { SearchFilters } from "./searchFilters"

const _EMPTY_PLACEHOLDER = "—"

function _getJobModalidad(job: Job): string {
  const loc = job.location
  if (!loc) return "presencial"
  if (loc.isRemote) return "remoto"
  if (loc.isHybrid) return "hibrido"
  return "presencial"
}

export const SearchContent = () => {
  const [urlState, setUrlState] = useQueryStates(employeeSearchParsers, {
    history: "push",
    shallow: false,
  })
  const { q: query, location, jobType, experience, remoteOnly } = urlState
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { data: jobsResult, isLoading, error } = useJobsSearch({ search: query.trim() || undefined })

  const filteredJobs = useMemo(() => {
    if (!jobsResult) return []
    let result = jobsResult?.data ?? []

    const normalizedLocation = location.trim().toLowerCase()
    if (normalizedLocation) {
      result = result.filter((job) => {
        const loc = formatJobLocation(job.location).toLowerCase()
        return loc.includes(normalizedLocation)
      })
    }
    if (remoteOnly) {
      result = result.filter((job) => job.location?.isRemote)
    }
    if (jobType !== "any") {
      result = result.filter((job) => job.employmentType === jobType)
    }
    if (experience !== "any") {
      result = result.filter((job) => job.experienceLevel === experience)
    }
    return result
  }, [jobsResult, location, remoteOnly, jobType, experience])

  const _handleSearch = useCallback(() => {}, [])

  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id ?? ""

  const { data: savedJobs } = useSavedJobsByUser(userId, {
    page: 1,
    limit: 200,
  })
  const [optimisticSavedMap, setOptimisticSavedMap] = useState<Record<string, boolean>>({})

  const savedJobIds = useMemo(() => {
    return new Set((savedJobs?.data ?? []).map((j) => j.jobId))
  }, [savedJobs])

  const isJobSaved = useCallback(
    (jobId: string) => {
      const optimisticValue = optimisticSavedMap[jobId]
      if (typeof optimisticValue === "boolean") return optimisticValue
      return savedJobIds.has(jobId)
    },
    [optimisticSavedMap, savedJobIds]
  )

  const saveMutation = useSaveJobMutation()
  const removeMutation = useRemoveSavedJobMutation()

  useEffect(() => {
    setOptimisticSavedMap((prev) => {
      const next: Record<string, boolean> = { ...prev }
      let changed = false
      for (const [jobId, optimisticValue] of Object.entries(prev)) {
        if (savedJobIds.has(jobId) === optimisticValue) {
          delete next[jobId]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [savedJobIds])

  const handleClear = useCallback(() => {
    setUrlState({
      q: "",
      location: "",
      jobType: "any",
      experience: "any",
      remoteOnly: false,
    })
  }, [setUrlState])

  const handleSave = useCallback(
    (jobId: string) => {
      if (!userId) return

      const currentlySaved = isJobSaved(jobId)
      const nextSaved = !currentlySaved

      setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: nextSaved }))

      if (currentlySaved) {
        removeMutation.mutate(
          { userId, jobId },
          {
            onError: () => {
              setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: currentlySaved }))
            },
          }
        )
      } else {
        saveMutation.mutate(
          { userId, jobId },
          {
            onError: () => {
              setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: currentlySaved }))
            },
          }
        )
      }
    },
    [isJobSaved, removeMutation, saveMutation, userId]
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <NotificationBell notifications={[]} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Buscar Empleos</h1>
          <p className="text-muted-foreground text-sm">
            Encuentra oportunidades acorde a tus preferencias.
          </p>
        </div>
      </div>

      <SearchFilters
        query={query}
        location={location}
        jobType={jobType}
        experience={experience}
        remoteOnly={remoteOnly}
        showAdvanced={showAdvanced}
        onQueryChange={(q) => setUrlState({ q })}
        onLocationChange={(location) => setUrlState({ location })}
        onJobTypeChange={(jobType) => setUrlState({ jobType })}
        onExperienceChange={(experience) => setUrlState({ experience })}
        onRemoteOnlyChange={(remoteOnly) => setUrlState({ remoteOnly })}
        onShowAdvancedChange={setShowAdvanced}
        onClear={handleClear}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {isLoading ? "Cargando..." : `${filteredJobs.length} resultados`}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              isSaved={isJobSaved(job.id)}
              userId={userId}
              onSave={handleSave}
              saveMutation={saveMutation}
              removeMutation={removeMutation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchContent
