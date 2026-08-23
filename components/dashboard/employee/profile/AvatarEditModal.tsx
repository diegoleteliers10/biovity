"use client"

import { Camera01Icon, Delete01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AvatarEditModalProps {
  avatar: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (file: File) => void
  onDelete: () => void
  isUploading?: boolean
}

// BANNED: useEffect - EXCEPTIONAL CASE
// REASON: Browser object URL cleanup on revoke
function useObjectUrl(objectUrl: string | null) {
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])
}

export function AvatarEditModal({
  avatar,
  open,
  onOpenChange,
  onUpload,
  onDelete,
  isUploading,
}: AvatarEditModalProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const preview = URL.createObjectURL(file)
        setLocalPreview(preview)
        onUpload(file)
      }
      e.target.value = ""
    },
    [onUpload]
  )

  useObjectUrl(localPreview)

  const handleDelete = useCallback(() => {
    onDelete()
    onOpenChange(false)
  }, [onDelete, onOpenChange])

  const displayAvatar = localPreview || avatar

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl border border-border/50 bg-surface-container-lowest shadow-none">
        <DialogTitle className="sr-only">Editar foto de perfil</DialogTitle>
        <div className="relative">
          <div
            className={cn(
              "relative w-full aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden",
              "max-h-[380px]"
            )}
          >
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar preview"
                width={380}
                height={380}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <HugeiconsIcon icon={Camera01Icon} size={40} />
                <p className="text-xs">No hay imagen</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 p-4 sm:p-5 border-t border-border/40 bg-surface-container-lowest">
          <label
            className={cn(
              "flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors cursor-pointer text-sm font-medium",
              isUploading && "opacity-50 cursor-wait"
            )}
          >
            <HugeiconsIcon icon={Camera01Icon} size={16} />
            <span>{isUploading ? "Subiendo..." : "Nueva imagen"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="sr-only"
              disabled={isUploading}
            />
          </label>
          {avatar && (
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                "flex items-center gap-2 h-10 px-5 rounded-lg",
                "text-destructive border border-destructive/30 hover:bg-destructive/10",
                "transition-colors text-sm font-medium cursor-pointer"
              )}
            >
              <HugeiconsIcon icon={Delete01Icon} size={16} />
              <span>Eliminar</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
