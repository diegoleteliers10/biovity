"use client"

import type { FileUIPart } from "ai"
import { useCallback } from "react"

interface UseFileAttachmentManagerOptions {
  maxFiles?: number
  maxFileSize?: number
  accept?: string
  onError?: (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void
  controller?: {
    attachments: {
      add: (files: File[] | FileList) => void
      remove: (id: string) => void
      clear: () => void
    }
  } | null
  usingProvider: boolean
}

interface UseFileAttachmentManagerReturn {
  matchesAccept: (f: File) => boolean
  addWithValidation: (
    fileList: File[] | FileList,
    addLocal: (files: File[] | FileList) => void,
    filesLength: number
  ) => void
  removeLocal: (
    id: string,
    items: (FileUIPart & { id: string })[]
  ) => (FileUIPart & { id: string })[]
  clearLocal: (items: (FileUIPart & { id: string })[]) => void
}

export const useFileAttachmentManager = (
  options: UseFileAttachmentManagerOptions
): UseFileAttachmentManagerReturn => {
  const { maxFiles, maxFileSize, accept, onError } = options

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

  const addWithValidation = useCallback(
    (
      fileList: File[] | FileList,
      addLocal: (files: File[] | FileList) => void,
      filesLength: number
    ) => {
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

      const capacity =
        typeof maxFiles === "number" ? Math.max(0, maxFiles - filesLength) : undefined
      const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized
      if (typeof capacity === "number" && sized.length > capacity) {
        onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        })
      }

      addLocal(capped)
    },
    [matchesAccept, maxFileSize, maxFiles, onError]
  )

  const removeLocal = useCallback((id: string, items: (FileUIPart & { id: string })[]) => {
    const found = items.find((file) => file.id === id)
    if (found?.url) {
      URL.revokeObjectURL(found.url)
    }
    return items.filter((file) => file.id !== id)
  }, [])

  const clearLocal = useCallback((items: (FileUIPart & { id: string })[]) => {
    for (const file of items) {
      if (file.url) {
        URL.revokeObjectURL(file.url)
      }
    }
  }, [])

  return {
    matchesAccept,
    addWithValidation,
    removeLocal,
    clearLocal,
  }
}
