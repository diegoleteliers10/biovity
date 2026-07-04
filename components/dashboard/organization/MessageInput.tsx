"use client"

import {
  Attachment01Icon,
  Calendar01Icon,
  Image01Icon,
  Sent02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  isPending: boolean
  sendError?: Error | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
  onCreateEvent?: () => void
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  isPending,
  sendError,
  onImageChange,
  onFileChange,
  isUploading,
  onCreateEvent,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="shrink-0 border-t border-border bg-background p-4">
      {sendError && (
        <p className="mb-2 text-destructive text-sm">
          {sendError instanceof Error ? sendError.message : "Error al enviar"}
        </p>
      )}
      {isUploading && <p className="mb-2 text-muted-foreground text-sm">Subiendo archivo…</p>}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          className="hidden"
          aria-label="Seleccionar archivos"
          onChange={onFileChange}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Seleccionar imágenes"
          onChange={onImageChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Adjuntar" disabled={isUploading}>
              <HugeiconsIcon icon={Attachment01Icon} size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Adjuntar</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => imageInputRef.current?.click()}
            >
              <HugeiconsIcon icon={Image01Icon} size={18} className="mr-2 size-4" />
              Imágenes
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => fileInputRef.current?.click()}
            >
              <HugeiconsIcon icon={Attachment01Icon} size={18} className="mr-2 size-4" />
              Archivos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onCreateEvent && (
          <Button variant="ghost" size="icon" aria-label="Crear evento" onClick={onCreateEvent}>
            <HugeiconsIcon icon={Calendar01Icon} size={20} />
          </Button>
        )}

        <div className="relative flex-1">
          <textarea
            ref={messageInputRef}
            value={value}
            onChange={(e) => {
              const nextValue = e.target.value
              onChange(nextValue)
              const computed = e.target.style.cssText
              e.target.style.cssText = `${computed} height: auto;`
              const nextHeight = Math.min(e.target.scrollHeight, 220)
              e.target.style.cssText = `${computed} height: auto; height: ${nextHeight}px; overflow-y: ${e.target.scrollHeight > 220 ? "auto" : "hidden"};`
            }}
            onKeyDown={onKeyPress}
            placeholder="Escribe un mensaje..."
            className="w-full min-h-[40px] max-h-[220px] resize-none overflow-y-hidden rounded-md border border-input bg-transparent px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
          />
        </div>

        <Button
          onClick={onSend}
          disabled={!value.trim() || isPending || isUploading}
          size="icon"
          aria-label="Enviar"
        >
          <HugeiconsIcon icon={Sent02Icon} size={20} />
        </Button>
      </div>
    </div>
  )
}
