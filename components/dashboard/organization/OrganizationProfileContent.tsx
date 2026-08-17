"use client"

import {
  Add01Icon,
  AlertDiamondIcon,
  ArrowRight01Icon,
  Brain03Icon,
  Building06Icon,
  Calendar03Icon,
  Camera01Icon,
  CreditCardIcon,
  Edit01Icon,
  File01Icon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
  Notification01Icon,
  Settings01Icon,
  SmartPhone01Icon,
  Task01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { AvatarEditModal } from "@/components/dashboard/employee/profile/AvatarEditModal"
import { BrandingTab } from "@/components/dashboard/organization/BrandingTab"
import { DangerZoneTab } from "@/components/dashboard/organization/DangerZoneTab"
import { OrganizationOffersTimeline } from "@/components/dashboard/organization/OrganizationOffersTimeline"
import { SubscriptionTab } from "@/components/dashboard/organization/SubscriptionTab"
import { TeamManagementTab } from "@/components/dashboard/organization/TeamManagementTab"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMountEffect } from "@/hooks/use-mount-effect"
import type { OrganizationAddress } from "@/lib/api/organizations"
import { useOrganization, useUpdateOrganizationMutation } from "@/lib/api/use-organization"
import {
  locationToFormData,
  parseLocationString,
  useDeleteAvatarMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUser,
} from "@/lib/api/use-profile"
import { cn, formatDateChilean } from "@/lib/utils"
import { useDashboardSession } from "../DashboardSessionContext"
import { AiSettingsTab } from "./AiSettingsTab"
import { NotificationPreferencesTab } from "./NotificationPreferencesTab"
import { OrganizationActivityTab } from "./OrganizationActivityTab"
import { OrganizationNotificationsTab } from "./OrganizationNotificationsTab"

const SearchAddress = dynamic(
  () => import("@/components/ui/search-address").then((m) => m.SearchAddress),
  { ssr: false }
)

const EMPTY_PLACEHOLDER = "No especificado"

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
  address: { street: string; city: string; country: string; state?: string; zipCode?: string }
}

const SECTION_LABEL_CLASS = "text-xs font-semibold tracking-[0.08em] text-foreground uppercase"

function PanelSection({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className={SECTION_LABEL_CLASS}>{label}</h2>
      {description && (
        <p className="max-w-[60ch] text-sm leading-6 text-muted-foreground text-pretty">
          {description}
        </p>
      )}
      <div>{children}</div>
    </section>
  )
}

function AsideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-[var(--surface-container-low)] p-6">
      <h2 className={SECTION_LABEL_CLASS}>{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const ContactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail01Icon
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-center gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-secondary">
      <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.5} aria-hidden />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  </div>
)

const OrgField = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="min-w-0">
    <p className="text-xs leading-4 font-medium text-muted-foreground">{label}</p>
    <div className="mt-1 text-sm leading-6 break-words text-foreground">{value}</div>
  </div>
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

const pillTabClass = cn(
  "h-auto flex-none cursor-pointer gap-2 rounded-full border-transparent px-3.5 py-2 text-[13.5px] leading-4",
  "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
  "data-[state=active]:rounded-full data-[state=active]:border-transparent data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground data-[state=active]:hover:bg-primary data-[state=active]:hover:text-primary-foreground"
)

const dangerTabClass = cn(
  pillTabClass,
  "text-destructive hover:bg-destructive/10 hover:text-destructive",
  "data-[state=active]:bg-destructive data-[state=active]:text-white data-[state=active]:hover:bg-destructive data-[state=active]:hover:text-white"
)

