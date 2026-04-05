import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    label?: React.ReactNode
  }
>(({ className, label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" ref={ref} {...props} />
        <div
          className={cn(
            "w-4 h-4 border-2 border-input rounded flex items-center justify-center transition-colors",
            props.checked && "bg-primary border-primary",
            className
          )}
        >
          {props.checked && <HugeiconsIcon icon={Tick02Icon} className="w-3 h-3 text-primary-foreground" />}
        </div>
      </div>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
