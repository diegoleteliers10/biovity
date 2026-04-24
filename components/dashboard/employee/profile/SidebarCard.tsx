"use client"

import {
  BirthdayCakeIcon,
  Building06Icon,
  Camera01Icon,
  FileAttachmentIcon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { DatePicker } from "@/components/common/DatePicker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUploadAvatarMutation, useUploadResumeCvMutation } from "@/lib/api/use-profile"
import { cn, dateToDateString, parseLocalDate } from "@/lib/utils"
import { EditableCard } from "./EditableCard"
import { EMPTY_PLACEHOLDER, useProfileContext } from "./profile-context"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

const InfoRow = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof UserIcon
  label: string
  value: React.ReactNode
  className?: string
}) => (
  <div className={cn("flex items-start gap-3 text-sm", className)}>
    <HugeiconsIcon
      icon={Icon}
      size={18}
      className="mt-0.5 shrink-0 text-muted-foreground"
      aria-hidden
    />
    <div className="min-w-0 flex-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-1.5 text-foreground">{value || EMPTY_PLACEHOLDER}</span>
    </div>
  </div>
)

export function SidebarCard() {
  const {
    user,
    resume,
    isSaving,
    editingSection,
    formData,
    errors,
    profileData,
    handleEditSection,
    handleInputChange,
    handleSaveSection,
    handleCancelSection,
    handleAvatarUpload,
    handleCvUpload,
    userId,
  } = useProfileContext()

  const uploadAvatarMutation = useUploadAvatarMutation(userId ?? "")
  const uploadCvMutation = useUploadResumeCvMutation(resume?.id ?? "", userId ?? "")

  const isEditingSidebar = editingSection === "sidebar"
  const data = profileData

  return (
    <EditableCard
      isEditing={isEditingSidebar}
      onEdit={() => handleEditSection("sidebar")}
      onSave={() => handleSaveSection("sidebar")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
      className="overflow-hidden"
    >
      <div className="relative pt-8 pb-6">
        <div
          className={cn(
            "relative mx-auto size-24 rounded-full overflow-hidden ring-2 ring-border bg-muted flex items-center justify-center"
          )}
        >
          {data.avatar ? (
            <Image
              src={data.avatar}
              alt=""
              width={96}
              height={96}
              className="size-24 object-cover"
              unoptimized
            />
          ) : (
            <HugeiconsIcon icon={UserIcon} size={40} className="text-muted-foreground" />
          )}
          {isEditingSidebar && (
            <label
              className={cn(
                "absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100",
                uploadAvatarMutation.isPending && "opacity-100 cursor-wait"
              )}
              aria-label="Cambiar foto"
            >
              {uploadAvatarMutation.isPending ? (
                <span className="text-white text-xs">Subiendo…</span>
              ) : (
                <HugeiconsIcon icon={Camera01Icon} size={24} className="text-white" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarUpload}
                className="sr-only"
                disabled={uploadAvatarMutation.isPending}
              />
            </label>
          )}
        </div>
        {uploadAvatarMutation.isError && (
          <p className="mt-2 text-center text-xs text-destructive px-6">
            {uploadAvatarMutation.error?.message}
          </p>
        )}
        <div className="mt-4 text-center px-6">
          {isEditingSidebar ? (
            <>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nombre completo"
                className={cn(
                  "text-center text-lg font-semibold h-auto py-2 border-0 bg-transparent focus-visible:ring-2",
                  errors.name && "ring-destructive"
                )}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              <Input
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                placeholder="Profesión"
                className={cn(
                  "text-center text-muted-foreground text-sm mt-1 h-auto py-1 border-0 bg-transparent",
                  errors.profession && "ring-destructive"
                )}
              />
              {errors.profession && (
                <p className="text-sm text-destructive mt-1">{errors.profession}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-foreground text-balance">
                {data.name || EMPTY_PLACEHOLDER}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {data.profession || EMPTY_PLACEHOLDER}
              </p>
              {user?.type && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {user.type === "professional" ? "Profesional" : user.type}
                </Badge>
              )}
            </>
          )}
        </div>
      </div>
      <CardContent className="space-y-4 pt-6">
        <InfoRow icon={Mail01Icon} label="Email" value={data.email} />
        <InfoRow
          icon={SmartPhone01Icon}
          label="Teléfono"
          value={
            isEditingSidebar ? (
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+56 9 1234 5678"
                className="h-8 w-full text-sm border-0 bg-muted/50 px-2 -ml-1.5"
              />
            ) : (
              data.phone
            )
          }
        />
        {user?.organization && (
          <InfoRow icon={Building06Icon} label="Organización" value={user.organization.name} />
        )}
        <InfoRow
          icon={Location01Icon}
          label="Ubicación"
          value={
            isEditingSidebar ? (
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Ciudad, País"
                className="h-8 w-full text-sm border-0 bg-muted/50 px-2 -ml-1.5"
              />
            ) : (
              data.location
            )
          }
        />
        <InfoRow
          icon={BirthdayCakeIcon}
          label="Cumpleaños"
          value={
            isEditingSidebar ? (
              <DatePicker
                date={formData.dateOfBirth ? parseLocalDate(formData.dateOfBirth) : undefined}
                setDate={(d) => handleInputChange("dateOfBirth", d ? dateToDateString(d) : "")}
                className="h-8 text-sm"
              />
            ) : data.dateOfBirth ? (
              format(parseLocalDate(data.dateOfBirth), "d MMMM yyyy", { locale: es })
            ) : (
              EMPTY_PLACEHOLDER
            )
          }
        />
        <InfoRow
          icon={FileAttachmentIcon}
          label="CV"
          value={
            isEditingSidebar && !resume?.id ? (
              <span className="text-muted-foreground text-sm">
                Guarda el perfil para poder subir tu CV
              </span>
            ) : isEditingSidebar && resume?.id ? (
              <div className="flex flex-col gap-1 min-w-0">
                {resume?.cvFile ? (
                  <a
                    href={resume.cvFile.url ?? `${API_BASE}/api/v1/resumes/${resume.id}/cv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {resume.cvFile.originalName ?? "Descargar"}
                  </a>
                ) : (
                  <span className="text-muted-foreground">No subido</span>
                )}
                <label className="text-xs text-primary hover:underline cursor-pointer">
                  {resume?.cvFile ? "Reemplazar CV" : "Subir CV"}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvUpload}
                    className="sr-only"
                    aria-label="Subir archivo CV"
                  />
                </label>
                {uploadCvMutation.isPending && (
                  <span className="text-xs text-muted-foreground">Subiendo…</span>
                )}
                {uploadCvMutation.isError && (
                  <span className="text-xs text-destructive">
                    {uploadCvMutation.error?.message ?? "Error al subir"}
                  </span>
                )}
              </div>
            ) : resume?.cvFile ? (
              <a
                href={resume.cvFile.url ?? `${API_BASE}/api/v1/resumes/${resume.id}/cv`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {resume.cvFile.originalName ?? "Descargar"}
              </a>
            ) : (
              <span className="text-muted-foreground">No subido</span>
            )
          }
        />
      </CardContent>
    </EditableCard>
  )
}