function ProfileSkeleton() {
  return (
    <div className="space-y-7">
      <div className="flex items-center gap-7 pb-7">
        <div className="size-[108px] shrink-0 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-56 rounded bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
          <div className="h-3 w-64 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-8 w-full rounded-full bg-muted animate-pulse" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <div className="h-24 bg-muted animate-pulse rounded-2xl" />
          <div className="h-48 bg-muted animate-pulse rounded-2xl" />
        </div>
        <div className="space-y-5">
          <div className="h-32 bg-muted animate-pulse rounded-2xl" />
          <div className="h-48 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function OrganizationProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "profile"

  const handleTabChange = useCallback(
    (value: string) => {
      router.push(`/dashboard/profile?tab=${value}`, { scroll: false })
    },
    [router]
  )

  const session = useDashboardSession()
  const userId = session?.user?.id ?? undefined
  const organizationId = session?.user?.organizationId ?? undefined

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

  const [mounted, setMounted] = useState(false)
  useMountEffect(() => {
    setMounted(true)
  })

  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

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
    address: { street: "", city: "", country: "" },
  })

  const profileData: UserFormData = {
    name: user?.name ?? session?.user?.name ?? "",
    email: user?.email ?? session?.user?.email ?? "",
    phone: user?.phone ?? "",
    location: user ? locationToFormData(user.location) : "",
    profession: user?.profession ?? "",
    avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
  }

  const syncForms = useCallback(() => {
    setUserForm({
      name: user?.name ?? session?.user?.name ?? "",
      email: user?.email ?? session?.user?.email ?? "",
      phone: user?.phone ?? "",
      location: user ? locationToFormData(user.location) : "",
      profession: user?.profession ?? "",
      avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
    })
    if (organization) {
      setOrgForm({
        name: organization.name ?? "",
        website: organization.website ?? "",
        phone: organization.phone ?? "",
        address: addressToFormData(organization.address),
      })
    }
  }, [user, session, organization])

  const handleEditAll = useCallback(() => {
    syncForms()
    setErrors({})
    setIsEditing(true)
  }, [syncForms])

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

  const handleOrgInputChange = useCallback(
    (
      field: keyof OrgFormData,
      value:
        | string
        | { street: string; city: string; country: string; state?: string; zipCode?: string }
    ) => {
      setOrgForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleSaveAll = useCallback(async () => {
    try {
      const location = parseLocationString(userForm.location)
      const hasLocation = location.city || location.country
      await updateUserMutation.mutateAsync({
        name: userForm.name,
        profession: userForm.profession || undefined,
        phone: userForm.phone || undefined,
        avatar: userForm.avatar || undefined,
        location: hasLocation ? location : undefined,
      })
      const hasAddress = orgForm.address.street || orgForm.address.city || orgForm.address.country
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
      setIsEditing(false)
      setErrors({})
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Error al guardar",
      })
    }
  }, [userForm, orgForm, updateUserMutation, updateOrgMutation])

  const handleCancelEdit = useCallback(() => {
    syncForms()
    setErrors({})
    setIsEditing(false)
  }, [syncForms])

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
            setAvatarModalOpen(false)
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

  const memberSinceDate = organization?.createdAt ?? user?.createdAt
  const memberSince = memberSinceDate ? formatDateChilean(memberSinceDate, "MMM yyyy") : null

  const data = isEditing ? userForm : profileData

  const websiteUrl = organization?.website
    ? organization.website.startsWith("http")
      ? organization.website
      : `https://${organization.website}`
    : null

  if (!mounted) {
    return (
      <main className="p-6 lg:px-12 lg:py-8">
        <div className="mx-auto w-full max-w-[1020px]">
          <ProfileSkeleton />
        </div>
      </main>
    )
  }

  if (!userId && !session) {
    return (
      <main className="p-6 lg:px-12 lg:py-8">
        <p className="text-muted-foreground text-pretty">Inicia sesión para ver tu perfil.</p>
      </main>
    )
  }

  if (isLoading && !user) {
    return (
      <main className="p-6 lg:px-12 lg:py-8">
        <div className="mx-auto w-full max-w-[1020px]">
          <ProfileSkeleton />
        </div>
      </main>
    )
  }

  if (userError) {
    return (
      <main className="p-6 lg:px-12 lg:py-8">
        <p className="text-destructive text-pretty">
          {userError instanceof Error ? userError.message : "Error al cargar el perfil"}
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 lg:px-12 lg:py-8">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="flex items-center justify-between lg:hidden">
          <MobileMenuButton />
          <ConnectedNotificationBell showAgentTrigger />
        </div>
        <div className="mb-2 hidden justify-end lg:flex">
          <ConnectedNotificationBell showAgentTrigger />
        </div>

        <header className="flex flex-col items-start gap-7 border-b border-border pb-7 lg:flex-row lg:items-start lg:gap-7">
          <div className="relative mt-2 size-[108px] shrink-0 self-center lg:mt-0 lg:self-auto">
            <div className="relative size-full overflow-hidden rounded-full border border-border bg-muted">
              {data.avatar ? (
                <Image
                  src={data.avatar}
                  alt="Foto de perfil"
                  width={108}
                  height={108}
                  className="size-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-secondary/5 text-secondary">
                  <HugeiconsIcon icon={UserIcon} size={32} strokeWidth={1.5} />
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

          <div className="w-full min-w-0 flex-1 self-center lg:self-auto">
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {isEditing ? (
                <div className="w-full max-w-sm space-y-1">
                  <Input
                    value={userForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nombre completo"
                    className={cn(
                      "h-auto py-2 text-2xl font-semibold",
                      errors.name && "ring-destructive"
                    )}
                    aria-label="Nombre"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              ) : (
                <h1 className="text-center text-[28px] leading-tight font-semibold tracking-[-0.01em] text-foreground lg:text-left">
                  {data.name || EMPTY_PLACEHOLDER}
                </h1>
              )}
            </div>

            {isEditing ? (
              <div className="mx-auto mt-2 max-w-sm space-y-1 lg:mx-0">
                <Input
                  value={userForm.profession}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                  placeholder="Cargo"
                  className={cn(
                    "h-auto py-1.5 text-muted-foreground",
                    errors.profession && "ring-destructive"
                  )}
                  aria-label="Cargo"
                />
                {errors.profession && (
                  <p className="text-xs text-destructive">{errors.profession}</p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-center text-[15px] text-muted-foreground lg:text-left">
                {data.profession || EMPTY_PLACEHOLDER}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground lg:justify-start">
              {organization?.name && (
                <button
                  type="button"
                  onClick={() => handleTabChange("branding")}
                  title="Ver branding de la organización"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-[var(--surface-container-low)] py-1 pr-3 pl-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-background"
                >
                  <span className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-md bg-[var(--surface-container-low)] text-[11px] font-semibold text-muted-foreground">
                    {organization.logo ? (
                      <Image
                        src={organization.logo}
                        alt={organization.name}
                        width={20}
                        height={20}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      organization.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  {organization.name}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={12}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />
                </button>
              )}
              {memberSince && (
                <span className="inline-flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar03Icon} size={14} strokeWidth={1.7} />
                  Miembro desde {memberSince}
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-2.5 lg:w-auto lg:shrink-0 lg:pt-1">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 lg:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="flex-1 lg:flex-none"
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/dashboard/ofertas")}
                  className="flex-1 lg:flex-none"
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.8} />
                  Publicar oferta
                </Button>
                <Button variant="outline" onClick={handleEditAll} className="flex-1 lg:flex-none">
                  <HugeiconsIcon icon={Edit01Icon} size={16} strokeWidth={1.5} />
                  Editar perfil
                </Button>
              </>
            )}
          </div>

          <AvatarEditModal
            avatar={data.avatar}
            open={avatarModalOpen}
            onOpenChange={setAvatarModalOpen}
            onUpload={handleAvatarUpload}
            onDelete={handleAvatarDelete}
            isUploading={uploadAvatarMutation.isPending}
          />
        </header>

        {errors.general && (
          <p className="mt-6 text-sm text-destructive text-pretty">{errors.general}</p>
        )}

        <Tabs value={tab} onValueChange={handleTabChange} className="mt-7 w-full flex-col">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="profile" className={pillTabClass}>
              <HugeiconsIcon icon={File01Icon} size={14} strokeWidth={1.7} />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="subscription" className={pillTabClass}>
              <HugeiconsIcon icon={CreditCardIcon} size={14} strokeWidth={1.7} />
              Suscripción
            </TabsTrigger>
            <TabsTrigger value="ai" className={pillTabClass}>
              <HugeiconsIcon icon={Brain03Icon} size={14} strokeWidth={1.7} />
              IA
            </TabsTrigger>
            <TabsTrigger value="notifications" className={pillTabClass}>
              <HugeiconsIcon icon={Notification01Icon} size={14} strokeWidth={1.7} />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="preferences" className={pillTabClass}>
              <HugeiconsIcon icon={Settings01Icon} size={14} strokeWidth={1.7} />
              Preferencias
            </TabsTrigger>
            <TabsTrigger value="activity" className={pillTabClass}>
              <HugeiconsIcon icon={Task01Icon} size={14} strokeWidth={1.7} />
              Actividad
            </TabsTrigger>
            <TabsTrigger value="branding" className={pillTabClass}>
              <HugeiconsIcon icon={Building06Icon} size={14} strokeWidth={1.7} />
              Branding
            </TabsTrigger>
            <TabsTrigger value="team" className={pillTabClass}>
              <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.7} />
              Equipo
            </TabsTrigger>
            <TabsTrigger value="danger" className={dangerTabClass}>
              <HugeiconsIcon icon={AlertDiamondIcon} size={14} strokeWidth={1.7} />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 space-y-10">
                <section className="space-y-4">
                  <h2 className={SECTION_LABEL_CLASS}>Sobre la organización</h2>
                  <p className="max-w-[62ch] text-base leading-7 text-foreground text-pretty">
                    {organization?.description ||
                      "Sin descripción. Agrégala desde la pestaña Branding."}
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className={SECTION_LABEL_CLASS}>Información de la organización</h2>
                  {!organizationId ? (
                    <p className="text-sm text-muted-foreground text-pretty">
                      No tienes una organización asociada.
                    </p>
                  ) : orgError ? (
                    <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {orgError.message}
                    </p>
                  ) : isEditing ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="org-name" className="text-xs leading-4 font-medium">
                          Nombre
                        </label>
                        <Input
                          id="org-name"
                          value={orgForm.name}
                          onChange={(e) => handleOrgInputChange("name", e.target.value)}
                          placeholder="Nombre de la organización"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="org-website" className="text-xs leading-4 font-medium">
                          Sitio web
                        </label>
                        <Input
                          id="org-website"
                          value={orgForm.website}
                          onChange={(e) => handleOrgInputChange("website", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="org-phone" className="text-xs leading-4 font-medium">
                          Teléfono
                        </label>
                        <PhoneInput
                          id="org-phone"
                          value={orgForm.phone}
                          onChange={(value) => handleOrgInputChange("phone", value)}
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="org-address" className="text-xs leading-4 font-medium">
                          Dirección de la organización
                        </label>
                        <SearchAddress
                          onSelectLocation={(parsed) => {
                            if (parsed) {
                              handleOrgInputChange("address", {
                                street: parsed.street,
                                city: parsed.city,
                                state: parsed.state,
                                country: parsed.country,
                                zipCode: parsed.zipCode,
                              })
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                      <OrgField label="Nombre" value={organization?.name || EMPTY_PLACEHOLDER} />
                      <OrgField
                        label="Sitio web"
                        value={
                          websiteUrl ? (
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {organization?.website}
                            </a>
                          ) : (
                            EMPTY_PLACEHOLDER
                          )
                        }
                      />
                      <OrgField label="Teléfono" value={organization?.phone || EMPTY_PLACEHOLDER} />
                      <OrgField
                        label="Dirección"
                        value={formatAddress(organization?.address ?? null) || EMPTY_PLACEHOLDER}
                      />
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <h2 className={SECTION_LABEL_CLASS}>Ofertas publicadas</h2>
                  {organizationId ? (
                    <OrganizationOffersTimeline organizationId={organizationId} />
                  ) : (
                    <p className="text-sm text-muted-foreground text-pretty">
                      Publica ofertas para verlas aquí.
                    </p>
                  )}
                </section>
              </div>

              <aside className="space-y-5 self-start lg:sticky lg:top-8">
                <AsideCard title="Contacto">
                  <div className="space-y-4">
                    <ContactRow
                      icon={Mail01Icon}
                      label="Correo"
                      value={
                        <a
                          href={`mailto:${data.email}`}
                          className="break-all text-primary hover:underline"
                        >
                          {data.email || EMPTY_PLACEHOLDER}
                        </a>
                      }
                    />
                    <ContactRow
                      icon={SmartPhone01Icon}
                      label="Teléfono"
                      value={
                        isEditing ? (
                          <PhoneInput
                            value={userForm.phone}
                            onChange={(value) => handleInputChange("phone", value)}
                            placeholder="+56 9 1234 5678"
                            className="h-7"
                          />
                        ) : (
                          <span className="block truncate">{data.phone || EMPTY_PLACEHOLDER}</span>
                        )
                      }
                    />
                    <ContactRow
                      icon={Location01Icon}
                      label="Ubicación"
                      value={
                        isEditing ? (
                          <Input
                            value={userForm.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="Ciudad, País"
                            className="h-7"
                          />
                        ) : (
                          <span className="block truncate">
                            {data.location || EMPTY_PLACEHOLDER}
                          </span>
                        )
                      }
                    />
                  </div>
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 flex w-full items-center gap-2.5 rounded-lg border border-border bg-white p-3 transition-colors hover:bg-[var(--surface-container-low)]"
                    >
                      <HugeiconsIcon
                        icon={Globe02Icon}
                        size={18}
                        strokeWidth={1.7}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0 text-left">
                        <span className="block truncate text-[12.5px] leading-4 text-foreground">
                          {organization?.website}
                        </span>
                        <span className="block text-[11px] leading-4 text-muted-foreground">
                          Visitar sitio
                        </span>
                      </span>
                    </a>
                  )}
                </AsideCard>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Plan y suscripción"
                description="Gestiona el plan de suscripción de tu organización."
              >
                <SubscriptionTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Configuración de IA"
                description="Administra las credenciales de proveedores de IA para esta organización. Solo puede haber una credencial activa a la vez."
              >
                <AiSettingsTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="mt-8">
            {userId ? (
              <PanelSection
                label="Notificaciones"
                description="Configura cómo tu organización recibe alertas y webhooks."
              >
                <OrganizationNotificationsTab userId={userId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes un usuario asociado.
              </p>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="mt-8">
            {userId ? (
              <PanelSection
                label="Preferencias de notificación"
                description="Configura cuándo y cómo quieres recibir notificaciones en la plataforma."
              >
                <NotificationPreferencesTab userId={userId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes un usuario asociado.
              </p>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Registro de actividad"
                description="Historial de las acciones realizadas por los administradores y reclutadores en esta organización."
              >
                <OrganizationActivityTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>

          <TabsContent value="branding" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Branding de empresa"
                description="Personaliza la información pública de tu empresa."
              >
                <BrandingTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>

          <TabsContent value="team" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Equipo"
                description="Administra los miembros y roles de tu organización."
              >
                <TeamManagementTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>

          <TabsContent value="danger" className="mt-8">
            {organizationId ? (
              <PanelSection
                label="Zona de peligro"
                description="Acciones irreversibles para la administración de la organización."
              >
                <DangerZoneTab organizationId={organizationId} />
              </PanelSection>
            ) : (
              <p className="text-sm text-muted-foreground text-pretty">
                No tienes una organización asociada.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
