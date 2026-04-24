"use client"

import {
  Building06Icon,
  Camera01Icon,
  Cancel01Icon,
  CreditCardIcon,
  Edit01Icon,
  FloppyDiskIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
  MapPinIcon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
// import { SubscriptionTab } from "@/components/dashboard/organization/SubscriptionTab"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type SectionId = "sidebar" | "organization"

type UserFormData = {
  name: string
  email: string
  phone: string
  location: string
  profession: string
  avatar: string
}

type OrgFormData = {
  name: string
  website: string
  phone: string
  address: string
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof UserIcon
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
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
}

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof Building06Icon
  title: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

const EditableCard = ({
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
}) => (
  <Card
    className={cn(
      "group relative bg-white border border-border/10 hover:bg-secondary/5 transition-colors duration-300",
      className
    )}
  >
    {!isEditing && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={onEdit}
        aria-label="Editar sección"
      >
        <HugeiconsIcon icon={Edit01Icon} size={18} />
      </Button>
    )}
    {children}
    {isEditing && (
      <div className="flex flex-wrap gap-3 justify-end px-6 pb-6 pt-0">
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
  const { data: session, isPending } = useSession()
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

  // Hydration guard: skip SSR render of auth-dependent UI to prevent flash
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  const [editingSection, setEditingSection] = useState<SectionId | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [userForm, setUserForm] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    avatar: "",
  })

  const [orgForm, setOrgForm] = useState<OrgFormData>({
    name: "",
    website: "",
    phone: "",
    address: "",
  })

  const profileData: UserFormData = {
    name: user?.name ?? session?.user?.name ?? "",
    email: user?.email ?? session?.user?.email ?? "",
    phone: user?.phone ?? "",
    location: user ? formatUserLocation(user.location) : "",
    profession: user?.profession ?? "",
    avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
  }

  useEffect(() => {
    if (!editingSection && (user ?? session)) {
      setUserForm({
        name: user?.name ?? (session?.user?.name as string) ?? "",
        email: user?.email ?? (session?.user?.email as string) ?? "",
        phone: user?.phone ?? "",
        location: user ? formatUserLocation(user.location) : "",
        profession: user?.profession ?? "",
        avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
      })
    }
  }, [user, session, editingSection])

  useEffect(() => {
    if (!editingSection && organization) {
      setOrgForm({
        name: organization.name ?? "",
        website: organization.website ?? "",
        phone: organization.phone ?? "",
        address: formatAddress(organization.address),
      })
    }
  }, [organization, editingSection])

  const syncFormForSection = useCallback(
    (section: SectionId) => {
      setUserForm(profileData)
      if (organization) {
        setOrgForm({
          name: organization.name ?? "",
          website: organization.website ?? "",
          phone: organization.phone ?? "",
          address: formatAddress(organization.address),
        })
      }
    },
    [profileData, organization]
  )

  const handleEditSection = useCallback(
    (section: SectionId) => {
      syncFormForSection(section)
      setEditingSection(section)
    },
    [syncFormForSection]
  )

  const handleInputChange = useCallback((field: keyof UserFormData, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev }
        delete next[field]
        return next
      }
      return prev
    })
  }, [])

  const handleOrgInputChange = useCallback((field: keyof OrgFormData, value: string) => {
    setOrgForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSaveSection = useCallback(
    async (section: SectionId) => {
      try {
        if (section === "sidebar") {
          await updateUserMutation.mutateAsync({
            name: userForm.name,
            profession: userForm.profession || undefined,
            phone: userForm.phone || undefined,
            avatar: userForm.avatar || undefined,
            location: userForm.location ? parseLocationString(userForm.location) : undefined,
          })
        } else {
          await updateOrgMutation.mutateAsync({
            name: orgForm.name,
            website: orgForm.website || undefined,
            phone: orgForm.phone || undefined,
            address: orgForm.address ? parseAddressString(orgForm.address) : undefined,
          })
        }
        setEditingSection(null)
        setErrors({})
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : "Error al guardar",
        })
      }
    },
    [userForm, orgForm, updateUserMutation, updateOrgMutation]
  )

  const handleCancelSection = useCallback(() => {
    setUserForm(profileData)
    if (organization) {
      setOrgForm({
        name: organization.name ?? "",
        website: organization.website ?? "",
        phone: organization.phone ?? "",
        address: formatAddress(organization.address),
      })
    }
    setEditingSection(null)
    setErrors({})
  }, [profileData, organization])

  const handleAvatarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && userId) {
        uploadAvatarMutation.mutate(file, {
          onSuccess: (updatedUser) => {
            if (updatedUser?.avatar) {
              setUserForm((prev) => ({
                ...prev,
                avatar: updatedUser.avatar ?? prev.avatar,
              }))
            }
          },
        })
      }
      event.target.value = ""
    },
    [userId, uploadAvatarMutation]
  )

  const isLoading = userLoading || orgLoading
  const isSaving = updateUserMutation.isPending || updateOrgMutation.isPending

  // Skip all auth-dependent rendering until client-side hydration is complete.
  // This prevents the flash of "Inicia sesión" on page reload when the session
  // cookie is present but the client hasn't rehydrated yet.
  if (!mounted.current) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (isPending) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (!userId && !session) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <p className="text-muted-foreground text-pretty">Inicia sesión para ver tu perfil.</p>
      </main>
    )
  }

  if (isLoading && !user) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (userError) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <p className="text-destructive text-pretty">
          {userError instanceof Error ? userError.message : "Error al cargar el perfil"}
        </p>
      </main>
    )
  }

  const isEditingSidebar = editingSection === "sidebar"
  const isEditingOrg = editingSection === "organization"
  const data = editingSection ? userForm : profileData

  return (
    <main className="flex flex-1 flex-col gap-8 p-6 md:p-8">
      {/* Top row: menu + notification on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <NotificationBell notifications={[]} />
      </div>

      <header>
        <div className="hidden lg:flex items-center justify-end mb-2">
          <NotificationBell notifications={[]} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona tu información personal y de la organización
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
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
              <div className="mt-4 px-6">
                {isEditingSidebar ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-left text-xs font-medium text-muted-foreground">
                        Nombre
                      </label>
                      <Input
                        value={userForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nombre completo"
                        className={cn(errors.name && "ring-destructive")}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-left text-xs font-medium text-muted-foreground">
                        Cargo
                      </label>
                      <Input
                        value={userForm.profession}
                        onChange={(e) => handleInputChange("profession", e.target.value)}
                        placeholder="Profesión"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground text-balance">
                      {data.name || EMPTY_PLACEHOLDER}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {data.profession || EMPTY_PLACEHOLDER}
                    </p>
                    {user?.type && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {user.type === "organization" ? "Organización" : user.type}
                      </Badge>
                    )}
                  </div>
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
                      value={userForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+56 9 1234 5678"
                      className="h-8 w-full text-sm border-0 bg-muted/50 px-2 -ml-1.5"
                    />
                  ) : (
                    data.phone || EMPTY_PLACEHOLDER
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
                  isEditingSidebar ? (
                    <Input
                      value={userForm.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Ciudad, País"
                      className="h-8 w-full text-sm border-0 bg-muted/50 px-2 -ml-1.5"
                    />
                  ) : (
                    data.location || EMPTY_PLACEHOLDER
                  )
                }
              />
            </CardContent>
          </EditableCard>
        </aside>

        <div className="min-w-0 space-y-6">
          {errors.general && (
            <p className="text-sm text-destructive text-pretty">{errors.general}</p>
          )}

          <div className="relative min-h-[120px]">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList variant="line" className="absolute z-20 bg-background px-1">
                <TabsTrigger value="profile" className="gap-2">
                  <HugeiconsIcon icon={Building06Icon} size={16} />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="subscription" className="gap-2">
                  <HugeiconsIcon icon={CreditCardIcon} size={16} />
                  Suscripción
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="w-full">
                <div className="pt-10 w-full">
                  <EditableCard
                    isEditing={isEditingOrg}
                    onEdit={() => handleEditSection("organization")}
                    onSave={() => handleSaveSection("organization")}
                    onCancel={handleCancelSection}
                    isSaving={isSaving}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <HugeiconsIcon icon={Building06Icon} size={18} />
                        Información de la organización
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                              No tienes una organización asociada. Completa tu perfil para vincular
                              una.
                            </p>
                          </div>
                        </div>
                      ) : orgError ? (
                        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">
                          {orgError.message}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {isEditingOrg ? (
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                  Nombre
                                </label>
                                <Input
                                  value={orgForm.name}
                                  onChange={(e) => handleOrgInputChange("name", e.target.value)}
                                  placeholder="Nombre de la organización"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                  Sitio web
                                </label>
                                <Input
                                  value={orgForm.website}
                                  onChange={(e) => handleOrgInputChange("website", e.target.value)}
                                  placeholder="https://..."
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                  Teléfono
                                </label>
                                <Input
                                  value={orgForm.phone}
                                  onChange={(e) => handleOrgInputChange("phone", e.target.value)}
                                  placeholder="+56 9 1234 5678"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-sm font-medium text-foreground">
                                  Dirección
                                </label>
                                <Input
                                  value={orgForm.address}
                                  onChange={(e) => handleOrgInputChange("address", e.target.value)}
                                  placeholder="Calle, Ciudad, Región, País, Código postal"
                                  className="h-10"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                                  <SectionTitle icon={Building06Icon} title="Nombre" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {organization?.name || EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                                  <SectionTitle icon={Globe02Icon} title="Sitio web" />
                                  {organization?.website ? (
                                    <a
                                      href={
                                        organization.website.startsWith("http")
                                          ? organization.website
                                          : `https://${organization.website}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 block text-sm text-primary hover:underline break-all"
                                    >
                                      {organization.website}
                                    </a>
                                  ) : (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {EMPTY_PLACEHOLDER}
                                    </p>
                                  )}
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                                  <SectionTitle icon={SmartPhone01Icon} title="Teléfono" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {organization?.phone || EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4 sm:col-span-2">
                                  <SectionTitle icon={MapPinIcon} title="Dirección" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {formatAddress(organization?.address ?? null) ||
                                      EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                                <SectionTitle icon={CreditCardIcon} title="ID de Suscripción" />
                                <p className="mt-2 text-sm font-medium text-foreground">
                                  {organization?.subscriptionId ? (
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                      {organization.subscriptionId}
                                    </code>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      {EMPTY_PLACEHOLDER}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </EditableCard>
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="w-full pt-10">
                {/*(<SubscriptionTab organizationId={organizationId ?? ""} />*/}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
