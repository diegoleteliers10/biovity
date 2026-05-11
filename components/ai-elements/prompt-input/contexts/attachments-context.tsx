"use client"

import type { FileUIPart } from "ai"
import type { PropsWithChildren } from "react"
import { createContext, use } from "react"

export type AttachmentsContext = {
  files: (FileUIPart & { id: string })[]
  add: (files: File[] | FileList) => void
  remove: (id: string) => void
  clear: () => void
  openFileDialog: () => void
  fileInputRef: import("react").RefObject<HTMLInputElement | null>
}

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string
}>

export const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(null)

export const useProviderAttachments = () => {
  const ctx = use(ProviderAttachmentsContext)
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    )
  }
  return ctx
}

export const useOptionalProviderAttachments = () => use(ProviderAttachmentsContext)
