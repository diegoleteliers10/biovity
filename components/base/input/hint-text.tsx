"use client"

import type { ReactNode, Ref } from "react"
import type { TextProps as AriaTextProps } from "react-aria-components"
import { Text as AriaText } from "react-aria-components"
import { cx } from "@/lib/utils/cx"

type HintTextProps = AriaTextProps & {
  readonly isInvalid?: boolean
  readonly ref?: Ref<HTMLElement>
  readonly children: ReactNode
}

export const HintText = ({ isInvalid, className, ...props }: HintTextProps) => {
  return (
    <AriaText
      {...props}
      slot={isInvalid ? "errorMessage" : "description"}
      className={cx(
        "text-sm text-tertiary",
        isInvalid && "text-error-primary",
        "group-invalid:text-error-primary",

        className
      )}
    />
  )
}

HintText.displayName = "HintText"
