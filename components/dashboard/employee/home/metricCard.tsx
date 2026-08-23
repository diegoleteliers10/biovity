"use client"

import { TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { memo } from "react"
import { dashboardTonalCardClass } from "@/components/dashboard/shared/surface-classes"
import type { Metric } from "@/lib/types/dashboard"

type MetricCardProps = {
  metric: Metric
}

const cardClass = (isClickable: boolean) =>
  `${dashboardTonalCardClass} flex flex-col gap-2 p-4 sm:p-5 text-left w-full ${
    isClickable
      ? "cursor-pointer transition-colors duration-150 hover:bg-surface-container-highest/40"
      : ""
  }`

const MetricBody = ({ metric }: { metric: Metric }) => {
  const TrendIcon = metric.trendPositive ? TradeUpIcon : TradeDownIcon
  const isEmpty = metric.value === 0 || metric.value === "0"

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs leading-4 font-medium text-foreground">{metric.title}</span>
        <HugeiconsIcon icon={metric.icon} size={16} className="text-muted-foreground" />
      </div>

      <span className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
        {metric.value}
      </span>

      {isEmpty ? (
        <span className="text-xs text-muted-foreground">{metric.emptyHint ?? metric.subtitle}</span>
      ) : (
        metric.trend && (
          <span
            className={`text-xs flex items-center gap-1 ${
              metric.trendPositive ? "text-secondary" : "text-destructive"
            }`}
          >
            <HugeiconsIcon icon={TrendIcon} size={12} />
            {metric.trend}
          </span>
        )
      )}

      {!isEmpty && metric.subtitle && (
        <span className="text-xs text-muted-foreground">{metric.subtitle}</span>
      )}
    </>
  )
}

export const MetricCard = memo(function MetricCard({ metric }: MetricCardProps) {
  const router = useRouter()
  const href = metric.href

  if (!href) {
    return (
      <div className={cardClass(false)}>
        <MetricBody metric={metric} />
      </div>
    )
  }

  return (
    <button type="button" className={cardClass(true)} onClick={() => router.push(href)}>
      <MetricBody metric={metric} />
    </button>
  )
})
