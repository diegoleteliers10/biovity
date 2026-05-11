"use client"

import type { FileUIPart, SourceDocumentUIPart } from "ai"
import { ImageIcon, Monitor, PlusIcon } from "lucide-react"
import { nanoid } from "nanoid"
import type { ChangeEventHandler, ComponentProps, FormEvent, HTMLAttributes } from "react"
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { captureScreenshot } from "./lib/utils/prompt-input-utils"

export type { AttachmentsContext } from "./contexts/attachments-context"
export {
  ProviderAttachmentsContext,
  useOptionalProviderAttachments,
  useProviderAttachments,
} from "./contexts/attachments-context"
export type { PromptInputControllerProps, TextInputContext } from "./contexts/controller-context"
export {
  useOptionalPromptInputController,
  usePromptInputController,
} from "./contexts/controller-context"
export {
  LocalReferencedSourcesContext,
  usePromptInputReferencedSources,
} from "./contexts/referenced-sources-context"
export type { ReferencedSourcesContext } from "./contexts/referenced-sources-context"
export { useDragDrop } from "./hooks/use-drag-drop"
export { LocalAttachmentsContext, usePromptInputAttachments } from "./hooks/use-file-handling"
export { convertBlobUrlToDataUrl } from "./lib/utils/prompt-input-utils"
export { PromptInputButton } from "./prompt-input-button"
export { PromptInputProvider } from "./prompt-input-provider"
export { PromptInputSubmit } from "./prompt-input-submit"
export { PromptInputTextarea } from "./prompt-input-textarea"
export { usePromptSubmit }

import { PromptInputButton } from "./prompt-input-button"
import { useDragDrop } from "./hooks/use-drag-drop"
import { useOptionalPromptInputController } from "./contexts/controller-context"
import type { AttachmentsContext } from "./contexts/attachments-context"
import type { ReferencedSourcesContext } from "./contexts/referenced-sources-context"
import {
  LocalReferencedSourcesContext,
  usePromptInputReferencedSources,
} from "./contexts/referenced-sources-context"
import { usePromptInputAttachments } from "./hooks/use-file-handling"
import { usePromptSubmit } from "./hooks/use-prompt-submit"

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null)

export type PromptInputActionAddAttachmentsProps = ComponentProps<typeof DropdownMenuItem> & {
  label?: string
}

export const PromptInputActionAddAttachments = ({
  label = "Add photos or files",
  ...props
}: PromptInputActionAddAttachmentsProps) => {
  const attachments = usePromptInputAttachments()

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault()
      attachments.openFileDialog()
    },
    [attachments]
  )

  return (
    <DropdownMenuItem {...props} onSelect={handleSelect}>
      <ImageIcon className="mr-2 size-4" /> {label}
    </DropdownMenuItem>
  )
}

export type PromptInputActionAddScreenshotProps = ComponentProps<typeof DropdownMenuItem> & {
  label?: string
}

export const PromptInputActionAddScreenshot = ({
  label = "Take screenshot",
  onSelect,
  ...props
}: PromptInputActionAddScreenshotProps) => {
  const attachments = usePromptInputAttachments()

  const handleSelect = useCallback(
    async (event: Event) => {
      onSelect?.(event)
      if (event.defaultPrevented) {
        return
      }

      try {
        const screenshot = await captureScreenshot()
        if (screenshot) {
          attachments.add([screenshot])
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "AbortError")
        ) {
          return
        }
        throw error
      }
    },
    [onSelect, attachments]
  )

  return (
    <DropdownMenuItem {...props} onSelect={handleSelect}>
      <Monitor className="mr-2 size-4" />
      {label}
    </DropdownMenuItem>
  )
}

export type PromptInputMessage = {
  text: string
  files: FileUIPart[]
}

