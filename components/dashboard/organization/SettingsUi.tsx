"use client"

import type { Building06Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const SECTION_LABEL_CLASS = "text-xs leading-4 font-medium text-foreground"

export const btnAccentClass = "bg-primary text-primary-foreground hover:bg-primary/90"

export function OrgSwitch({
  id,
  checked,
  onCheckedChange,
}: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="block h-[26px] w-11 cursor-pointer rounded-full bg-muted-foreground transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring" />
      <span className="pointer-events-none absolute top-[3px] left-[3px] size-5 cursor-pointer rounded-full bg-white transition-transform peer-checked:translate-x-[18px]" />
    </>
  )
}

export function SettingRow({
  title,
  desc,
  htmlFor,
  switchId,
  checked,
  onCheckedChange,
  children,
}: {
  title: string
  desc?: string
  htmlFor?: string
  switchId?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  children?: ReactNode
}) {
  const control =
    children ??
    (switchId && checked !== undefined && onCheckedChange ? (
      <OrgSwitch id={switchId} checked={checked} onCheckedChange={onCheckedChange} />
    ) : null)

  return (
    <label
      htmlFor={htmlFor ?? switchId}
      className="relative flex cursor-pointer items-start justify-between gap-6 py-3.5"
    >
      <span className="min-w-0">
        <span className="block text-sm leading-5 font-medium text-foreground">{title}</span>
        {desc && (
          <span className="mt-0.5 block max-w-[56ch] text-xs leading-5 text-muted-foreground text-pretty">
            {desc}
          </span>
        )}
      </span>
      {control && <span className="relative inline-flex flex-none self-center">{control}</span>}
    </label>
  )
}

export function StateCard({
  icon,
  violet,
  title,
  chip,
  children,
}: {
  icon: typeof Building06Icon
  violet?: boolean
  title: string
  chip?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-5 rounded-xl border border-border/40 bg-surface-container-low p-6 shadow-none">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full bg-surface-container-highest text-muted-foreground",
          violet && "bg-accent/15 text-accent"
        )}
      >
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.7} aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-sm leading-5 font-medium text-foreground">{title}</h3>
          {chip}
        </div>
        {children}
      </div>
    </div>
  )
}

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs leading-4 font-medium text-foreground">
      {children}
    </label>
  )
}

export function FieldHelp({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-5 text-muted-foreground text-pretty">{children}</p>
}
