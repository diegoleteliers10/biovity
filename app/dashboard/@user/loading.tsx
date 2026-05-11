import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header skeleton */}
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

      {/* Metrics Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="border border-border/80 bg-white rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Recent Applications and Messages skeleton */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="border border-border/80 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60"
              >
                <div className="space-y-2">
                  <Skeleton className="size-40 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border/80 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n + 10}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/60"
              >
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Jobs skeleton */}
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n + 100}
              className="border border-border/80 bg-white rounded-lg p-4 space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="size-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Alerts skeleton */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-80" />
        <div className="mt-4 border border-border/80 bg-white rounded-lg p-6">
          <Skeleton className="size-48 mb-4" />
          <Skeleton className="h-10 w-full max-w-md rounded" />
        </div>
      </div>
    </div>
  )
}
