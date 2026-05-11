"use client"

import type { FileUIPart } from "ai"
import { createContext, use } from "react"

import { useOptionalProviderAttachments } from "../contexts/attachments-context"

export type LocalAttachmentsContext = {
  files: (FileUIPart & { id: string })[]
  add: (files: File[] | FileList) => void
  remove: (id: string) => void
  clear: () => void
  openFileDialog: () => void
  fileInputRef: import("react").RefObject<HTMLInputElement | null>
}

export const LocalAttachmentsContext = createContext<LocalAttachmentsContext | null>(null)

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments()
  const local = use(LocalAttachmentsContext)
  const context = local ?? provider
  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    )
  }
  return context
}
