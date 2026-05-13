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
/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
import dynamic from "next/dynamic"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { AvatarEditModal } from "@/components/dashboard/employee/profile/AvatarEditModal"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
// import { SubscriptionTab } from "@/components/dashboard/organization/SubscriptionTab"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OrganizationAddress } from "@/lib/api/organizations"
import { useOrganization, useUpdateOrganizationMutation } from "@/lib/api/use-organization"
import {
  locationToFormData,
  useDeleteAvatarMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUser,
} from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const SearchAddress = dynamic(
  () => import("@/components/ui/search-address").then((m) => m.SearchAddress),
  { ssr: false }
)

const EMPTY_PLACEHOLDER = "No especificado"

type SectionId = "sidebar" | "organization"

type UserFormData = {
  name: string
  email: string
  phone: string
  location: { street: string; city: string; country: string }
  profession: string
  avatar: string
}

type OrgFormData = {
  name: string
  website: string
  phone: string
  address: { street: string; city: string; country: string; state?: string; zipCode?: string }
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
      "group relative bg-white transition-all duration-200",
      "hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]",
      isEditing && "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]",
      className
    )}
  >
    {!isEditing && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-foreground hover:bg-transparent"
        onClick={onEdit}
        aria-label="Editar sección"
      >
        <HugeiconsIcon icon={Edit01Icon} size={16} strokeWidth={1.5} />
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

function addressToFormData(addr: OrganizationAddress | null | undefined): OrgFormData["address"] {
  if (!addr) return { street: "", city: "", country: "" }
  return {
    street: addr.street ?? "",
    city: addr.city ?? "",
    country: addr.country ?? "",
    state: addr.state,
    zipCode: addr.zipCode,
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
  const deleteAvatarMutation = useDeleteAvatarMutation(userId ?? "")

  // Hydration guard: skip SSR render of auth-dependent UI to prevent flash
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  const [editingSection, setEditingSection] = useState<SectionId | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  const [userForm, setUserForm] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    location: { street: "", city: "", country: "" },
    profession: "",
    avatar: "",
  })

  const [orgForm, setOrgForm] = useState<OrgFormData>({
    name: "",
    website: "",
    phone: "",
    address: { street: "", city: "", country: "" },
  })

  const profileData: UserFormData = {
    name: user?.name ?? session?.user?.name ?? "",
    email: user?.email ?? session?.user?.email ?? "",
    phone: user?.phone ?? "",
    location: user ? locationToFormData(user.location) : { street: "", city: "", country: "" },
    profession: user?.profession ?? "",
    avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
  }

  useEffect(() => {
    if (!editingSection && (user ?? session)) {
      setUserForm({
        name: user?.name ?? (session?.user?.name as string) ?? "",
        email: user?.email ?? (session?.user?.email as string) ?? "",
        phone: user?.phone ?? "",
        location: user ? locationToFormData(user.location) : { street: "", city: "", country: "" },
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
        address: addressToFormData(organization.address),
      })
    }
  }, [organization, editingSection])

  const syncFormForSection = useCallback(
    (_section: SectionId) => {
      setUserForm(profileData)
      if (organization) {
        setOrgForm({
          name: organization.name ?? "",
          website: organization.website ?? "",
          phone: organization.phone ?? "",
          address: addressToFormData(organization.address),
        })
      }
    },
    [organization, profileData]
  )

  const handleEditSection = useCallback(
    (section: SectionId) => {
      syncFormForSection(section)
      setEditingSection(section)
    },
    [syncFormForSection]
  )

  const handleInputChange = useCallback(
    (
      field: keyof UserFormData,
      value: string | { street: string; city: string; country: string }
    ) => {
      setUserForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev }
          delete next[field]
          return next
        }
        return prev
      })
    },
    []
  )

  const handleOrgInputChange = useCallback(
    (
      field: keyof OrgFormData,
      value: string | { street: string; city: string; country: string }
    ) => {
      setOrgForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleSaveSection = useCallback(
    async (section: SectionId) => {
      try {
        if (section === "sidebar") {
          const hasLocation =
            userForm.location.street || userForm.location.city || userForm.location.country
          await updateUserMutation.mutateAsync({
            name: userForm.name,
            profession: userForm.profession || undefined,
            phone: userForm.phone || undefined,
            avatar: userForm.avatar || undefined,
            location: hasLocation
              ? {
                  street: userForm.location.street || undefined,
                  city: userForm.location.city || undefined,
                  country: userForm.location.country || undefined,
                }
              : undefined,
          })
        } else {
          const hasAddress =
            orgForm.address.street || orgForm.address.city || orgForm.address.country
          await updateOrgMutation.mutateAsync({
            name: orgForm.name,
            website: orgForm.website || undefined,
            phone: orgForm.phone || undefined,
            address: hasAddress
              ? {
                  street: orgForm.address.street || undefined,
                  city: orgForm.address.city || undefined,
                  country: orgForm.address.country || undefined,
                  state: orgForm.address.state,
                  zipCode: orgForm.address.zipCode,
                }
              : undefined,
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
        address: addressToFormData(organization.address),
      })
    }
    setEditingSection(null)
    setErrors({})
  }, [organization, profileData])

  const handleAvatarUpload = useCallback(
    (file: File) => {
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
    },
    [userId, uploadAvatarMutation]
  )

  const handleAvatarDelete = useCallback(() => {
    if (!userId) return
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: () => {
        setUserForm((prev) => ({ ...prev, avatar: "" }))
      },
    })
  }, [userId, deleteAvatarMutation])

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
        <NotificationBell notifications={[]} showAgentTrigger />
      </div>

      <header>
        <div className="hidden lg:flex items-center justify-end mb-2">
          <NotificationBell notifications={[]} showAgentTrigger />
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
              <div className="relative mx-auto size-24">
                <div
                  className={cn(
                    "relative size-24 rounded-full overflow-hidden ring-2 ring-border bg-muted flex items-center justify-center"
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
              {uploadAvatarMutation.isError && (
                <p className="mt-2 text-center text-xs text-destructive px-6">
                  {uploadAvatarMutation.error?.message}
                </p>
              )}
              <AvatarEditModal
                avatar={data.avatar}
                open={avatarModalOpen}
                onOpenChange={setAvatarModalOpen}
                onUpload={handleAvatarUpload}
                onDelete={handleAvatarDelete}
                isUploading={uploadAvatarMutation.isPending}
              />
              <div className="mt-4 px-6">
                {isEditingSidebar ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="user-name"
                        className="text-left text-xs font-medium text-muted-foreground"
                      >
                        Nombre
                      </label>
                      <Input
                        id="user-name"
                        value={userForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nombre completo"
                        className={cn(errors.name && "ring-destructive")}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="user-profession"
                        className="text-left text-xs font-medium text-muted-foreground"
                      >
                        Cargo
                      </label>
                      <Input
                        id="user-profession"
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
                    <PhoneInput
                      value={userForm.phone}
                      onChange={(value) => handleInputChange("phone", value)}
                      placeholder="+56 9 1234 5678"
                      className="h-8 text-sm"
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
                    <SearchAddress
                      onSelectLocation={(parsed) => {
                        if (parsed) {
                          handleInputChange("location", {
                            street: parsed.street,
                            city: parsed.city,
                            country: parsed.country,
                          })
                        }
                      }}
                    />
                  ) : data.location.street || data.location.city ? (
                    <span>
                      {data.location.street && <span>{data.location.street}</span>}
                      {data.location.street && data.location.city && <span>, </span>}
                      {data.location.city && <span>{data.location.city}</span>}
                      {data.location.country && (
                        <span>
                          {data.location.street || data.location.city ? ", " : ""}
                          {data.location.country}
                        </span>
                      )}
                    </span>
                  ) : (
                    EMPTY_PLACEHOLDER
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
                                <label
                                  htmlFor="org-name"
                                  className="text-sm font-medium text-foreground"
                                >
                                  Nombre
                                </label>
                                <Input
                                  id="org-name"
                                  value={orgForm.name}
                                  onChange={(e) => handleOrgInputChange("name", e.target.value)}
                                  placeholder="Nombre de la organización"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label
                                  htmlFor="org-website"
                                  className="text-sm font-medium text-foreground"
                                >
                                  Sitio web
                                </label>
                                <Input
                                  id="org-website"
                                  value={orgForm.website}
                                  onChange={(e) => handleOrgInputChange("website", e.target.value)}
                                  placeholder="https://..."
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label
                                  htmlFor="org-phone"
                                  className="text-sm font-medium text-foreground"
                                >
                                  Teléfono
                                </label>
                                <PhoneInput
                                  id="org-phone"
                                  value={orgForm.phone}
                                  onChange={(value) => handleOrgInputChange("phone", value)}
                                  placeholder="+56 9 1234 5678"
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label
                                  htmlFor="user-location"
                                  className="text-sm font-medium text-foreground"
                                >
                                  Ubicacion
                                </label>
                                <SearchAddress
                                  onSelectLocation={(parsed) => {
                                    if (parsed) {
                                      handleInputChange("location", {
                                        street: parsed.street,
                                        city: parsed.city,
                                        country: parsed.country,
                                      })
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-1.5 sm:col-span-2">
                                <label
                                  htmlFor="org-address"
                                  className="text-sm font-medium text-foreground"
                                >
                                  Direccion de la organizacion
                                </label>
                                <SearchAddress
                                  onSelectLocation={(parsed) => {
                                    if (parsed) {
                                      handleOrgInputChange("address", {
                                        street: parsed.street,
                                        city: parsed.city,
                                        country: parsed.country,
                                      })
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                                  <SectionTitle icon={Building06Icon} title="Nombre" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {organization?.name || EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
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
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                                  <SectionTitle icon={SmartPhone01Icon} title="Teléfono" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {organization?.phone || EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-4 sm:col-span-2">
                                  <SectionTitle icon={MapPinIcon} title="Dirección" />
                                  <p className="mt-2 text-sm font-medium text-foreground">
                                    {formatAddress(organization?.address ?? null) ||
                                      EMPTY_PLACEHOLDER}
                                  </p>
                                </div>
                              </div>
                              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
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
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <HugeiconsIcon icon={CreditCardIcon} size={24} />
                    </EmptyMedia>
                    <EmptyTitle>Suscripción no disponible</EmptyTitle>
                    <EmptyDescription>
                      Aún no tienes una suscripción activa. Contáctanos para obtener más información
                      sobre nuestros planes.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
