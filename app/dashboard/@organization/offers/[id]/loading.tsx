import { ViewTransition } from "react"

function OfertaDetailSkeleton() {
  return (
    <ViewTransition exit="slide-down">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Back button skeleton */}
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />

        {/* Header skeleton */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="flex gap-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Applicants skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </ViewTransition>
  )
}

export default OfertaDetailSkeleton
