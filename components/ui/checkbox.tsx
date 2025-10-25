import * as React from "react"
import { Check } from "lucide-react"

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
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center transition-colors",
            props.checked && "bg-blue-600 border-blue-600",
            className
          )}
        >
          {props.checked && (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
