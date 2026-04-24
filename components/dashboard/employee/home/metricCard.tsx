"use client"

import { TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metric } from "@/lib/types/dashboard"

type MetricCardProps = {
  metric: Metric
}

export const MetricCard = memo(function MetricCard({ metric }: MetricCardProps) {
  const router = useRouter()
  const iconColorClass = metric.iconColor === "primary" ? "text-primary" : "text-secondary"
  const TrendIcon = metric.trendPositive ? TradeUpIcon : TradeDownIcon

  const handleClick = () => {
    if (metric.href) {
      router.push(metric.href)
    }
  }

  const content = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground group">{metric.title}</CardTitle>
        <HugeiconsIcon
          icon={metric.icon}
          size={24}
          strokeWidth={1.5}
          className={`h-4 w-4 ${iconColorClass}`}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{metric.value}</div>
        {metric.trend && (
          <p className={`text-xs ${metric.trendPositive ? "text-secondary" : "text-destructive"}`}>
            <HugeiconsIcon
              icon={TrendIcon}
              size={24}
              strokeWidth={1.5}
              className="inline h-3 w-3 mr-1"
            />
            {metric.trend}
          </p>
        )}
        {metric.subtitle && <p className="text-xs text-muted-foreground">{metric.subtitle}</p>}
      </CardContent>
    </>
  )

  if (metric.href) {
    return (
      <Card
        className="border border-border/80 bg-white active:scale-[0.99] transition-all duration-150 cursor-pointer"
        onClick={handleClick}
      >
        {content}
      </Card>
    )
  }

  return <Card className="border border-border/80 bg-white">{content}</Card>
})
