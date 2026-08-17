"use client"

import type { Building06Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export const SECTION_LABEL_CLASS =
  "text-xs font-semibold tracking-[0.08em] text-foreground uppercase"

export const btnAccentClass = "bg-accent text-white hover:bg-accent/90"

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
          <span className="mt-0.5 block max-w-[56ch] text-[13px] leading-5 text-muted-foreground text-pretty">
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
    <div className="flex items-start gap-5 rounded-2xl bg-[var(--surface-container-low)] p-7">
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-full bg-white text-muted-foreground",
          violet && "text-accent"
        )}
      >
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.7} aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-base leading-6 font-medium text-foreground">{title}</h3>
          {chip}
        </div>
        {children}
      </div>
    </div>
  )
}

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[13px] leading-4 font-medium text-foreground">
      {children}
    </label>
  )
}

export function FieldHelp({ children }: { children: ReactNode }) {
  return <p className="text-[12.5px] leading-5 text-muted-foreground text-pretty">{children}</p>
}
