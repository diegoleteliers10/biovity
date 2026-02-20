"use client"

import { IdeaIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ReactNode, Ref } from "react"
import type { LabelProps as AriaLabelProps } from "react-aria-components"
import { Label as AriaLabel } from "react-aria-components"
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip"
import { cx } from "@/lib/utils/cx"

type LabelProps = AriaLabelProps & {
  readonly children: ReactNode
  readonly isRequired?: boolean
  readonly tooltip?: string
  readonly tooltipDescription?: string
  readonly ref?: Ref<HTMLLabelElement>
}

export const Label = ({
  isRequired,
  tooltip,
  tooltipDescription,
  className,
  ...props
}: LabelProps) => {
  return (
    <AriaLabel
      data-label="true"
      {...props}
      className={cx(
        "flex cursor-default items-center gap-0.5 text-sm font-medium text-secondary",
        className
      )}
    >
      {props.children}

      <span
        className={cx(
          "hidden text-brand-tertiary",
          isRequired && "block",
          typeof isRequired === "undefined" && "group-required:block"
        )}
      >
        *
      </span>

      {tooltip && (
        <Tooltip title={tooltip} description={tooltipDescription} placement="top">
          <TooltipTrigger
            isDisabled={false}
            className="cursor-pointer text-fg-quaternary transition duration-200 hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover"
          >
            <HugeiconsIcon icon={IdeaIcon} className="size-4" />
          </TooltipTrigger>
        </Tooltip>
      )}
    </AriaLabel>
  )
}

Label.displayName = "Label"
