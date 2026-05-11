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
import { authClient } from "@/lib/auth-client"
import { talentParsers } from "@/lib/parsers/talent"

export function TalentContent() {
  const [urlState, setUrlState] = useQueryStates(talentParsers, {
    history: "push",
    shallow: false,
  })
  const { page, search } = urlState

  const { inputSearch, handleSearchChange } = useTalentSearch({
    initialValue: search,
    onSearchChange: (value) => {
      setUrlState({ search: value, page: 1 })
    },
  })

  const { useSession } = authClient
  const { data: session } = useSession()
  const recruiterId = (session?.user as { id?: string })?.id
  const createChatMutation = useCreateOrFindChatMutation(recruiterId)

  const { data: paginated, isLoading, error } = useProfessionalUsers(page, search)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const users = paginated?.data ?? []
  const total = paginated?.total ?? 0
  const totalPages = paginated?.totalPages ?? 1
  const currentPage = paginated?.page ?? 1

  const handleRowClick = (userId: string) => {
    setSelectedUserId(userId)
    setSheetOpen(true)
  }

  const handlePrevPage = () => {
    setUrlState({ page: Math.max(1, page - 1) })
  }

  const handleNextPage = () => {
    setUrlState({ page: Math.min(totalPages, page + 1) })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <TalentPageHeader searchValue={inputSearch} onSearchChange={handleSearchChange} />

      <TalentContentStates
        users={users}
        search={search}
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
      />

      <TalentDetailSheet userId={selectedUserId} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
