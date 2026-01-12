"use client"

import type { RefAttributes } from "react"
import type { PopoverProps as AriaPopoverProps } from "react-aria-components"
import { Popover as AriaPopover } from "react-aria-components"
import { cx } from "@/lib/utils/cx"

type PopoverProps = AriaPopoverProps &
  RefAttributes<HTMLElement> & {
    readonly size: "sm" | "md"
  }

export const Popover = (props: PopoverProps) => {
  return (
    <AriaPopover
      placement="bottom"
      containerPadding={0}
      offset={4}
      {...props}
      className={(state) =>
        cx(
          "max-h-64! w-(--trigger-width) origin-(--trigger-anchor-point) overflow-x-hidden overflow-y-auto rounded-lg bg-white py-1 shadow-lg border border-input outline-hidden will-change-transform",

          state.isEntering &&
            "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
          state.isExiting &&
            "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
          props.size === "md" && "max-h-80!",

          typeof props.className === "function" ? props.className(state) : props.className
        )
      }
    />
  )
}