export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> & {
  accept?: string
  multiple?: boolean
  globalDrop?: boolean
  syncHiddenInput?: boolean
  maxFiles?: number
  maxFileSize?: number
  onError?: (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export const PromptInput = ({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController()
  const usingProvider = !!controller

  const inputRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([])
  const files = usingProvider ? controller.attachments.files : items

  const [referencedSources, setReferencedSources] = useState<
    (SourceDocumentUIPart & { id: string })[]
  >([])

  const filesRef = useRef(files)

  useEffect(() => {
    filesRef.current = files
  }, [files])

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === "") {
        return true
      }

      const patterns = accept.split(",").flatMap((s) => {
        const trimmed = s.trim()
        return trimmed ? [trimmed] : []
      })

      return patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          const prefix = pattern.slice(0, -1)
          return f.type.startsWith(prefix)
        }
        return f.type === pattern
      })
    },
    [accept]
  )

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList]
      const accepted = incoming.filter((f) => matchesAccept(f))
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        })
        return
      }
      const withinSize = (f: File) => (maxFileSize ? f.size <= maxFileSize : true)
      const sized = accepted.filter(withinSize)
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        })
        return
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === "number" ? Math.max(0, maxFiles - prev.length) : undefined
        const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized
        if (typeof capacity === "number" && sized.length > capacity) {
          onError?.({
            code: "max_files",
            message: "Too many files. Some were not added.",
          })
        }
        const next: (FileUIPart & { id: string })[] = []
        for (const file of capped) {
          next.push({
            filename: file.name,
            id: nanoid(),
            mediaType: file.type,
            type: "file",
            url: URL.createObjectURL(file),
          })
        }
        return [...prev, ...next]
      })
    },
    [matchesAccept, maxFiles, maxFileSize, onError]
  )

  const removeLocal = useCallback(
    (id: string) =>
      setItems((prev) => {
        const found = prev.find((file) => file.id === id)
        if (found?.url) {
          URL.revokeObjectURL(found.url)
        }
        return prev.filter((file) => file.id !== id)
      }),
    []
  )

  const addWithProviderValidation = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = [...fileList]
      const accepted = incoming.filter((f) => matchesAccept(f))
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: "No files match the accepted types.",
        })
        return
      }
      const withinSize = (f: File) => (maxFileSize ? f.size <= maxFileSize : true)
      const sized = accepted.filter(withinSize)
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: "All files exceed the maximum size.",
        })
        return
      }

      const currentCount = files.length
      const capacity =
        typeof maxFiles === "number" ? Math.max(0, maxFiles - currentCount) : undefined
      const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized
      if (typeof capacity === "number" && sized.length > capacity) {
        onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        })
      }

      if (capped.length > 0) {
        controller?.attachments.add(capped)
      }
    },
    [matchesAccept, maxFileSize, maxFiles, onError, files.length, controller]
  )

  const clearAttachments = useCallback(
    () =>
      usingProvider
        ? controller?.attachments.clear()
        : setItems((prev) => {
            for (const file of prev) {
              if (file.url) {
                URL.revokeObjectURL(file.url)
              }
            }
            return []
          }),
    [usingProvider, controller]
  )

  const clearReferencedSources = useCallback(() => setReferencedSources([]), [])

  const add = usingProvider ? addWithProviderValidation : addLocal
  const remove = usingProvider ? controller.attachments.remove : removeLocal
  const openFileDialog = usingProvider ? controller.attachments.openFileDialog : openFileDialogLocal

  const clear = useCallback(() => {
    clearAttachments()
    clearReferencedSources()
  }, [clearAttachments, clearReferencedSources])

  useEffect(() => {
    if (!usingProvider) {
      return
    }
    controller.__registerFileInput(inputRef, () => inputRef.current?.click())
  }, [usingProvider, controller])

  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = ""
    }
  }, [files, syncHiddenInput])

  useDragDrop(formRef, add, globalDrop)

  useEffect(
    () => () => {
      if (!usingProvider) {
        for (const f of filesRef.current) {
          if (f.url) {
            URL.revokeObjectURL(f.url)
          }
        }
      }
    },
    [usingProvider]
  )

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.currentTarget.files) {
        add(event.currentTarget.files)
      }
      event.currentTarget.value = ""
    },
    [add]
  )

  const attachmentsCtx = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear: clearAttachments,
      fileInputRef: inputRef,
      files: files.map((item) => ({ ...item, id: item.id })),
      openFileDialog,
      remove,
    }),
    [files, add, remove, clearAttachments, openFileDialog]
  )

  const refsCtx = useMemo<ReferencedSourcesContext>(
    () => ({
      add: (incoming: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
        const array = Array.isArray(incoming) ? incoming : [incoming]
        setReferencedSources((prev) => [...prev, ...array.map((s) => ({ ...s, id: nanoid() }))])
      },
      clear: clearReferencedSources,
      remove: (id: string) => {
        setReferencedSources((prev) => prev.filter((s) => s.id !== id))
      },
      sources: referencedSources,
    }),
    [referencedSources, clearReferencedSources]
  )

  const handleSubmit = usePromptSubmit({
    usingProvider,
    controller,
    files,
    onSubmit,
    clear,
  })

  const inner = (
    <>
      <input
        accept={accept}
        aria-label="Upload files"
        className="hidden"
        multiple={multiple}
        onChange={handleFileSelect}
        ref={inputRef}
        title="Upload files"
        type="file"
      />
      <form className={cn("w-full", className)} onSubmit={handleSubmit} ref={formRef} {...props}>
        <InputGroup className="overflow-hidden">{children}</InputGroup>
      </form>
    </>
  )

  const withReferencedSources = (
    <LocalReferencedSourcesContext.Provider value={refsCtx}>
      {inner}
    </LocalReferencedSourcesContext.Provider>
  )

  return (
    <LocalAttachmentsContext.Provider value={attachmentsCtx}>
      {withReferencedSources}
    </LocalAttachmentsContext.Provider>
  )
}

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>

export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => (
  <div className={cn("contents", className)} {...props} />
)

export type PromptInputHeaderProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">

export const PromptInputHeader = ({ className, ...props }: PromptInputHeaderProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn("order-first flex-wrap gap-1", className)}
    {...props}
  />
)

export type PromptInputFooterProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">

