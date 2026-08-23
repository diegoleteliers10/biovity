"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { formatJobLocation, type Job } from "@/lib/api/jobs"
import { useJobsSearch } from "@/lib/api/use-jobs"
import {
  useRemoveSavedJobMutation,
  useSavedJobsByUser,
  useSaveJobMutation,
} from "@/lib/api/use-saved-jobs"
import { employeeSearchParsers } from "@/lib/parsers/employee-search"
import { JobListItem } from "./jobListItem"
import { SearchFilters } from "./searchFilters"

const _EMPTY_PLACEHOLDER = "—"

function JobListSkeleton() {
  return (
    <div
      className="rounded-xl border border-border/50 bg-surface-container-lowest px-4 py-3 shadow-none"
      aria-hidden
    >
      <div className="flex items-start justify-between gap-4">
        <div className="h-5 w-2/5 rounded-md bg-surface-container-highest/60 animate-pulse" />
        <div className="h-4 w-16 rounded-md bg-surface-container-highest/60 animate-pulse" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-4 w-32 rounded-md bg-surface-container-highest/60 animate-pulse" />
        <div className="h-4 w-24 rounded-md bg-surface-container-highest/60 animate-pulse" />
        <div className="ml-auto h-4 w-28 rounded-md bg-surface-container-highest/60 animate-pulse" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-20 rounded-md bg-surface-container-highest/60 animate-pulse" />
        <div className="h-5 w-24 rounded-md bg-surface-container-highest/60 animate-pulse" />
      </div>
    </div>
  )
}

function useOptimisticSavedMap(savedJobIds: Set<string>) {
  const [optimisticSavedMap, setOptimisticSavedMap] = useState<Record<string, boolean>>({})

  const reconcileOptimistic = useCallback(() => {
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

  useEffect(() => {
    reconcileOptimistic()
  }, [reconcileOptimistic])

  return { optimisticSavedMap, setOptimisticSavedMap }
}

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

  const {
    data: jobsResult,
    isLoading,
    error,
    refetch,
  } = useJobsSearch({ search: query.trim() || undefined })

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

  const session = useDashboardSession()
  const userId = session?.user?.id ?? ""

  const { data: savedJobs } = useSavedJobsByUser(userId, {
    page: 1,
    limit: 200,
  })

  const savedJobIds = useMemo(
    () => new Set((savedJobs?.data ?? []).map((j) => j.jobId)),
    [savedJobs]
  )

  const { optimisticSavedMap, setOptimisticSavedMap } = useOptimisticSavedMap(savedJobIds)

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
    [isJobSaved, removeMutation, saveMutation, userId, setOptimisticSavedMap]
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Buscar Empleos
          </h1>
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
        <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-6 max-w-md mx-auto my-6">
          <p className="text-sm font-medium text-foreground">No se pudieron cargar las ofertas</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 rounded-lg border-border/40 bg-surface-container-lowest text-xs font-medium"
            onClick={() => refetch()}
          >
            Reintentar
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2].map((n) => (
            <JobListSkeleton key={n} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={20} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {query.trim() ? "Sin resultados" : "Busca tu próxima oferta"}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {query.trim()
              ? "Ajusta los filtros o usa términos más generales."
              : "Usa el buscador para encontrar oportunidades."}
          </p>
          {query.trim() && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-lg border-border/40 bg-surface-container-lowest text-xs font-medium"
              onClick={handleClear}
            >
              Limpiar filtros
            </Button>
          )}
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
