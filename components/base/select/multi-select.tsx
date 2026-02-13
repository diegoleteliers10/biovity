"use client"

import { SearchLg } from "@untitledui/icons"
import type {
  FocusEventHandler,
  KeyboardEvent,
  PointerEventHandler,
  RefAttributes,
  RefObject,
} from "react"
import { createContext, useCallback, useContext, useRef, useState } from "react"
import { FocusScope, useFilter, useFocusManager } from "react-aria"
import type {
  ComboBoxProps as AriaComboBoxProps,
  GroupProps as AriaGroupProps,
  ListBoxProps as AriaListBoxProps,
  Key,
} from "react-aria-components"
import {
  ComboBox as AriaComboBox,
  Group as AriaGroup,
  Input as AriaInput,
  ListBox as AriaListBox,
  ComboBoxStateContext,
} from "react-aria-components"
import type { ListData } from "react-stately"
import { useListData } from "react-stately"
import type { IconComponentType } from "@/components/base/badges/badge-types"
import { HintText } from "@/components/base/input/hint-text"
import { Label } from "@/components/base/input/label"
import { Popover } from "@/components/base/select/popover"
import { type SelectItemType, sizes } from "@/components/base/select/select"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { cx } from "@/lib/utils/cx"
import { SelectItem } from "./select-item"

type ComboBoxValueProps = AriaGroupProps & {
  readonly size: "sm" | "md"
  readonly shortcut?: boolean
  readonly isDisabled?: boolean
  readonly placeholder?: string
  readonly shortcutClassName?: string
  readonly placeholderIcon?: IconComponentType | null
  readonly ref?: RefObject<HTMLDivElement | null>
  readonly onFocus?: FocusEventHandler
  readonly onPointerEnter?: PointerEventHandler
}

const ComboboxContext = createContext<{
  size: "sm" | "md"
  selectedKeys: Key[]
  selectedItems: ListData<SelectItemType>
  onRemove: (keys: Set<Key>) => void
  onInputChange: (value: string) => void
}>({
  size: "sm",
  selectedKeys: [],
  selectedItems: {} as ListData<SelectItemType>,
  onRemove: () => {},
  onInputChange: () => {},
})

type MultiSelectProps = Omit<AriaComboBoxProps<SelectItemType>, "children" | "items"> &
  RefAttributes<HTMLDivElement> & {
    readonly hint?: string
    readonly label?: string
    readonly tooltip?: string
    readonly size?: "sm" | "md"
    readonly placeholder?: string
    readonly shortcut?: boolean
    readonly items?: readonly SelectItemType[]
    readonly popoverClassName?: string
    readonly shortcutClassName?: string
    readonly selectedItems: ListData<SelectItemType>
    readonly placeholderIcon?: IconComponentType | null
    readonly children: AriaListBoxProps<SelectItemType>["children"]
    readonly onItemCleared?: (key: Key) => void
    readonly onItemInserted?: (key: Key) => void
  }

export const MultiSelectBase = ({
  items,
  children,
  size = "sm",
  selectedItems,
  onItemCleared,
  onItemInserted,
  shortcut,
  placeholder = "Search",
  name: _name,
  className: _className,
  ...props
}: MultiSelectProps) => {
  const { contains } = useFilter({ sensitivity: "base" })
  const selectedKeys = selectedItems.items.map((item) => item.id)

  const filter = useCallback(
    (item: SelectItemType, filterText: string) => {
      return (
        !selectedKeys.includes(item.id) &&
        contains(item.label || item.supportingText || "", filterText)
      )
    },
    [contains, selectedKeys]
  )

  const accessibleList = useListData({
    initialItems: items ? [...items] : [],
    filter,
  })

  const onRemove = useCallback(
    (keys: Set<Key>) => {
      const key = keys.values().next().value

      if (!key) return

      selectedItems.remove(key)
      onItemCleared?.(key)
    },
    [selectedItems, onItemCleared]
  )

  const onSelectionChange = (id: Key | null) => {
    if (!id) {
      return
    }

    const item = accessibleList.getItem(id)

    if (!item) {
      return
    }

    if (!selectedKeys.includes(id as string)) {
      selectedItems.append(item)
      onItemInserted?.(id)
    }

    accessibleList.setFilterText("")
  }

  const onInputChange = (value: string) => {
    accessibleList.setFilterText(value)
  }

  const placeholderRef = useRef<HTMLDivElement>(null)
  const [popoverWidth, setPopoverWidth] = useState("")

  const onResize = useCallback(() => {
    if (!placeholderRef.current) return
    const divRect = placeholderRef.current?.getBoundingClientRect()
    setPopoverWidth(divRect.width + "px")
  }, [placeholderRef, setPopoverWidth])

  useResizeObserver({
    ref: placeholderRef,
    onResize: onResize,
    box: "border-box",
  })

  return (
    <ComboboxContext.Provider
      value={{
        size,
        selectedKeys,
        selectedItems,
        onInputChange,
        onRemove,
      }}
    >
      <AriaComboBox
        allowsEmptyCollection
        menuTrigger="focus"
        items={accessibleList.items}
        onInputChange={onInputChange}
        inputValue={accessibleList.filterText}
        selectedKey={null}
        onSelectionChange={onSelectionChange}
        {...props}
      >
        {(state) => (
          <div className="flex flex-col gap-1.5">
            {props.label && (
              <Label isRequired={state.isRequired} tooltip={props.tooltip}>
                {props.label}
              </Label>
            )}

            <MultiSelectTagsValue
              size={size}
              shortcut={shortcut}
              ref={placeholderRef}
              placeholder={placeholder}
              onFocus={onResize}
              onPointerEnter={onResize}
            />

            <Popover
              size={"md"}
              triggerRef={placeholderRef}
              style={{ width: popoverWidth }}
              className={props?.popoverClassName}
            >
              <AriaListBox selectionMode="multiple" className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>

            {props.hint && <HintText isInvalid={state.isInvalid}>{props.hint}</HintText>}
          </div>
        )}
      </AriaComboBox>
    </ComboboxContext.Provider>
  )
}

