import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"

const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => `oferta-skeleton-${i}`)

function OfertaCardSkeleton() {
  return (
    <div className={`flex flex-col gap-3 p-4 ${dashboardRaisedCardClass}`} aria-hidden>
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 w-3/4 bg-surface-container-highest/60 animate-pulse rounded-md" />
        <div className="h-5 w-16 shrink-0 bg-surface-container-highest/60 animate-pulse rounded-md" />
      </div>
      <div className="h-4 w-24 bg-surface-container-highest/60 animate-pulse rounded-md" />
      <div className="flex items-center gap-3 pt-1">
        <div className="h-3 w-14 bg-surface-container-highest/60 animate-pulse rounded-md" />
        <div className="h-3 w-14 bg-surface-container-highest/60 animate-pulse rounded-md" />
        <div className="ml-auto h-3 w-20 bg-surface-container-highest/60 animate-pulse rounded-md" />
      </div>
    </div>
  )
}

export function OfertasContentSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      role="status"
      aria-label="Cargando ofertas"
    >
      {SKELETON_IDS.map((id) => (
        <OfertaCardSkeleton key={id} />
      ))}
    </div>
  )
}
