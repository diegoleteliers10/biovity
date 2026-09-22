"use client"

import dynamic from "next/dynamic"

const OrganizationDashboardPreview = dynamic(
  () =>
    import("@/components/landing/empresas/organization-dashboard-preview").then(
      (mod) => mod.OrganizationDashboardPreview
    ),
  {
    ssr: false,
    loading: () => (
      <div className="py-20 md:py-28 bg-surface-container-lowest animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-44 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-9 w-96 bg-muted rounded-lg mx-auto mb-16" />
          <div className="h-[560px] lg:h-[620px] bg-surface-container-low border border-border/50 rounded-2xl" />
        </div>
      </div>
    ),
  }
)

export function LazyOrganizationDashboardPreview() {
  return <OrganizationDashboardPreview />
}
