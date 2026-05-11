"use client"

import type { RefObject } from "react"
import { createContext, use } from "react"

export type TextInputContext = {
  value: string
  setInput: (v: string) => void
  clear: () => void
}

export type PromptInputControllerProps = {
  textInput: TextInputContext
  attachments: import("./attachments-context").AttachmentsContext
  __registerFileInput: (ref: RefObject<HTMLInputElement | null>, open: () => void) => void
}

export const PromptInputController = createContext<PromptInputControllerProps | null>(null)

export const usePromptInputController = () => {
  const ctx = use(PromptInputController)
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    )
  }
  return ctx
}

export const useOptionalPromptInputController = () => use(PromptInputController)
