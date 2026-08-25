"use client"

import { Suspense } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Skeleton } from "@/components/ui/skeleton"

type HomeHeaderProps = {
  firstName: string
  isPending?: boolean
}

function HeaderContent({ isPending, firstName }: { isPending?: boolean; firstName: string }) {
  if (isPending) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-9 w-full max-w-[280px] sm:max-w-[320px]" />
        <Skeleton className="h-5 w-full max-w-[240px] sm:max-w-[384px]" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        ¡Bienvenido/a de vuelta, {firstName}!
      </h1>
      <p className="text-sm text-muted-foreground">
        Aquí está lo que está pasando con tus aplicaciones de trabajo hoy.
      </p>
    </div>
  )
}

export function HomeHeader({ firstName, isPending }: HomeHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row: menu + notification on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <ConnectedNotificationBell />
      </div>

      {/* Desktop: notification top-right, title below */}
      <div className="space-y-1">
        <div className="hidden lg:flex justify-end items-center gap-1">
          <ConnectedNotificationBell />
        </div>
        <Suspense
          fallback={
            <div className="space-y-2">
              <Skeleton className="h-9 w-full max-w-[280px] sm:max-w-[320px]" />
              <Skeleton className="h-5 w-full max-w-[240px] sm:max-w-[384px]" />
            </div>
          }
        >
          <HeaderContent isPending={isPending} firstName={firstName} />
        </Suspense>
      </div>
    </div>
  )
}
