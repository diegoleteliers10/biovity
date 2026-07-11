"use client"

import {
  Attachment01Icon,
  BookmarkAdd01Icon,
  Calendar01Icon,
  Cancel01Icon,
  Image01Icon,
  NoteAddIcon,
  Sent02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useCreateMessageTemplateMutation,
  useMessageTemplates,
} from "@/lib/api/use-message-templates"

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
  organizationId?: string // F9.1 — Add organizationId to load message templates
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
  organizationId,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  // Message template creation state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [templateTitle, setTemplateTitle] = useState("")

  const { data: templates = [], isLoading: templatesLoading } = useMessageTemplates(organizationId)
  const createTemplateMutation = useCreateMessageTemplateMutation(organizationId ?? "")

  const handleSaveTemplate = async () => {
    if (!templateTitle.trim() || !value.trim() || !organizationId) return
    await createTemplateMutation.mutateAsync({
      title: templateTitle.trim(),
      content: value.trim(),
    })
    setTemplateTitle("")
    setSaveDialogOpen(false)
  }

  const handleSelectTemplate = (content: string) => {
    onChange(content)
    if (messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }

  return (
    <div className="shrink-0 border-t border-border bg-background p-4">
      {sendError && (
        <p className="mb-2 text-destructive text-sm">
          {sendError instanceof Error ? sendError.message : "Error al enviar"}
        </p>
      )}
      {isUploading && <p className="mb-2 text-muted-foreground text-sm">Subiendo archivo…</p>}
      <div className="flex items-center gap-2">
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

        {/* Attachments Dropdown */}
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

        {/* F9.1 — Message Templates Dropdown */}
        {organizationId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Respuestas guardadas"
                id="message-templates-btn"
              >
                <HugeiconsIcon icon={NoteAddIcon} size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
              <DropdownMenuLabel>Respuestas guardadas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {templatesLoading && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Cargando plantillas...
                </div>
              )}
              {!templatesLoading && templates.length === 0 && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  No hay plantillas guardadas
                </div>
              )}
              {templates.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  className="cursor-pointer flex flex-col items-start gap-0.5"
                  onSelect={() => handleSelectTemplate(t.content)}
                >
                  <span className="font-medium text-sm text-foreground">{t.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{t.content}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={!value.trim()}
                onSelect={() => setSaveDialogOpen(true)}
                id="save-as-template"
              >
                <HugeiconsIcon icon={BookmarkAdd01Icon} size={14} className="mr-2 size-4" />
                Guardar mensaje actual...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {onCreateEvent && (
          <Button variant="ghost" size="icon" aria-label="Crear evento" onClick={onCreateEvent}>
            <HugeiconsIcon icon={Calendar01Icon} size={20} />
          </Button>
        )}

        <div className="relative flex-1 min-w-0">
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

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Guardar como plantilla de respuesta</DialogTitle>
            <DialogDescription>
              Guarda el texto actual para poder insertarlo rápidamente en futuros mensajes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="template-title">Título de la plantilla</Label>
              <Input
                id="template-title"
                placeholder="ej: Saludo inicial, Solicitud de portafolio"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSaveTemplate()
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <div className="rounded-md border bg-muted/20 p-3 text-sm text-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                {value}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={!templateTitle.trim() || createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
