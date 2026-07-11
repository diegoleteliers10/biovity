"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/api/users"
import { TalentTable } from "./TalentTable"

interface TalentContentStatesProps {
  users: User[]
  search: string
  hasFilters?: boolean
  recruiterId?: string
  createChatMutation: ReturnType<typeof import("@/lib/api/use-chats").useCreateOrFindChatMutation>
  currentPage: number
  totalPages: number
  total: number
  onPrevPage: () => void
  onNextPage: () => void
  onRowClick: (userId: string) => void
  isLoading: boolean
  error: Error | null
  onRetry?: () => void
  // F8.8 — Bulk select
  selectedIds: Set<string>
  onSelectToggle: (userId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function TalentContentStates({
  users,
  search,
  hasFilters,
  recruiterId,
  createChatMutation,
  currentPage,
  totalPages,
  total,
  onPrevPage,
  onNextPage,
  onRowClick,
  isLoading,
  error,
  onRetry,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onDeselectAll,
}: TalentContentStatesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border/60 p-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-32 hidden lg:block" />
            <Skeleton className="h-5 w-20 hidden lg:block" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
        <p className="text-destructive text-sm">{error.message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    )
  }

  if (!users.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <p className="text-muted-foreground text-sm">
          {search || hasFilters
            ? "No se encontraron profesionales con ese criterio."
            : "No hay profesionales registrados en la plataforma."}
        </p>
      </div>
    )
  }

  return (
    <TalentTable
      users={users}
      recruiterId={recruiterId}
      createChatMutation={createChatMutation}
      onRowClick={onRowClick}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      onPrevPage={onPrevPage}
      onNextPage={onNextPage}
      selectedIds={selectedIds}
      onSelectToggle={onSelectToggle}
      onSelectAll={onSelectAll}
      onDeselectAll={onDeselectAll}
    />
  )
}