const InnerMultiSelect = ({
  isDisabled,
  shortcut,
  shortcutClassName,
  placeholder,
}: Omit<MultiSelectProps, "selectedItems" | "children">) => {
  const focusManager = useFocusManager()
  const comboBoxContext = useContext(ComboboxContext)
  const comboBoxStateContext = useContext(ComboBoxStateContext)

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isCaretAtStart =
      event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0

    if (!isCaretAtStart && event.currentTarget.value !== "") {
      return
    }

    switch (event.key) {
      case "Backspace":
      case "ArrowLeft":
        focusManager?.focusPrevious({ wrap: false, tabbable: false })
        break
      case "ArrowRight":
        focusManager?.focusNext({ wrap: false, tabbable: false })
        break
    }
  }

  const handleInputMouseDown = useCallback(
    (_event: React.MouseEvent<HTMLInputElement>) => {
      if (comboBoxStateContext && !comboBoxStateContext.isOpen) {
        comboBoxStateContext.open()
      }
    },
    [comboBoxStateContext]
  )

  return (
    <div className="relative flex w-full flex-1 flex-row items-center justify-start gap-1.5">
      <div
        className={cx(
          "relative flex min-w-[20%] flex-1 flex-row items-center",
          shortcut && "min-w-[30%]"
        )}
      >
        <AriaInput
          placeholder={placeholder}
          onKeyDown={handleInputKeyDown}
          onMouseDown={handleInputMouseDown}
          className="w-full flex-[1_0_0] appearance-none bg-transparent text-md text-ellipsis text-primary caret-alpha-black/90 outline-none placeholder:text-placeholder focus:outline-hidden disabled:cursor-not-allowed disabled:text-disabled disabled:placeholder:text-disabled"
        />

        {shortcut && (
          <div
            aria-hidden="true"
            className={cx(
              "absolute inset-y-0.5 right-0.5 z-10 flex items-center rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8",
              shortcutClassName
            )}
          >
            <span
              className={cx(
                "pointer-events-none rounded px-1 py-px text-xs font-medium text-quaternary ring-1 ring-secondary select-none ring-inset",
                isDisabled && "bg-transparent text-disabled"
              )}
            >
              ⌘K
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const MultiSelectTagsValue = ({
  size,
  shortcut,
  placeholder,
  shortcutClassName,
  placeholderIcon: Icon = SearchLg,
  isDisabled: _isDisabled,
  ...otherProps
}: ComboBoxValueProps) => {
  return (
    <AriaGroup
      {...otherProps}
      className={({ isFocusWithin, isDisabled }) =>
        cx(
          "relative flex w-full items-center gap-2 rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset",
          isDisabled && "cursor-not-allowed bg-disabled_subtle",
          isFocusWithin && "ring-2 ring-brand",
          sizes[size].root
        )
      }
    >
      {({ isDisabled }) => (
        <>
          {Icon && <Icon className="pointer-events-none size-5 text-fg-quaternary" />}
          <FocusScope contain={false} autoFocus={false} restoreFocus={false}>
            <InnerMultiSelect
              isDisabled={isDisabled}
              size={size}
              shortcut={shortcut}
              shortcutClassName={shortcutClassName}
              placeholder={placeholder}
            />
          </FocusScope>
        </>
      )}
    </AriaGroup>
  )
}

const MultiSelect = MultiSelectBase as typeof MultiSelectBase & {
  Item: typeof SelectItem
}

MultiSelect.Item = SelectItem

export { MultiSelect }
