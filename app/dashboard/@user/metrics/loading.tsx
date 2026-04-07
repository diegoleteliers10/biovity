import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-1 bg-white">
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-10" />
        </div>
      </div>

      {/* Metrics Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-border/80 bg-white rounded-lg p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border border-border/80 bg-white rounded-lg lg:col-span-2 h-[300px] animate-pulse" />
        <div className="border border-border/80 bg-white rounded-lg h-[300px] animate-pulse" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="border border-border/80 bg-white rounded-lg lg:col-span-2 h-[300px] animate-pulse" />
        <div className="border border-border/80 bg-white rounded-lg h-[300px] animate-pulse" />
      </div>
    </div>
  )
}
