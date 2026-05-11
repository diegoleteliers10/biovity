"use client"

import { useCallback } from "react"

interface UseDropHandlersOptions {
  add: (files: File[] | FileList) => void
  globalDrop?: boolean
}

interface UseDropHandlersReturn {
  handleDrop: (e: DragEvent) => void
  handleDragOver: (e: DragEvent) => void
  attachFormDropHandlers: (form: HTMLFormElement | null) => () => void
  attachDocumentDropHandlers: () => () => void
}

export const useDropHandlers = (options: UseDropHandlersOptions): UseDropHandlersReturn => {
  const { add, globalDrop } = options

  const handleDragOver = useCallback((e: DragEvent) => {
    if (e.dataTransfer?.types?.includes("Files")) {
      e.preventDefault()
    }
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault()
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files)
      }
    },
    [add]
  )

  const attachFormDropHandlers = useCallback(
    (form: HTMLFormElement | null) => {
      if (!form || globalDrop) {
        return () => {}
      }

      const onDragOver = handleDragOver
      const onDrop = handleDrop
      form.addEventListener("dragover", onDragOver)
      form.addEventListener("drop", onDrop)
      return () => {
        form.removeEventListener("dragover", onDragOver)
        form.removeEventListener("drop", onDrop)
      }
    },
    [handleDragOver, handleDrop, globalDrop]
  )

  const attachDocumentDropHandlers = useCallback(() => {
    if (!globalDrop) {
      return () => {}
    }

    const onDragOver = handleDragOver
    const onDrop = handleDrop
    document.addEventListener("dragover", onDragOver)
    document.addEventListener("drop", onDrop)
    return () => {
      document.removeEventListener("dragover", onDragOver)
      document.removeEventListener("drop", onDrop)
    }
  }, [handleDragOver, handleDrop, globalDrop])

  return {
    handleDrop,
    handleDragOver,
    attachFormDropHandlers,
    attachDocumentDropHandlers,
  }
}
