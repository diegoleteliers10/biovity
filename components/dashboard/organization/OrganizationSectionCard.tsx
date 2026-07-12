import type { Building06Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type OrganizationSectionCardProps = {
  title: string
  description?: string
  icon?: typeof Building06Icon
  action?: ReactNode
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function OrganizationSectionCard({
  title,
  description,
  icon,
  action,
  className,
  contentClassName,
  children,
}: OrganizationSectionCardProps) {
  return (
    <Card className={cn("border-border/60 shadow-sm", className)}>
      <CardHeader
        className={cn(action && "flex-row items-start justify-between gap-4 space-y-0")}
      >
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon && <HugeiconsIcon icon={icon} size={20} className="text-primary" />}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
    </Card>
  )
}
