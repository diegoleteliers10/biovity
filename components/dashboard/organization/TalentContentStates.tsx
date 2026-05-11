"use client"

import type { User } from "@/lib/api/users"
import { TalentTable } from "./TalentTable"

interface TalentContentStatesProps {
  users: User[]
  search: string
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
}

export function TalentContentStates({
  users,
  search,
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
}: TalentContentStatesProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    )
  }

  if (!users.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <p className="text-muted-foreground text-sm">
          {search
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
    />
  )
}
