import { Suspense } from "react"
import { OrganizationMessagesContent } from "@/components/dashboard/organization/OrganizationMessagesContent"
import { Skeleton } from "@/components/ui/skeleton"

function MessagesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="size-10 rounded-full" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoading />}>
      <OrganizationMessagesContent />
    </Suspense>
  )
}
