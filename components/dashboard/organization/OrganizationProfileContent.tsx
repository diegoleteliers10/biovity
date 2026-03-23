"use client"

import {
  Building06Icon,
  Camera01Icon,
  Cancel01Icon,
  Edit01Icon,
  FloppyDiskIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { OrganizationAddress } from "@/lib/api/organizations"
import { useOrganization, useUpdateOrganizationMutation } from "@/lib/api/use-organization"
import {
  formatUserLocation,
  parseLocationString,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUser,
} from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const EMPTY_PLACEHOLDER = "No especificado"

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
  variant = "inline",
}: {
  icon: typeof UserIcon
  label: string
  value: React.ReactNode
  className?: string
  variant?: "inline" | "stack"
}) {
  return (
    <div className={cn("flex items-start gap-3 text-sm", className)}>
      <HugeiconsIcon
        icon={Icon}
        size={18}
        className="mt-0.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      {variant === "stack" ? (
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <div className="font-medium text-foreground text-sm">{value || EMPTY_PLACEHOLDER}</div>
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <span className="text-muted-foreground">{label}</span>
          <span className="ml-1.5 text-foreground">{value || EMPTY_PLACEHOLDER}</span>
        </div>
      )}
    </div>
  )
}

function EditableCard({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isSaving,
  children,
  className,
}: {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn("group relative", className)}>
      {!isEditing && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onEdit}
          aria-label="Editar sección"
        >
          <HugeiconsIcon icon={Edit01Icon} size={18} />
        </Button>
      )}
      {children}
      {isEditing && (
        <div className="flex flex-wrap justify-end gap-3 px-6 pb-6 pt-0">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      )}
    </Card>
  )
}

function formatAddress(addr: OrganizationAddress | null | undefined): string {
  if (!addr) return ""
  const parts = [addr.street, addr.city, addr.state, addr.country, addr.zipCode].filter(Boolean)
  return parts.join(", ")
}

function parseAddressString(value: string): OrganizationAddress {
  const parts = value.split(",").map((s) => s.trim())
  return {
    street: parts[0] || undefined,
    city: parts[1] || undefined,
    state: parts[2] || undefined,
    country: parts[3] || undefined,
    zipCode: parts[4] || undefined,
  }
}

