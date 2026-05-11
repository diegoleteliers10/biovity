"use client"

import {
  Attachment01Icon,
  Calendar04Icon,
  Image01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { useSendMessageMutation } from "@/lib/api/use-messages"

type MessageInputProps = {
  messageInput: string
  onMessageChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSendMessage: () => void
  sendMutation: ReturnType<typeof useSendMessageMutation>
  messageInputRef: React.RefObject<HTMLTextAreaElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  imageInputRef: React.RefObject<HTMLInputElement | null>
}

export function MessageInput({
  messageInput,
  onMessageChange,
  onKeyDown,
  onSendMessage,
  sendMutation,
  messageInputRef,
  fileInputRef,
  imageInputRef,
}: MessageInputProps) {
  return (
    <div className="shrink-0 border-t border-border bg-background p-4">
      {sendMutation.isError && (
        <p className="mb-2 text-destructive text-sm">
          {sendMutation.error instanceof Error ? sendMutation.error.message : "Error al enviar"}
        </p>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          className="hidden"
          aria-label="Seleccionar archivos"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          aria-label="Seleccionar imágenes"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Adjuntar">
              <HugeiconsIcon icon={Attachment01Icon} size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Adjuntar</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <HugeiconsIcon icon={Image01Icon} size={18} className="mr-2 size-4" />
              Imágenes
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HugeiconsIcon icon={Calendar04Icon} size={18} className="mr-2 size-4" />
              Reunión
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HugeiconsIcon icon={Attachment01Icon} size={18} className="mr-2 size-4" />
              Archivos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative flex-1">
          <textarea
            ref={messageInputRef}
            value={messageInput}
            onChange={(e) => {
              const nextValue = e.target.value
              onMessageChange(nextValue)
              const computed = e.target.style.cssText
              e.target.style.cssText = `${computed} height: auto;`
              const nextHeight = Math.min(e.target.scrollHeight, 220)
              e.target.style.cssText = `${computed} height: auto; height: ${nextHeight}px; overflow-y: ${e.target.scrollHeight > 220 ? "auto" : "hidden"};`
            }}
            onKeyDown={onKeyDown}
            placeholder="Escribe un mensaje..."
            className="w-full min-h-[40px] max-h-[220px] resize-none overflow-y-hidden rounded-md border border-input bg-transparent px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
          />
        </div>

        <Button
          onClick={onSendMessage}
          disabled={!messageInput.trim() || sendMutation.isPending}
          size="icon"
          aria-label="Enviar"
        >
          <HugeiconsIcon icon={Sent02Icon} size={20} />
        </Button>
      </div>
    </div>
  )
}
