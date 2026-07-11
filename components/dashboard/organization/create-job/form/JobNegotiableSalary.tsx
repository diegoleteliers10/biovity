"use client"

import { Cash02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function JobNegotiableSalary({ checked, onCheckedChange }: Props) {
  return (
    <label className="flex items-center gap-2 rounded-md border p-3 text-xs">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <span className="flex items-center gap-1.5 font-normal">
        <HugeiconsIcon icon={Cash02Icon} className="size-3.5" />
        Salario a convenir (no mostrar monto)
      </span>
    </label>
  )
}
