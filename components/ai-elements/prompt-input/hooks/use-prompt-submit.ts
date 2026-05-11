"use client"

import type { FileUIPart } from "ai"
import type { FormEvent, FormEventHandler } from "react"
import { useCallback } from "react"

import { convertBlobUrlToDataUrl } from "../lib/utils/prompt-input-utils"

export type PromptInputMessage = {
  text: string
  files: FileUIPart[]
}

export const usePromptSubmit = ({
  usingProvider,
  controller,
  files,
  onSubmit,
  clear,
}: {
  usingProvider: boolean
  controller: import("../contexts/controller-context").PromptInputControllerProps | null
  files: (FileUIPart & { id: string })[]
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void | Promise<void>
  clear: () => void
}): FormEventHandler<HTMLFormElement> => {
  return useCallback(
    async (event) => {
      event.preventDefault()

      const form = event.currentTarget
      const text = usingProvider
        ? (controller?.textInput.value ?? "")
        : (() => {
            const formData = new FormData(form)
            return (formData.get("message") as string) || ""
          })()

      if (!usingProvider) {
        form.reset()
      }

      try {
        const convertedFiles: FileUIPart[] = await Promise.all(
          files.map(async ({ id: _id, ...item }) => {
            if (item.url?.startsWith("blob:")) {
              const dataUrl = await convertBlobUrlToDataUrl(item.url)
              return {
                ...item,
                url: dataUrl ?? item.url,
              }
            }
            return item
          })
        )

        const result = onSubmit({ files: convertedFiles, text }, event)

        if (result instanceof Promise) {
          try {
            await result
            clear()
            if (usingProvider) {
              controller?.textInput.clear()
            }
          } catch {
            // Don't clear on error
          }
        } else {
          clear()
          if (usingProvider) {
            controller?.textInput.clear()
          }
        }
      } catch {
        // Don't clear on error
      }
    },
    [usingProvider, controller, files, onSubmit, clear]
  )
}
