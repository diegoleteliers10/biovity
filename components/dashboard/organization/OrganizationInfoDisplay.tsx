"use client"

import {
  Building06Icon,
  Globe02Icon,
  MapPinIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { OrganizationAddress } from "@/lib/api/organizations"

const EMPTY_PLACEHOLDER = "No especificado"

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof Building06Icon
  title: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

import { cn } from "@/lib/utils"

function formatAddress(addr: OrganizationAddress | null | undefined): string {
  if (!addr) return ""
  const parts = [addr.street, addr.city, addr.state, addr.country, addr.zipCode].filter(Boolean)
  return parts.join(", ")
}

interface OrganizationInfoDisplayProps {
  name?: string | null
  website?: string | null
  phone?: string | null
  address?: OrganizationAddress | null
}

export function OrganizationInfoDisplay({
  name,
  website,
  phone,
  address,
}: OrganizationInfoDisplayProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <SectionTitle icon={Building06Icon} title="Nombre" />
          <p className="mt-2 text-sm font-medium text-foreground">{name || EMPTY_PLACEHOLDER}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <SectionTitle icon={Globe02Icon} title="Sitio web" />
          {website ? (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-primary hover:underline break-all"
            >
              {website}
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{EMPTY_PLACEHOLDER}</p>
          )}
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <SectionTitle icon={SmartPhone01Icon} title="Teléfono" />
          <p className="mt-2 text-sm font-medium text-foreground">{phone || EMPTY_PLACEHOLDER}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 sm:col-span-2">
          <SectionTitle icon={MapPinIcon} title="Dirección" />
          <p className="mt-2 text-sm font-medium text-foreground">
            {formatAddress(address ?? null) || EMPTY_PLACEHOLDER}
          </p>
        </div>
      </div>
    </div>
  )
}

interface SubscriptionIdDisplayProps {
  subscriptionId?: string | null
}

export function SubscriptionIdDisplay({ subscriptionId }: SubscriptionIdDisplayProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <SectionTitle icon={MapPinIcon} title="ID de Suscripción" />
      <p className="mt-2 text-sm font-medium text-foreground">
        {subscriptionId ? (
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{subscriptionId}</code>
        ) : (
          <span className="text-muted-foreground">{EMPTY_PLACEHOLDER}</span>
        )}
      </p>
    </div>
  )
}

type NoOrganizationCardProps = Record<string, never>

export function NoOrganizationCard(_props: NoOrganizationCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted ring-2 ring-border/60">
        <HugeiconsIcon icon={Building06Icon} size={32} className="text-muted-foreground" />
      </div>
      <div className="space-y-1 px-4">
        <p className="font-medium text-foreground">Sin organización</p>
        <p className="text-muted-foreground text-pretty text-sm max-w-sm">
          No tienes una organización asociada. Completa tu perfil para vincular una.
        </p>
      </div>
    </div>
  )
}