export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => (
  <InputGroupAddon
    align="block-end"
    className={cn("justify-between gap-1", className)}
    {...props}
  />
)

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>

export const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div className={cn("flex min-w-0 items-center gap-1", className)} {...props} />
)

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>
export const PromptInputActionMenu = (props: PromptInputActionMenuProps) => (
  <DropdownMenu {...props} />
)

export type PromptInputActionMenuTriggerProps = Parameters<typeof PromptInputButton>[0]

export const PromptInputActionMenuTrigger = ({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) => (
  <DropdownMenuTrigger asChild>
    <PromptInputButton className={className} {...props}>
      {children ?? <PlusIcon className="size-4" />}
    </PromptInputButton>
  </DropdownMenuTrigger>
)

export type PromptInputActionMenuContentProps = ComponentProps<typeof DropdownMenuContent>
export const PromptInputActionMenuContent = ({
  className,
  ...props
}: PromptInputActionMenuContentProps) => (
  <DropdownMenuContent align="start" className={cn(className)} {...props} />
)

export type PromptInputActionMenuItemProps = ComponentProps<typeof DropdownMenuItem>
export const PromptInputActionMenuItem = ({
  className,
  ...props
}: PromptInputActionMenuItemProps) => <DropdownMenuItem className={cn(className)} {...props} />

export type PromptInputSelectProps = ComponentProps<typeof Select>

export const PromptInputSelect = (props: PromptInputSelectProps) => <Select {...props} />

export type PromptInputSelectTriggerProps = ComponentProps<typeof SelectTrigger>

export const PromptInputSelectTrigger = ({
  className,
  ...props
}: PromptInputSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
      className
    )}
    {...props}
  />
)

export type PromptInputSelectContentProps = ComponentProps<typeof SelectContent>

export const PromptInputSelectContent = ({
  className,
  ...props
}: PromptInputSelectContentProps) => <SelectContent className={cn(className)} {...props} />

export type PromptInputSelectItemProps = ComponentProps<typeof SelectItem>

export const PromptInputSelectItem = ({ className, ...props }: PromptInputSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
)

export type PromptInputSelectValueProps = ComponentProps<typeof SelectValue>

export const PromptInputSelectValue = ({ className, ...props }: PromptInputSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
)

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>

export const PromptInputHoverCard = ({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) => (
  <HoverCard closeDelay={closeDelay} openDelay={openDelay} {...props} />
)

export type PromptInputHoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>

export const PromptInputHoverCardTrigger = (props: PromptInputHoverCardTriggerProps) => (
  <HoverCardTrigger {...props} />
)

export type PromptInputHoverCardContentProps = ComponentProps<typeof HoverCardContent>

export const PromptInputHoverCardContent = ({
  align = "start",
  ...props
}: PromptInputHoverCardContentProps) => <HoverCardContent align={align} {...props} />

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement>

export const PromptInputTabsList = ({ className, ...props }: PromptInputTabsListProps) => (
  <div className={cn(className)} {...props} />
)

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement>

export const PromptInputTab = ({ className, ...props }: PromptInputTabProps) => (
  <div className={cn(className)} {...props} />
)

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement>

export const PromptInputTabLabel = ({
  className,
  children,
  ...props
}: PromptInputTabLabelProps) => (
  <h3
    aria-label={String(children)}
    className={cn("mb-2 px-3 font-medium text-muted-foreground text-xs", className)}
    {...props}
  >
    {children}
  </h3>
)

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement>

export const PromptInputTabBody = ({ className, ...props }: PromptInputTabBodyProps) => (
  <div className={cn("space-y-1", className)} {...props} />
)

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement>

export const PromptInputTabItem = ({ className, ...props }: PromptInputTabItemProps) => (
  <div
    className={cn("flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent", className)}
    {...props}
  />
)

export type PromptInputCommandProps = ComponentProps<typeof Command>

export const PromptInputCommand = ({ className, ...props }: PromptInputCommandProps) => (
  <Command className={cn(className)} {...props} />
)

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>

export const PromptInputCommandInput = ({ className, ...props }: PromptInputCommandInputProps) => (
  <CommandInput className={cn(className)} {...props} />
)

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>

export const PromptInputCommandList = ({ className, ...props }: PromptInputCommandListProps) => (
  <CommandList className={cn(className)} {...props} />
)

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>

export const PromptInputCommandEmpty = ({ className, ...props }: PromptInputCommandEmptyProps) => (
  <CommandEmpty className={cn(className)} {...props} />
)

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>

export const PromptInputCommandGroup = ({ className, ...props }: PromptInputCommandGroupProps) => (
  <CommandGroup className={cn(className)} {...props} />
)

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>

export const PromptInputCommandItem = ({ className, ...props }: PromptInputCommandItemProps) => (
  <CommandItem className={cn(className)} {...props} />
)

export type PromptInputCommandSeparatorProps = ComponentProps<typeof CommandSeparator>

export const PromptInputCommandSeparator = ({
  className,
  ...props
}: PromptInputCommandSeparatorProps) => <CommandSeparator className={cn(className)} {...props} />
