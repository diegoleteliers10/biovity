"use client"

import type { FileUIPart } from "ai"
import { nanoid } from "nanoid"
import type { PropsWithChildren, RefObject } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { AttachmentsContext } from "./contexts/attachments-context"
import { ProviderAttachmentsContext } from "./contexts/attachments-context"
import type { PromptInputControllerProps } from "./contexts/controller-context"
import { PromptInputController } from "./contexts/controller-context"

export type { AttachmentsContext } from "./contexts/attachments-context"
export {
  useOptionalProviderAttachments,
  useProviderAttachments,
} from "./contexts/attachments-context"
export type { PromptInputControllerProps, TextInputContext } from "./contexts/controller-context"
export {
  useOptionalPromptInputController,
  usePromptInputController,
} from "./contexts/controller-context"
export type { ReferencedSourcesContext } from "./contexts/referenced-sources-context"
export {
  LocalReferencedSourcesContext,
  usePromptInputReferencedSources,
} from "./contexts/referenced-sources-context"
export { usePromptInputAttachments } from "./hooks/use-file-handling"

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string
}>

export const PromptInputProvider = ({
  initialInput: initialTextInput = "",
  children,
}: PromptInputProviderProps) => {
  const [textInput, setTextInput] = useState(initialTextInput)
  const clearInput = useCallback(() => setTextInput(""), [])

  const [attachmentFiles, setAttachmentFiles] = useState<(FileUIPart & { id: string })[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const openRef = useRef<() => void>(() => {})

  const add = useCallback((files: File[] | FileList) => {
    const incoming = [...files]
    if (incoming.length === 0) {
      return
    }

    setAttachmentFiles((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        filename: file.name,
        id: nanoid(),
        mediaType: file.type,
        type: "file" as const,
        url: URL.createObjectURL(file),
      })),
    ])
  }, [])

  const remove = useCallback((id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id)
      if (found?.url) {
        URL.revokeObjectURL(found.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clear = useCallback(() => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url)
        }
      }
      return []
    })
  }, [])

  const attachmentsRef = useRef(attachmentFiles)

  useEffect(() => {
    attachmentsRef.current = attachmentFiles
  }, [attachmentFiles])

  useEffect(
    () => () => {
      for (const f of attachmentsRef.current) {
        if (f.url) {
          URL.revokeObjectURL(f.url)
        }
      }
    },
    []
  )

  const openFileDialog = useCallback(() => {
    openRef.current?.()
  }, [])

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      add,
      clear,
      fileInputRef,
      files: attachmentFiles,
      openFileDialog,
      remove,
    }),
    [attachmentFiles, add, remove, clear, openFileDialog]
  )

  const __registerFileInput = useCallback(
    (ref: RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current
      openRef.current = open
    },
    []
  )

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      __registerFileInput,
      attachments,
      textInput: {
        clear: clearInput,
        setInput: setTextInput,
        value: textInput,
      },
    }),
    [textInput, clearInput, attachments, __registerFileInput]
  )

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  )
}
