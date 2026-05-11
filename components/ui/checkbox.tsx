import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as React from "react"

import { cn } from "@/lib/utils"

const Checkbox = ({
  className,
  label,
  ...props
}: React.ComponentProps<"input"> & { label?: React.ReactNode }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" {...props} />
        <div
          className={cn(
            "size-4 border-2 border-input rounded flex items-center justify-center transition-colors",
            props.checked && "bg-primary border-primary",
            className
          )}
        >
          {props.checked && (
            <HugeiconsIcon icon={Tick02Icon} className="size-3 text-primary-foreground" />
          )}
        </div>
      </div>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
Checkbox.displayName = "Checkbox"

export { Checkbox }
