"use client"

import type { ChangeEventHandler, FormEventHandler, RefObject } from "react"

interface PromptInputFormProps {
  accept?: string
  multiple?: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onFileSelect: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  className?: string
}

export const PromptInputForm = ({
  accept,
  multiple,
  inputRef,
  onFileSelect,
  onSubmit,
  className,
}: PromptInputFormProps) => (
  <>
    <input
      accept={accept}
      aria-label="Upload files"
      className="hidden"
      multiple={multiple}
      onChange={onFileSelect}
      ref={inputRef}
      title="Upload files"
      type="file"
    />
    <form className={className} onSubmit={onSubmit}>
      {/* Content rendered via children prop passed to PromptInput */}
    </form>
  </>
)
