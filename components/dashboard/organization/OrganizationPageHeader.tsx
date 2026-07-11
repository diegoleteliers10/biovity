"use client"

import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"

type OrganizationPageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode
}

export function OrganizationPageHeader({
  title,
  description,
  children,
}: OrganizationPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <ConnectedNotificationBell showAgentTrigger />
      </div>
      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell showAgentTrigger />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">{title}</h1>
            {description && (
              <p className="text-pretty text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
