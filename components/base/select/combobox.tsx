"use client"

import { SearchLg as SearchIcon } from "@untitledui/icons"
import { Briefcase } from "lucide-react"
import type { FocusEventHandler, PointerEventHandler, RefAttributes, RefObject } from "react"
import { useCallback, useContext, useRef, useState } from "react"
import type {
  ComboBoxProps as AriaComboBoxProps,
  GroupProps as AriaGroupProps,
  ListBoxProps as AriaListBoxProps,
} from "react-aria-components"
import {
  ComboBox as AriaComboBox,
  Group as AriaGroup,
  Input as AriaInput,
  ListBox as AriaListBox,
  ComboBoxStateContext,
} from "react-aria-components"
import { HintText } from "@/components/base/input/hint-text"
import { Label } from "@/components/base/input/label"
import { Popover } from "@/components/base/select/popover"
import {
  type CommonProps,
  SelectContext,
  type SelectItemType,
  sizes,
} from "@/components/base/select/select"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { cx } from "@/lib/utils/cx"

interface ComboBoxProps
  extends Omit<AriaComboBoxProps<SelectItemType>, "children" | "items">,
    RefAttributes<HTMLDivElement>,
    CommonProps {
  shortcut?: boolean
  items?: SelectItemType[]
  popoverClassName?: string
  shortcutClassName?: string
  children: AriaListBoxProps<SelectItemType>["children"]
}

interface ComboBoxValueProps extends AriaGroupProps {
  size: "sm" | "md"
  shortcut: boolean
  placeholder?: string
  shortcutClassName?: string
  onFocus?: FocusEventHandler
  onPointerEnter?: PointerEventHandler
  ref?: RefObject<HTMLDivElement | null>
}

const ComboBoxValue = ({
  size,
  shortcut,
  placeholder,
  shortcutClassName,
  ...otherProps
}: ComboBoxValueProps) => {
  const state = useContext(ComboBoxStateContext)

  const value = state?.selectedItem?.value || null
  const inputValue = state?.inputValue || null

  const first = inputValue?.split(value?.supportingText)?.[0] || ""
  const last = inputValue?.split(first)[1]

  return (
    <AriaGroup
      {...otherProps}
      className={({ isFocusWithin, isDisabled }) =>
        cx(
          "relative flex w-full items-center gap-2 rounded-lg bg-transparent shadow-xs outline-hidden transition-shadow duration-100 ease-linear border-input border",
          isDisabled && "cursor-not-allowed bg-disabled_subtle",
          isFocusWithin &&
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          sizes[size].root
        )
      }
    >
      {({ isDisabled }) => (
        <>
          <Briefcase className="pointer-events-none text-gray-400 w-4 h-4" />

          <div className="relative flex w-full items-center gap-2">
            {inputValue && (
              <span
                className="absolute top-1/2 z-0 inline-flex w-full -translate-y-1/2 gap-2 truncate"
                aria-hidden="true"
              >
                <p className={cx("text-sm text-primary", isDisabled && "text-disabled")}>{first}</p>
                {last && (
                  <p
                    className={cx("-ml-0.75 text-md text-tertiary", isDisabled && "text-disabled")}
                  >
                    {last}
                  </p>
                )}
              </span>
            )}

            <AriaInput
              placeholder={placeholder}
              className="z-10 w-full appearance-none bg-transparent text-sm text-transparent caret-alpha-black/90 placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:text-disabled disabled:placeholder:text-disabled"
            />
          </div>
        </>
      )}
    </AriaGroup>
  )
}

export const ComboBox = ({
  placeholder = "Search",
  shortcut = true,
  size = "sm",
  children,
  items,
  shortcutClassName,
  ...otherProps
}: ComboBoxProps) => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [popoverWidth, setPopoverWidth] = useState("")

  // Resize observer for popover width
  const onResize = useCallback(() => {
    if (!placeholderRef.current) return

    const divRect = placeholderRef.current?.getBoundingClientRect()

    setPopoverWidth(divRect.width + "px")
  }, [placeholderRef, setPopoverWidth])

  useResizeObserver({
    ref: placeholderRef,
    box: "border-box",
    onResize,
  })

  return (
    <SelectContext.Provider value={{ size }}>
      <AriaComboBox menuTrigger="focus" {...otherProps}>
        {(state) => (
          <div className="flex flex-col gap-1.5">
            {otherProps.label && (
              <Label isRequired={state.isRequired} tooltip={otherProps.tooltip}>
                {otherProps.label}
              </Label>
            )}

            <ComboBoxValue
              ref={placeholderRef}
              placeholder={placeholder}
              shortcut={shortcut}
              shortcutClassName={shortcutClassName}
              size={size}
              // This is a workaround to correctly calculating the trigger width
              // while using ResizeObserver wasn't 100% reliable.
              onFocus={onResize}
              onPointerEnter={onResize}
            />

            <Popover
              size={size}
              triggerRef={placeholderRef}
              style={{ width: popoverWidth }}
              className={otherProps.popoverClassName}
            >
              <AriaListBox items={items} className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>
          </div>
        )}
      </AriaComboBox>
    </SelectContext.Provider>
  )
}
