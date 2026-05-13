"use client"

import { Camera01Icon, Delete01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useState } from "react"
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
        setTimeout(() => {
          setLocalPreview(null)
          onOpenChange(false)
        }, 500)
      }
      e.target.value = ""
    },
    [onUpload, onOpenChange]
  )

  const handleDelete = useCallback(() => {
    onDelete()
    onOpenChange(false)
  }, [onDelete, onOpenChange])

  const displayAvatar = localPreview || avatar

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Editar foto de perfil</DialogTitle>
        <div className="relative">
          <div
            className={cn(
              "relative w-full aspect-square bg-muted flex items-center justify-center overflow-hidden",
              "max-h-[400px]"
            )}
          >
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar preview"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <HugeiconsIcon icon={Camera01Icon} size={48} />
                <p className="text-sm">No hay imagen</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 p-6 border-t border-border">
          <label
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors cursor-pointer",
              isUploading && "opacity-50 cursor-wait"
            )}
          >
            <HugeiconsIcon icon={Camera01Icon} size={18} />
            <span className="text-sm font-medium">
              {isUploading ? "Subiendo..." : "Nueva imagen"}
            </span>
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
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "text-destructive border border-destructive/30",
                "hover:bg-destructive/10 transition-colors"
              )}
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} />
              <span className="text-sm font-medium">Eliminar</span>
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