export function OrganizationProfileContent() {
  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const userId = (session?.user as { id?: string })?.id
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

  const { data: user, isLoading: userLoading, error: userError } = useUser(userId)
  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganization(organizationId)

  const updateUserMutation = useUpdateUserMutation(userId ?? "")
  const updateOrgMutation = useUpdateOrganizationMutation(organizationId ?? "")
  const uploadAvatarMutation = useUploadAvatarMutation(userId ?? "")

  const [editingSidebar, setEditingSidebar] = useState(false)
  const [editingOrg, setEditingOrg] = useState(false)

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    avatar: "",
  })

  const [orgForm, setOrgForm] = useState({
    name: "",
    website: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (user && !editingSidebar) {
      setUserForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        location: formatUserLocation(user.location),
        profession: user.profession ?? "",
        avatar: user.avatar ?? "",
      })
    }
  }, [user, editingSidebar])

  useEffect(() => {
    if (organization && !editingOrg) {
      setOrgForm({
        name: organization.name ?? "",
        website: organization.website ?? "",
        phone: organization.phone ?? "",
        address: formatAddress(organization.address),
      })
    }
  }, [organization, editingOrg])

  const handleSaveSidebar = useCallback(async () => {
    if (!userId) return
    try {
      await updateUserMutation.mutateAsync({
        name: userForm.name,
        profession: userForm.profession || undefined,
        phone: userForm.phone || undefined,
        avatar: userForm.avatar || undefined,
        location: userForm.location ? parseLocationString(userForm.location) : undefined,
      })
      setEditingSidebar(false)
    } catch (err) {
      console.error(err)
    }
  }, [userId, userForm, updateUserMutation])

  const handleSaveOrg = useCallback(async () => {
    if (!organizationId) return
    try {
      await updateOrgMutation.mutateAsync({
        name: orgForm.name,
        website: orgForm.website || undefined,
        phone: orgForm.phone || undefined,
        address: orgForm.address ? parseAddressString(orgForm.address) : undefined,
      })
      setEditingOrg(false)
    } catch (err) {
      console.error(err)
    }
  }, [organizationId, orgForm, updateOrgMutation])

  const handleCancelSidebar = useCallback(() => {
    if (user) {
      setUserForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        location: formatUserLocation(user.location),
        profession: user.profession ?? "",
        avatar: user.avatar ?? "",
      })
    }
    setEditingSidebar(false)
  }, [user])

  const handleCancelOrg = useCallback(() => {
    if (organization) {
      setOrgForm({
        name: organization.name ?? "",
        website: organization.website ?? "",
        phone: organization.phone ?? "",
        address: formatAddress(organization.address),
      })
    }
    setEditingOrg(false)
  }, [organization])

  const handleAvatarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && userId) {
        uploadAvatarMutation.mutate(file, {
          onSuccess: (updatedUser) => {
            if (updatedUser?.avatar) {
              setUserForm((prev) => ({ ...prev, avatar: updatedUser.avatar ?? prev.avatar }))
            }
          },
        })
      }
      event.target.value = ""
    },
    [userId, uploadAvatarMutation]
  )

  const isLoading = sessionPending || userLoading || orgLoading
  const isSaving = updateUserMutation.isPending || updateOrgMutation.isPending
  const sidebarData = editingSidebar ? userForm : user

  if (sessionPending) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <header>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted/70" />
        </header>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground text-balance md:text-3xl">Mi Perfil</h1>
          <p className="text-muted-foreground text-pretty text-sm mt-1">
            Inicia sesión para ver tu perfil.
          </p>
        </header>
      </div>
    )
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?"

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground text-balance md:text-3xl">Mi Perfil</h1>
        <p className="text-muted-foreground text-pretty text-sm mt-1">
          Gestiona tu información personal y de la organización
        </p>
      </header>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <EditableCard
            isEditing={editingSidebar}
            onEdit={() => setEditingSidebar(true)}
            onSave={handleSaveSidebar}
            onCancel={handleCancelSidebar}
            isSaving={isSaving}
            className="overflow-hidden"
          >
            <div className="relative pt-8 pb-6">
              <div
                className={cn(
                  "relative mx-auto flex size-24 overflow-hidden rounded-full bg-muted ring-2 ring-border",
                  editingSidebar && "ring-primary/20"
                )}
              >
                {sidebarData?.avatar ? (
                  <Image
                    src={sidebarData.avatar}
                    alt=""
                    width={96}
                    height={96}
                    className="size-24 object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <HugeiconsIcon icon={UserIcon} size={40} className="text-muted-foreground" />
                  </div>
                )}
                {editingSidebar && (
                  <label
                    className={cn(
                      "absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100",
                      uploadAvatarMutation.isPending && "cursor-wait opacity-100"
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
                <p className="mt-2 px-6 text-center text-destructive text-xs">
                  {uploadAvatarMutation.error?.message}
                </p>
              )}
              <div className="mt-4 px-6 text-center">
                {editingSidebar ? (
                  <>
                    <Input
                      value={userForm.name}
                      onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Nombre completo"
                      className="h-auto border-0 bg-transparent py-2 text-center text-lg font-semibold focus-visible:ring-2"
                    />
                    <Input
                      value={userForm.profession}
                      onChange={(e) => setUserForm((p) => ({ ...p, profession: e.target.value }))}
                      placeholder="Profesión"
                      className="mt-1 h-auto border-0 bg-transparent py-1 text-center text-muted-foreground text-sm"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-balance text-lg font-semibold text-foreground">
                      {sidebarData?.name || EMPTY_PLACEHOLDER}
                    </p>
                    <p className="mt-0.5 text-muted-foreground text-sm">
                      {sidebarData?.profession || EMPTY_PLACEHOLDER}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Organización
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <CardContent className="space-y-4 pt-6">
              <InfoRow icon={Mail01Icon} label="Email" value={sidebarData?.email} />
              <InfoRow
                icon={SmartPhone01Icon}
                label="Teléfono"
                value={
                  editingSidebar ? (
                    <Input
                      value={userForm.phone}
                      onChange={(e) => setUserForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+56 9 1234 5678"
                      className="-ml-1.5 h-8 w-full border-0 bg-muted/50 px-2 text-sm"
                    />
                  ) : (
                    sidebarData?.phone
                  )
                }
              />
              {organization?.name && (
                <InfoRow icon={Building06Icon} label="Organización" value={organization.name} />
              )}
              <InfoRow
                icon={Location01Icon}
                label="Ubicación"
                value={
                  editingSidebar ? (
                    <Input
                      value={userForm.location}
                      onChange={(e) => setUserForm((p) => ({ ...p, location: e.target.value }))}
                      placeholder="Ciudad, País"
                      className="-ml-1.5 h-8 w-full border-0 bg-muted/50 px-2 text-sm"
                    />
                  ) : (
                    formatUserLocation(user?.location ?? null)
                  )
                }
              />
            </CardContent>
          </EditableCard>
        </aside>

        <div className="min-w-0 flex-1">
          <Card className="flex h-full min-h-0 flex-col overflow-hidden border shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/20 px-6 py-5">
              <div>
                <CardTitle className="text-lg font-semibold text-balance">
                  Información de la organización
                </CardTitle>
                <CardDescription className="mt-1 text-pretty">
                  Datos de tu empresa u organización.
                </CardDescription>
              </div>
              {!editingOrg && organizationId && (
                <CardAction>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setEditingOrg(true)}
                    aria-label="Editar organización"
                  >
                    <HugeiconsIcon icon={Edit01Icon} size={14} />
                    Editar
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {!organizationId ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted ring-2 ring-border/60">
                    <HugeiconsIcon
                      icon={Building06Icon}
                      size={32}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-1 px-4">
                    <p className="font-medium text-foreground">Sin organización</p>
                    <p className="text-muted-foreground text-pretty text-sm max-w-sm">
                      No tienes una organización asociada. Completa tu perfil para vincular una.
                    </p>
                  </div>
                </div>
              ) : orgError ? (
                <p className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">
                  {orgError.message}
                </p>
              ) : editingOrg ? (
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Nombre</FieldLabel>
                      <Input
                        value={orgForm.name}
                        onChange={(e) => setOrgForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Nombre de la organización"
                        className="h-10"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Sitio web</FieldLabel>
                      <Input
                        value={orgForm.website}
                        onChange={(e) => setOrgForm((p) => ({ ...p, website: e.target.value }))}
                        placeholder="https://..."
                        className="h-10"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Teléfono</FieldLabel>
                      <Input
                        value={orgForm.phone}
                        onChange={(e) => setOrgForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+56 9 1234 5678"
                        className="h-10"
                      />
                    </Field>
                    <Field className="sm:col-span-2">
                      <FieldLabel>Dirección</FieldLabel>
                      <Input
                        value={orgForm.address}
                        onChange={(e) => setOrgForm((p) => ({ ...p, address: e.target.value }))}
                        placeholder="Calle, Ciudad, Región, País, Código postal"
                        className="h-10"
                      />
                    </Field>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelOrg}
                      disabled={updateOrgMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveOrg}
                      disabled={updateOrgMutation.isPending}
                    >
                      {updateOrgMutation.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                    <InfoRow
                      icon={Building06Icon}
                      label="Nombre"
                      value={organization?.name}
                      variant="stack"
                    />
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                    <InfoRow
                      icon={Globe02Icon}
                      label="Sitio web"
                      value={
                        organization?.website ? (
                          <a
                            href={
                              organization.website.startsWith("http")
                                ? organization.website
                                : `https://${organization.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {organization.website}
                          </a>
                        ) : undefined
                      }
                      variant="stack"
                    />
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                    <InfoRow
                      icon={SmartPhone01Icon}
                      label="Teléfono"
                      value={organization?.phone}
                      variant="stack"
                    />
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4 sm:col-span-2">
                    <InfoRow
                      icon={Location01Icon}
                      label="Dirección"
                      value={formatAddress(organization?.address ?? null)}
                      variant="stack"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
