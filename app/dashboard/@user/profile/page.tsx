"use client"

import {
  Award01Icon,
  BirthdayCakeIcon,
  Briefcase01Icon,
  Building06Icon,
  Camera01Icon,
  Cancel01Icon,
  Edit01Icon,
  FileAttachmentIcon,
  FloppyDiskIcon,
  Globe02Icon,
  GraduationScrollIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Github, Globe, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { DatePicker } from "@/components/common/DatePicker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type {
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeSkill,
} from "@/lib/api/resumes"
import {
  formatUserLocation,
  parseLocationString,
  useCreateResumeMutation,
  useResumeByUser,
  useUpdateResumeMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUploadResumeCvMutation,
  useUser,
} from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { cn, dateToDateString, formatMonthYear, parseLocalDate } from "@/lib/utils"
import { profileSaveSchema, validateForm as validateFormZod } from "@/lib/validations"

const EMPTY_PLACEHOLDER = "No especificado"

type LinkInfo = { label: string; Icon: typeof Github }

const getLinkInfo = (url: string): LinkInfo => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes("linkedin")) return { label: "LinkedIn", Icon: Linkedin }
    if (host.includes("github")) return { label: "GitHub", Icon: Github }
    if (host.includes("portfolio") || host.includes("personal"))
      return { label: "Portfolio", Icon: Globe }
    return { label: host.replace("www.", ""), Icon: Globe }
  } catch {
    return { label: url, Icon: Globe }
  }
}
const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

const LEVEL_OPTIONS = [
  { value: "", label: "Sin especificar" },
  { value: "advanced", label: "Avanzado" },
  { value: "intermediate", label: "Intermedio" },
  { value: "entry", label: "Básico" },
] as const

type SectionId =
  | "sidebar"
  | "personal"
  | "experience"
  | "education"
  | "certifications"
  | "languages"
  | "links"

type FormData = {
  name: string
  email: string
  phone: string
  location: string
  profession: string
  bio: string
  skills: readonly string[]
  avatar: string
  dateOfBirth: string
}

type ResumeFormData = {
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkill[]
  certifications: ResumeCertification[]
  languages: ResumeLanguage[]
  links: { url: string }[]
}

const emptyExperience = (): ResumeExperience => ({
  title: "",
  company: "",
  startYear: "",
  endYear: "",
  stillWorking: false,
  description: "",
})

const emptyEducation = (): ResumeEducation => ({
  title: "",
  institute: "",
  startYear: "",
  endYear: "",
  stillStudying: false,
})

const emptySkill = (): ResumeSkill => ({ name: "" })

const emptyCertification = (): ResumeCertification => ({
  title: "",
  company: "",
  date: "",
  link: "",
})

const emptyLanguage = (): ResumeLanguage => ({ name: "", level: "" })

const getExpDisplay = (exp: ResumeExperience) => ({
  title: exp.title ?? exp.position ?? "",
  company: exp.company ?? "",
  start: exp.startYear ?? exp.startDate?.slice(0, 4) ?? "",
  end: exp.endYear ?? exp.endDate?.slice(0, 4) ?? "",
  current: exp.stillWorking ?? exp.current ?? false,
})

const getEduDisplay = (edu: ResumeEducation) => ({
  title: edu.title ?? edu.degree ?? "",
  institute: edu.institute ?? edu.institution ?? "",
  start: edu.startYear ?? edu.startDate?.slice(0, 4) ?? "",
  end: edu.endYear ?? edu.endDate?.slice(0, 4) ?? "",
  current: edu.stillStudying ?? false,
})

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

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof Briefcase01Icon
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

