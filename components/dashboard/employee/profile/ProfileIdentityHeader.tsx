"use client"

import {
  Calendar03Icon,
  Camera01Icon,
  Edit01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUploadAvatarMutation } from "@/lib/api/use-profile"
import { cn } from "@/lib/utils"
import { AvatarEditModal } from "./AvatarEditModal"
import { EMPTY_PLACEHOLDER, useProfileContext } from "./profile-context"

export function ProfileIdentityHeader() {
  const {
    user,
    userId,
    profileData,
    formData,
    errors,
    isSaving,
    isEditing,
    handleEditAll,
    handleInputChange,
    handleSaveAll,
    handleCancelEdit,
    handleAvatarDelete,
  } = useProfileContext()

  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  const uploadAvatarMutation = useUploadAvatarMutation(userId ?? "")

  const handleLocalUpload = useCallback(
    (file: File) => {
      if (file && userId) {
        uploadAvatarMutation.mutate(file, {
          onSuccess: () => setAvatarModalOpen(false),
        })
      }
    },
    [userId, uploadAvatarMutation]
  )

  const handleLocalDelete = useCallback(() => {
    handleAvatarDelete()
    setAvatarModalOpen(false)
  }, [handleAvatarDelete])

  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : null

  return (
    <header className="flex flex-col items-start gap-6 border-b border-border/40 pb-6 lg:flex-row lg:items-center lg:gap-6">
      <div className="relative mt-2 size-24 sm:size-28 shrink-0 self-center lg:mt-0 lg:self-auto">
        <div className="relative size-full overflow-hidden rounded-full border border-border/40 bg-surface-container-low">
          {profileData.avatar ? (
            <Image
              src={profileData.avatar}
              alt="Foto de perfil"
              width={112}
              height={112}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-surface-container-low text-muted-foreground">
              <HugeiconsIcon icon={Camera01Icon} size={28} strokeWidth={1.5} />
            </div>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              aria-label="Editar foto"
            >
              <HugeiconsIcon icon={Camera01Icon} size={24} className="text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full min-w-0 flex-1 self-center lg:w-auto lg:self-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          {isEditing ? (
            <div className="w-full max-w-sm space-y-1">
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nombre completo"
                className={cn(
                  "h-11 rounded-lg border-border/40 bg-surface-container-lowest text-base sm:text-lg font-bold text-foreground",
                  errors.name && "ring-destructive"
                )}
                aria-label="Nombre"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
          ) : (
            <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight lg:text-left">
              {profileData.name || EMPTY_PLACEHOLDER}
            </h1>
          )}
        </div>

        {isEditing ? (
          <div className="mx-auto mt-2 max-w-sm space-y-1 lg:mx-0">
            <Input
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
              placeholder="Profesión"
              className={cn(
                "h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm text-muted-foreground",
                errors.profession && "ring-destructive"
              )}
              aria-label="Profesión"
            />
            {errors.profession && <p className="text-xs text-destructive">{errors.profession}</p>}
          </div>
        ) : (
          <p className="mt-1 text-center text-sm text-muted-foreground lg:text-left">
            {profileData.profession || EMPTY_PLACEHOLDER}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground lg:justify-start">
          {profileData.location && (
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={1.7} />
              {profileData.location}
            </span>
          )}
          {memberSince != null && (
            <span className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar03Icon} size={14} strokeWidth={1.7} />
              Miembro desde {memberSince}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full items-center gap-2.5 lg:w-auto lg:shrink-0">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="h-9 px-4 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground flex-1 lg:flex-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium flex-1 lg:flex-none"
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={handleEditAll}
            className="h-9 px-4 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors flex-1 lg:flex-none"
          >
            <HugeiconsIcon icon={Edit01Icon} size={14} strokeWidth={1.5} />
            Editar perfil
          </Button>
        )}
      </div>

      <AvatarEditModal
        avatar={profileData.avatar}
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        onUpload={handleLocalUpload}
        onDelete={handleLocalDelete}
        isUploading={uploadAvatarMutation.isPending}
      />
    </header>
  )
}
