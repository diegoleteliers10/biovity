"use client"

import { useQueryStates } from "nuqs"
import { useState } from "react"
import { TalentContentStates } from "@/components/dashboard/organization/TalentContentStates"
import { TalentDetailSheet } from "@/components/dashboard/organization/TalentDetailSheet"
import { TalentPageHeader } from "@/components/dashboard/organization/TalentPageHeader"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useTalentSearch } from "@/hooks/use-talent-search"
import { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import { useProfessionalUsers } from "@/lib/api/use-talent"
import type { User } from "@/lib/api/users"
import { talentParsers } from "@/lib/parsers/talent"
import { useDashboardSession } from "../DashboardSessionContext"
import { SavedSearchDialog } from "./SavedSearchDialog"
import { exportTalentCSV, TalentBulkBar } from "./TalentBulkBar"
import { TalentFilterPanel } from "./TalentFilterPanel"

export function TalentContent() {
  const [urlState, setUrlState] = useQueryStates(talentParsers, {
    history: "push",
    shallow: false,
  })

  const {
    page,
    search,
    view,
    profession,
    city,
    country,
    experienceLevel,
    availability,
    skills,
    minExp,
    maxExp,
  } = urlState

  const { inputSearch, handleSearchChange } = useTalentSearch({
    initialValue: search,
    onSearchChange: (value) => {
      setUrlState({ search: value, page: 1 })
    },
  })

  const session = useDashboardSession()
  const recruiterId = session?.user?.id ?? undefined
  const createChatMutation = useCreateOrFindChatMutation(recruiterId)

  // Track selection state for F8.8
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // F8.1 — Combine filters
  const filters = {
    search: search || undefined,
    profession: profession || undefined,
    city: city || undefined,
    country: country || undefined,
    experienceLevel: experienceLevel || undefined,
    availability: availability || undefined,
    skills: skills || undefined,
    minExp: minExp > 0 ? minExp : undefined,
    maxExp: maxExp > 0 ? maxExp : undefined,
  }

  const { data: paginated, isLoading, error, refetch } = useProfessionalUsers(page, filters)
  const selectedUserId = view || null
  const sheetOpen = Boolean(view)

  const users = paginated?.data ?? []
  const total = paginated?.total ?? 0
  const totalPages = paginated?.totalPages ?? 1
  const currentPage = paginated?.page ?? 1

  const hasFilters = Boolean(
    profession || city || country || experienceLevel || availability || skills || minExp || maxExp
  )

  const handleRowClick = (userId: string) => {
    setUrlState({ view: userId })
  }

  const handleCloseSheet = (open: boolean) => {
    if (!open) {
      setUrlState({ view: "" })
    }
  }

  const handlePrevPage = () => {
    setUrlState({ page: Math.max(1, page - 1) })
  }

  const handleNextPage = () => {
    setUrlState({ page: Math.min(totalPages, page + 1) })
  }

  // F8.8 Bulk selection handlers
  const handleSelectToggle = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      users.forEach((u) => next.add(u.id))
      return next
    })
  }

  const handleDeselectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      users.forEach((u) => next.delete(u.id))
      return next
    })
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
  }

  const selectedUsers = users.filter((u) => selectedIds.has(u.id))

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setUrlState({
      ...newFilters,
      page: 1, // Reset page to 1 when changing filters
    })
  }

  const handleResetFilters = () => {
    setUrlState({
      profession: "",
      city: "",
      country: "",
      experienceLevel: "",
      availability: "",
      skills: "",
      minExp: 0,
      maxExp: 0,
      page: 1,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <TalentPageHeader searchValue={inputSearch} onSearchChange={handleSearchChange} />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <TalentFilterPanel
          filters={urlState}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        <div className="flex items-center gap-2">
          <SavedSearchDialog
            organizationId={session?.user?.organizationId ?? undefined}
            currentFilters={filters as Record<string, unknown>}
            onLoadSearch={(loadedFilters) => {
              setUrlState({
                ...loadedFilters,
                page: 1,
              } as typeof urlState)
            }}
          />

          {/* Bulk Action Toolbar */}
          <TalentBulkBar
            selectedCount={selectedIds.size}
            selectedUsers={selectedUsers}
            onClearSelection={handleClearSelection}
            onExportCSV={exportTalentCSV}
          />
        </div>
      </div>

      <TalentContentStates
        users={users}
        search={search}
        hasFilters={hasFilters}
        recruiterId={recruiterId}
        createChatMutation={createChatMutation}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        selectedIds={selectedIds}
        onSelectToggle={handleSelectToggle}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <TalentDetailSheet
        userId={selectedUserId}
        open={sheetOpen}
        onOpenChange={handleCloseSheet}
        recruiterId={recruiterId}
      />
    </div>
  )
}