const EmployeeProfile = () => {
  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id

  const { data: user, isLoading: userLoading, error: userError } = useUser(userId)
  const { data: resume, isLoading: resumeLoading } = useResumeByUser(userId)

  const updateUserMutation = useUpdateUserMutation(userId ?? "")
  const createResumeMutation = useCreateResumeMutation(userId ?? "")
  const updateResumeMutation = useUpdateResumeMutation(resume?.id ?? "", userId ?? "")
  const uploadCvMutation = useUploadResumeCvMutation(resume?.id ?? "", userId ?? "")
  const uploadAvatarMutation = useUploadAvatarMutation(userId ?? "")

  const [editingSection, setEditingSection] = useState<SectionId | null>(null)
  const [resumeFormData, setResumeFormData] = useState<ResumeFormData>({
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    links: [],
  })
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    bio: "",
    skills: [],
    avatar: "",
    dateOfBirth: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const profileData: FormData = {
    name: user?.name ?? session?.user?.name ?? "",
    email: user?.email ?? session?.user?.email ?? "",
    phone: user?.phone ?? "",
    location: user ? formatUserLocation(user.location) : "",
    profession: user?.profession ?? "",
    bio: resume?.summary ?? "",
    skills: Array.isArray(resume?.skills)
      ? resume.skills.map((s): string => (typeof s === "string" ? s : s.name))
      : [],
    avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
    dateOfBirth: user?.birthday ? user.birthday.slice(0, 10) : "",
  }

  useEffect(() => {
    if (!editingSection && (user ?? session)) {
      setFormData({
        name: user?.name ?? (session?.user?.name as string) ?? "",
        email: user?.email ?? (session?.user?.email as string) ?? "",
        phone: user?.phone ?? "",
        location: user ? formatUserLocation(user.location) : "",
        profession: user?.profession ?? "",
        bio: resume?.summary ?? "",
        skills: Array.isArray(resume?.skills)
          ? resume.skills.map((s): string => (typeof s === "string" ? s : s.name))
          : [],
        avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
        dateOfBirth: user?.birthday ? user.birthday.slice(0, 10) : "",
      })
      if (resume) {
        setResumeFormData({
          experiences: (resume.experiences ?? []).map((e) => ({
            title: e.title ?? e.position,
            company: e.company,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillWorking: e.stillWorking ?? e.current,
            description: e.description,
          })),
          education: (resume.education ?? []).map((e) => ({
            title: e.title ?? e.degree,
            institute: e.institute ?? e.institution,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillStudying: e.stillStudying,
          })),
          skills: (resume.skills ?? []).map((s) =>
            typeof s === "string" ? { name: s } : { name: s.name, level: s.level }
          ),
          certifications: (resume.certifications ?? []).map((c) => ({
            title: c.title ?? c.name,
            company: c.company ?? c.issuer,
            date: c.date,
            link: c.link,
          })),
          languages: (resume.languages ?? []).map((l) => ({
            name: l.name ?? l.language,
            level: l.level,
          })),
          links: (resume.links ?? []).map((l) => ({ url: l.url })),
        })
      } else {
        setResumeFormData({
          experiences: [],
          education: [],
          skills: [],
          certifications: [],
          languages: [],
          links: [],
        })
      }
    }
  }, [user, session, resume, editingSection])

  const syncFormForSection = useCallback(
    (section: SectionId) => {
      setFormData(profileData)
      if (resume && section !== "sidebar") {
        setResumeFormData({
          experiences: (resume.experiences ?? []).map((e) => ({
            title: e.title ?? e.position,
            company: e.company,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillWorking: e.stillWorking ?? e.current,
            description: e.description,
          })),
          education: (resume.education ?? []).map((e) => ({
            title: e.title ?? e.degree,
            institute: e.institute ?? e.institution,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillStudying: e.stillStudying,
          })),
          skills: (resume.skills ?? []).map((s) =>
            typeof s === "string" ? { name: s } : { name: s.name, level: s.level }
          ),
          certifications: (resume.certifications ?? []).map((c) => ({
            title: c.title ?? c.name,
            company: c.company ?? c.issuer,
            date: c.date,
            link: c.link,
          })),
          languages: (resume.languages ?? []).map((l) => ({
            name: l.name ?? l.language,
            level: l.level,
          })),
          links: (resume.links ?? []).map((l) => ({ url: l.url })),
        })
      } else if (!resume && section !== "sidebar") {
        setResumeFormData({
          experiences: [],
          education: [],
          skills: [],
          certifications: [],
          languages: [],
          links: [],
        })
      }
    },
    [profileData, resume]
  )

  const handleEditSection = useCallback(
    (section: SectionId) => {
      syncFormForSection(section)
      setEditingSection(section)
    },
    [syncFormForSection]
  )

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | readonly string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
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

  const handleResumeArrayChange = useCallback(
    <K extends keyof ResumeFormData>(
      key: K,
      updater: (arr: ResumeFormData[K]) => ResumeFormData[K]
    ) => {
      setResumeFormData((prev) => ({ ...prev, [key]: updater(prev[key]) }))
    },
    []
  )

  const resumePayload = useCallback(
    () => ({
      summary: formData.bio || undefined,
      experiences: resumeFormData.experiences
        .filter((e) => (e.title ?? e.position)?.trim())
        .map((e) => ({
          title: (e.title ?? e.position)?.trim(),
          company: e.company?.trim(),
          startYear: e.startYear?.trim(),
          endYear: e.endYear?.trim(),
          stillWorking: e.stillWorking ?? e.current,
          description: e.description?.trim(),
        })),
      education: resumeFormData.education
        .filter((e) => (e.title ?? e.degree)?.trim())
        .map((e) => ({
          title: (e.title ?? e.degree)?.trim(),
          institute: (e.institute ?? e.institution)?.trim(),
          startYear: e.startYear?.trim(),
          endYear: e.endYear?.trim(),
          stillStudying: e.stillStudying,
        })),
      skills: resumeFormData.skills
        .filter((s) => s.name?.trim())
        .map((s) => ({ name: s.name.trim(), level: s.level || undefined })),
      certifications: resumeFormData.certifications
        .filter((c) => (c.title ?? c.name)?.trim())
        .map((c) => ({
          title: (c.title ?? c.name)?.trim(),
          company: (c.company ?? c.issuer)?.trim(),
          date: c.date?.trim(),
          link: c.link?.trim(),
        })),
      languages: resumeFormData.languages
        .filter((l) => (l.name ?? l.language)?.trim())
        .map((l) => ({
          name: (l.name ?? l.language)?.trim(),
          level: l.level || undefined,
        })),
      links: resumeFormData.links.filter((l) => l.url?.trim()).map((l) => ({ url: l.url.trim() })),
    }),
    [formData.bio, resumeFormData]
  )

  const handleSaveSection = useCallback(
    async (section: SectionId) => {
      if (!userId) return

      try {
        if (section === "sidebar") {
          const result = validateFormZod(profileSaveSchema, {
            name: formData.name,
            email: formData.email,
            profession: formData.profession,
          })
          if (!result.success) {
            setErrors(result.errors)
            return
          }
          const location = formData.location.trim()
          await updateUserMutation.mutateAsync({
            name: formData.name,
            profession: formData.profession || undefined,
            phone: formData.phone || undefined,
            avatar: formData.avatar || undefined,
            birthday: formData.dateOfBirth || undefined,
            location: location ? parseLocationString(formData.location) : undefined,
          })
        } else {
          const payload = resumePayload()
          if (resume) {
            await updateResumeMutation.mutateAsync(payload)
          } else {
            await createResumeMutation.mutateAsync(payload)
          }
        }
        setEditingSection(null)
        setErrors({})
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : "Error al guardar",
        })
      }
    },
    [
      userId,
      formData,
      resumePayload,
      resume,
      updateUserMutation,
      updateResumeMutation,
      createResumeMutation,
    ]
  )

  const handleCancelSection = useCallback(() => {
    setFormData(profileData)
    if (resume) {
      setResumeFormData({
        experiences: (resume.experiences ?? []).map((e) => ({
          title: e.title ?? e.position,
          company: e.company,
          startYear: e.startYear ?? e.startDate?.slice(0, 4),
          endYear: e.endYear ?? e.endDate?.slice(0, 4),
          stillWorking: e.stillWorking ?? e.current,
          description: e.description,
        })),
        education: (resume.education ?? []).map((e) => ({
          title: e.title ?? e.degree,
          institute: e.institute ?? e.institution,
          startYear: e.startYear ?? e.startDate?.slice(0, 4),
          endYear: e.endYear ?? e.endDate?.slice(0, 4),
          stillStudying: e.stillStudying,
        })),
        skills: (resume.skills ?? []).map((s) =>
          typeof s === "string" ? { name: s } : { name: s.name, level: s.level }
        ),
        certifications: (resume.certifications ?? []).map((c) => ({
          title: c.title ?? c.name,
          company: c.company ?? c.issuer,
          date: c.date,
          link: c.link,
        })),
        languages: (resume.languages ?? []).map((l) => ({
          name: l.name ?? l.language,
          level: l.level,
        })),
        links: (resume.links ?? []).map((l) => ({ url: l.url })),
      })
    }
    setEditingSection(null)
    setErrors({})
  }, [profileData, resume])

  const handleAvatarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && userId) {
        uploadAvatarMutation.mutate(file, {
          onSuccess: (updatedUser) => {
            if (updatedUser?.avatar) {
              setFormData((prev) => ({ ...prev, avatar: updatedUser.avatar ?? prev.avatar }))
            }
          },
        })
      }
      event.target.value = ""
    },
    [userId, uploadAvatarMutation]
  )

  const handleCvUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && resume?.id) {
        uploadCvMutation.mutate(file)
      }
      event.target.value = ""
    },
    [resume?.id, uploadCvMutation]
  )

  const isLoading = userLoading || resumeLoading
  const isSaving =
    updateUserMutation.isPending || updateResumeMutation.isPending || createResumeMutation.isPending

  if (!userId && !session) {
    return (
      <main className="p-6">
        <p className="text-muted-foreground text-pretty">Inicia sesión para ver tu perfil.</p>
      </main>
    )
  }

  if (userError) {
    return (
      <main className="p-6">
        <p className="text-destructive text-pretty">
          {userError instanceof Error ? userError.message : "Error al cargar el perfil"}
        </p>
      </main>
    )
  }

  if (isLoading && !user) {
    return (
      <main className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-muted animate-pulse rounded-xl" />
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-muted animate-pulse rounded-xl" />
            <div className="h-64 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </main>
    )
  }

  const isEditingSidebar = editingSection === "sidebar"
  const isEditingPersonal = editingSection === "personal"
  const isEditingExperience = editingSection === "experience"
  const isEditingEducation = editingSection === "education"
  const isEditingCertifications = editingSection === "certifications"
  const isEditingLanguages = editingSection === "languages"
  const isEditingLinks = editingSection === "links"

  const data = editingSection ? formData : profileData

  return (
    <main className="p-6 space-y-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona tu información personal y profesional
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
                      <Badge variant="accent" className="mt-2 text-xs">
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
                    data.phone || EMPTY_PLACEHOLDER
                  )
                }
              />
              {user?.organization && (
                <InfoRow
                  icon={Building06Icon}
                  label="Organización"
                  value={user.organization.name}
                />
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
                    data.location || EMPTY_PLACEHOLDER
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
                      setDate={(d) =>
                        handleInputChange("dateOfBirth", d ? dateToDateString(d) : "")
                      }
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
        </aside>

        <div className="space-y-6 min-w-0">
          {errors.general && (
            <p className="text-sm text-destructive text-pretty">{errors.general}</p>
          )}
          <EditableCard
            isEditing={isEditingPersonal}
            onEdit={() => handleEditSection("personal")}
            onSave={() => handleSaveSection("personal")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon icon={UserIcon} size={18} />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="profile-bio" className="text-sm font-medium text-foreground">
                  Biografía
                </label>
                {isEditingPersonal ? (
                  <textarea
                    id="profile-bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                ) : (
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {data.bio || EMPTY_PLACEHOLDER}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-skills" className="text-sm font-medium text-foreground">
                  Habilidades
                </label>
                {isEditingPersonal ? (
                  <div className="space-y-3">
                    {(resumeFormData.skills.length > 0
                      ? resumeFormData.skills
                      : [emptySkill()]
                    ).map((skill, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            handleResumeArrayChange("skills", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], name: e.target.value }
                              return next
                            })
                          }
                          placeholder="Nombre de la habilidad"
                          className="flex-1"
                        />
                        <select
                          value={skill.level ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("skills", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], level: e.target.value || undefined }
                              return next
                            })
                          }
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm w-28"
                        >
                          {LEVEL_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleResumeArrayChange("skills", (arr) =>
                              arr.filter((_, j) => j !== i)
                            )
                          }
                          aria-label="Eliminar"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleResumeArrayChange("skills", (arr) => [...arr, emptySkill()])
                      }
                    >
                      Agregar habilidad
                    </Button>
                  </div>
                ) : (resume?.skills?.length ?? 0) > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(resume?.skills ?? []).map((skill, i) => {
                      const name = typeof skill === "string" ? skill : skill.name
                      const level = typeof skill === "string" ? undefined : skill.level
                      return (
                        <span
                          key={i}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {name}
                          {level && <span className="ml-1 text-muted-foreground">({level})</span>}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-pretty">{EMPTY_PLACEHOLDER}</p>
                )}
              </div>
            </CardContent>
          </EditableCard>

          <EditableCard
            isEditing={isEditingExperience}
            onEdit={() => handleEditSection("experience")}
            onSave={() => handleSaveSection("experience")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <SectionTitle icon={Briefcase01Icon} title="Experiencia laboral" />
            </CardHeader>
            <CardContent>
              {isEditingExperience ? (
                <div className="space-y-4">
                  {(resumeFormData.experiences.length > 0
                    ? resumeFormData.experiences
                    : [emptyExperience()]
                  ).map((exp, i) => (
                    <div key={i} className="rounded-md border border-border p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input
                            value={exp.title ?? exp.position ?? ""}
                            onChange={(e) =>
                              handleResumeArrayChange("experiences", (arr) => {
                                const next = [...arr]
                                next[i] = { ...next[i], title: e.target.value }
                                return next
                              })
                            }
                            placeholder="Cargo / Título"
                          />
                          <Input
                            value={exp.company ?? ""}
                            onChange={(e) =>
                              handleResumeArrayChange("experiences", (arr) => {
                                const next = [...arr]
                                next[i] = { ...next[i], company: e.target.value }
                                return next
                              })
                            }
                            placeholder="Empresa"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() =>
                            handleResumeArrayChange("experiences", (arr) =>
                              arr.filter((_, j) => j !== i)
                            )
                          }
                          aria-label="Eliminar"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </Button>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <Input
                          value={exp.startYear ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("experiences", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], startYear: e.target.value }
                              return next
                            })
                          }
                          placeholder="Año inicio"
                          className="w-24"
                        />
                        <Input
                          value={exp.endYear ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("experiences", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], endYear: e.target.value }
                              return next
                            })
                          }
                          placeholder="Año fin"
                          className="w-24"
                          disabled={exp.stillWorking ?? exp.current}
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={exp.stillWorking ?? exp.current ?? false}
                            onChange={(e) =>
                              handleResumeArrayChange("experiences", (arr) => {
                                const next = [...arr]
                                next[i] = {
                                  ...next[i],
                                  stillWorking: e.target.checked,
                                  current: e.target.checked,
                                }
                                return next
                              })
                            }
                            className="rounded"
                          />
                          Actualidad
                        </label>
                      </div>
                      <textarea
                        value={exp.description ?? ""}
                        onChange={(e) =>
                          handleResumeArrayChange("experiences", (arr) => {
                            const next = [...arr]
                            next[i] = { ...next[i], description: e.target.value }
                            return next
                          })
                        }
                        placeholder="Descripción"
                        className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleResumeArrayChange("experiences", (arr) => [...arr, emptyExperience()])
                    }
                  >
                    Agregar experiencia
                  </Button>
                </div>
              ) : (resume?.experiences?.length ?? 0) > 0 ? (
                <ul className="space-y-6">
                  {(resume?.experiences ?? []).map((exp, i) => {
                    const d = getExpDisplay(exp)
                    return (
                      <li
                        key={i}
                        className="relative pl-6 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-primary"
                      >
                        <p className="font-medium text-foreground">{d.title || d.company}</p>
                        {d.company && <p className="text-sm text-muted-foreground">{d.company}</p>}
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {d.start} — {d.current ? "Actualidad" : d.end || ""}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm text-muted-foreground text-pretty">
                            {exp.description}
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Agrega tu experiencia laboral para destacar tu perfil
                </p>
              )}
            </CardContent>
          </EditableCard>

          <EditableCard
            isEditing={isEditingEducation}
            onEdit={() => handleEditSection("education")}
            onSave={() => handleSaveSection("education")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <SectionTitle icon={GraduationScrollIcon} title="Formación académica" />
            </CardHeader>
            <CardContent>
              {isEditingEducation ? (
                <div className="space-y-4">
                  {(resumeFormData.education.length > 0
                    ? resumeFormData.education
                    : [emptyEducation()]
                  ).map((edu, i) => (
                    <div key={i} className="rounded-md border border-border p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="grid gap-2 flex-1 sm:grid-cols-2">
                          <Input
                            value={edu.title ?? edu.degree ?? ""}
                            onChange={(e) =>
                              handleResumeArrayChange("education", (arr) => {
                                const next = [...arr]
                                next[i] = { ...next[i], title: e.target.value }
                                return next
                              })
                            }
                            placeholder="Título / Carrera"
                          />
                          <Input
                            value={edu.institute ?? edu.institution ?? ""}
                            onChange={(e) =>
                              handleResumeArrayChange("education", (arr) => {
                                const next = [...arr]
                                next[i] = { ...next[i], institute: e.target.value }
                                return next
                              })
                            }
                            placeholder="Institución"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() =>
                            handleResumeArrayChange("education", (arr) =>
                              arr.filter((_, j) => j !== i)
                            )
                          }
                          aria-label="Eliminar"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </Button>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <Input
                          value={edu.startYear ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("education", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], startYear: e.target.value }
                              return next
                            })
                          }
                          placeholder="Año inicio"
                          className="w-24"
                        />
                        <Input
                          value={edu.endYear ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("education", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], endYear: e.target.value }
                              return next
                            })
                          }
                          placeholder="Año fin"
                          className="w-24"
                          disabled={edu.stillStudying}
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={edu.stillStudying ?? false}
                            onChange={(e) =>
                              handleResumeArrayChange("education", (arr) => {
                                const next = [...arr]
                                next[i] = { ...next[i], stillStudying: e.target.checked }
                                return next
                              })
                            }
                            className="rounded"
                          />
                          En curso
                        </label>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleResumeArrayChange("education", (arr) => [...arr, emptyEducation()])
                    }
                  >
                    Agregar formación
                  </Button>
                </div>
              ) : (resume?.education?.length ?? 0) > 0 ? (
                <ul className="space-y-6">
                  {(resume?.education ?? []).map((edu, i) => {
                    const d = getEduDisplay(edu)
                    return (
                      <li
                        key={i}
                        className="relative pl-6 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-primary"
                      >
                        <p className="font-medium text-foreground">{d.title}</p>
                        {d.institute && (
                          <p className="text-sm text-muted-foreground">{d.institute}</p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {d.start} — {d.current ? "En curso" : d.end || ""}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Agrega tu formación académica</p>
              )}
            </CardContent>
          </EditableCard>

          <EditableCard
            isEditing={isEditingCertifications}
            onEdit={() => handleEditSection("certifications")}
            onSave={() => handleSaveSection("certifications")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <SectionTitle icon={Award01Icon} title="Certificaciones" />
            </CardHeader>
            <CardContent>
              {isEditingCertifications ? (
                <div className="space-y-4">
                  {(resumeFormData.certifications.length > 0
                    ? resumeFormData.certifications
                    : [emptyCertification()]
                  ).map((cert, i) => (
                    <div key={i} className="rounded-md border border-border p-4 space-y-2">
                      <div className="flex justify-between gap-2">
                        <Input
                          value={cert.title ?? cert.name ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("certifications", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], title: e.target.value }
                              return next
                            })
                          }
                          placeholder="Nombre"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleResumeArrayChange("certifications", (arr) =>
                              arr.filter((_, j) => j !== i)
                            )
                          }
                          aria-label="Eliminar"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </Button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          value={cert.company ?? cert.issuer ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("certifications", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], company: e.target.value }
                              return next
                            })
                          }
                          placeholder="Emisor / Empresa"
                        />
                        <Input
                          value={cert.date ?? ""}
                          onChange={(e) =>
                            handleResumeArrayChange("certifications", (arr) => {
                              const next = [...arr]
                              next[i] = { ...next[i], date: e.target.value }
                              return next
                            })
                          }
                          placeholder="Fecha (YYYY-MM)"
                        />
                      </div>
                      <Input
                        value={cert.link ?? ""}
                        onChange={(e) =>
                          handleResumeArrayChange("certifications", (arr) => {
                            const next = [...arr]
                            next[i] = { ...next[i], link: e.target.value }
                            return next
                          })
                        }
                        placeholder="Enlace (opcional)"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleResumeArrayChange("certifications", (arr) => [
                        ...arr,
                        emptyCertification(),
                      ])
                    }
                  >
                    Agregar certificación
                  </Button>
                </div>
              ) : (resume?.certifications?.length ?? 0) > 0 ? (
                <ul className="space-y-3">
                  {(resume?.certifications ?? []).map((cert, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                    >
                      <span className="font-medium text-foreground">{cert.title ?? cert.name}</span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {[cert.company ?? cert.issuer, cert.date].filter(Boolean).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Agrega certificaciones y cursos que hayas completado
                </p>
              )}
            </CardContent>
          </EditableCard>

          <EditableCard
            isEditing={isEditingLanguages}
            onEdit={() => handleEditSection("languages")}
            onSave={() => handleSaveSection("languages")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <SectionTitle icon={Globe02Icon} title="Idiomas" />
            </CardHeader>
            <CardContent>
              {isEditingLanguages ? (
                <div className="space-y-4">
                  {(resumeFormData.languages.length > 0
                    ? resumeFormData.languages
                    : [emptyLanguage()]
                  ).map((lang, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        value={lang.name ?? lang.language ?? ""}
                        onChange={(e) =>
                          handleResumeArrayChange("languages", (arr) => {
                            const next = [...arr]
                            next[i] = { ...next[i], name: e.target.value }
                            return next
                          })
                        }
                        placeholder="Idioma"
                        className="flex-1"
                      />
                      <select
                        value={lang.level ?? ""}
                        onChange={(e) =>
                          handleResumeArrayChange("languages", (arr) => {
                            const next = [...arr]
                            next[i] = { ...next[i], level: e.target.value || undefined }
                            return next
                          })
                        }
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm w-28"
                      >
                        {LEVEL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleResumeArrayChange("languages", (arr) =>
                            arr.filter((_, j) => j !== i)
                          )
                        }
                        aria-label="Eliminar"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleResumeArrayChange("languages", (arr) => [...arr, emptyLanguage()])
                    }
                  >
                    Agregar idioma
                  </Button>
                </div>
              ) : (resume?.languages?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(resume?.languages ?? []).map((lang, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm"
                    >
                      {lang.name ?? lang.language}
                      {lang.level && (
                        <span className="ml-1.5 text-muted-foreground">({lang.level})</span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Indica los idiomas que dominas y tu nivel
                </p>
              )}
            </CardContent>
          </EditableCard>

          <EditableCard
            isEditing={isEditingLinks}
            onEdit={() => handleEditSection("links")}
            onSave={() => handleSaveSection("links")}
            onCancel={handleCancelSection}
            isSaving={isSaving}
          >
            <CardHeader className="pb-4">
              <SectionTitle icon={Link01Icon} title="Enlaces" />
            </CardHeader>
            <CardContent>
              {isEditingLinks ? (
                <div className="space-y-4">
                  {(resumeFormData.links.length > 0 ? resumeFormData.links : [{ url: "" }]).map(
                    (link, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleResumeArrayChange("links", (arr) => {
                              const next = [...arr]
                              next[i] = { url: e.target.value }
                              return next
                            })
                          }
                          placeholder="https://linkedin.com/in/..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleResumeArrayChange("links", (arr) => arr.filter((_, j) => j !== i))
                          }
                          aria-label="Eliminar"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleResumeArrayChange("links", (arr) => [...arr, { url: "" }])}
                  >
                    Agregar enlace
                  </Button>
                </div>
              ) : (resume?.links?.length ?? 0) > 0 ? (
                <ul className="space-y-2">
                  {(resume?.links ?? []).map((link, i) => {
                    const { label, Icon } = getLinkInfo(link.url)
                    return (
                      <li key={i}>
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <Icon size={14} />
                          {label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Agrega enlaces a LinkedIn, portfolio, GitHub u otros
                </p>
              )}
            </CardContent>
          </EditableCard>
        </div>
      </div>
    </main>
  )
}

export default EmployeeProfile
