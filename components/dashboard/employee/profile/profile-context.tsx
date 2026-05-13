"use client"

/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeSkill,
} from "@/lib/api/resumes"
import {
  formatUserLocation,
  locationToFormData,
  useCreateResumeMutation,
  useDeleteAvatarMutation,
  useDeleteCvMutation,
  useResumeByUser,
  useUpdateResumeMutation,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useUploadResumeCvMutation,
  useUser,
} from "@/lib/api/use-profile"
import { authClient } from "@/lib/auth-client"
import { profileSaveSchema, validateForm as validateFormZod } from "@/lib/validations"

// Minimal session type for client component - mirrors ServerSession shape
export type ClientSession = {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    type?: string
    profession?: string
    avatar?: string | null
  }
  session?: {
    id: string
    expiresAt: Date
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date
    updatedAt?: Date
  } | null
}

export type SectionId =
  | "sidebar"
  | "personal"
  | "experience"
  | "education"
  | "certifications"
  | "languages"
  | "links"

export type FormData = {
  name: string
  email: string
  phone: string
  location: { street: string; city: string; country: string }
  profession: string
  bio: string
  skills: readonly string[]
  avatar: string
  dateOfBirth: string
}

export type ResumeFormData = {
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkill[]
  certifications: ResumeCertification[]
  languages: ResumeLanguage[]
  links: { url: string }[]
}

type ProfileContextValue = {
  userId: string | undefined
  user: ReturnType<typeof useUser>["data"]
  resume: ReturnType<typeof useResumeByUser>["data"]
  isLoading: boolean
  isSaving: boolean
  editingSection: SectionId | null
  formData: FormData
  resumeFormData: ResumeFormData
  errors: Record<string, string>
  profileData: FormData
  userError: ReturnType<typeof useUser>["error"]
  handleEditSection: (section: SectionId) => void
  handleInputChange: (
    field: keyof FormData,
    value: string | readonly string[] | { street: string; city: string; country: string }
  ) => void
  handleResumeArrayChange: <K extends keyof ResumeFormData>(
    key: K,
    updater: (arr: ResumeFormData[K]) => ResumeFormData[K]
  ) => void
  handleSaveSection: (section: SectionId) => Promise<void>
  handleCancelSection: () => void
  handleAvatarUpload: (file: File) => void
  handleCvUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAvatarDelete: () => void
  handleCvDelete: () => void
}

const emptyFormData = (): FormData => ({
  name: "",
  email: "",
  phone: "",
  location: { street: "", city: "", country: "" },
  profession: "",
  bio: "",
  skills: [],
  avatar: "",
  dateOfBirth: "",
})

const emptyResumeFormData = (): ResumeFormData => ({
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  links: [],
})

let _idCounter = 0
const genId = () => `__id_${++_idCounter}_${Date.now()}`

const emptyExperience = (): ResumeExperience => ({
  id: genId(),
  title: "",
  company: "",
  startYear: "",
  endYear: "",
  stillWorking: false,
  description: "",
})

const emptyEducation = (): ResumeEducation => ({
  id: genId(),
  title: "",
  institute: "",
  startYear: "",
  endYear: "",
  stillStudying: false,
})

const emptySkill = (): ResumeSkill => ({ id: genId(), name: "" })

const emptyCertification = (): ResumeCertification => ({
  id: genId(),
  title: "",
  company: "",
  date: "",
  link: "",
})

const emptyLanguage = (): ResumeLanguage => ({ id: genId(), name: "", level: "" })

export const EMPTY_PLACEHOLDER = "No especificado"

export const LEVEL_OPTIONS = [
  { value: "", label: "Sin especificar" },
  { value: "advanced", label: "Avanzado" },
  { value: "intermediate", label: "Intermedio" },
  { value: "entry", label: "Básico" },
] as const

export { emptyCertification, emptyEducation, emptyExperience, emptyLanguage, emptySkill }

import { createContext, use } from "react"

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfileContext() {
  const ctx = use(ProfileContext)
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider")
  return ctx
}

type ProfileProviderProps = {
  children: React.ReactNode
  session?: ClientSession | null
}

export function ProfileProvider({ children, session: serverSession }: ProfileProviderProps) {
  // The session is passed as a prop from the server (getServerSession in the page)
  // This ensures hydration matches between server and client
  // No client-side useSession needed since we already have the server session
  const session = serverSession
  const userId = session?.user?.id

  const { data: user, isLoading: userLoading, error: userError } = useUser(userId)
  const { data: resume, isLoading: resumeLoading } = useResumeByUser(userId)

  const updateUserMutation = useUpdateUserMutation(userId ?? "")
  const createResumeMutation = useCreateResumeMutation(userId ?? "")
  const updateResumeMutation = useUpdateResumeMutation(resume?.id ?? "", userId ?? "")
  const uploadCvMutation = useUploadResumeCvMutation(resume?.id ?? "", userId ?? "")
  const uploadAvatarMutation = useUploadAvatarMutation(userId ?? "")
  const deleteAvatarMutation = useDeleteAvatarMutation(userId ?? "")
  const deleteCvMutation = useDeleteCvMutation(resume?.id ?? "", userId ?? "")

  const [editingSection, setEditingSection] = useState<SectionId | null>(null)
  const [resumeFormData, setResumeFormData] = useState<ResumeFormData>(() => emptyResumeFormData())
  const [formData, setFormData] = useState<FormData>(() => emptyFormData())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const profileData = useMemo<FormData>(() => {
    return {
      name: user?.name ?? session?.user?.name ?? "",
      email: user?.email ?? session?.user?.email ?? "",
      phone: user?.phone ?? "",
      location: user ? locationToFormData(user.location) : { street: "", city: "", country: "" },
      profession: user?.profession ?? "",
      bio: resume?.summary ?? "",
      skills: Array.isArray(resume?.skills)
        ? resume.skills.map((s): string => (typeof s === "string" ? s : s.name))
        : [],
      avatar: user?.avatar ?? (session?.user as { image?: string })?.image ?? "",
      dateOfBirth: user?.birthday ? user.birthday.slice(0, 10) : "",
    }
  }, [user, session, resume])

  const resumeFormDataFromProfile = useMemo<ResumeFormData>(() => {
    if (!resume) return emptyResumeFormData()
    return {
      experiences: (resume.experiences ?? []).map((e, idx) => ({
        id: e.id ?? `exp-${idx}`,
        title: e.title ?? e.position,
        company: e.company,
        startYear: e.startYear ?? e.startDate?.slice(0, 4),
        endYear: e.endYear ?? e.endDate?.slice(0, 4),
        stillWorking: e.stillWorking ?? e.current,
        description: e.description,
      })),
      education: (resume.education ?? []).map((e, idx) => ({
        id: e.id ?? `edu-${idx}`,
        title: e.title ?? e.degree,
        institute: e.institute ?? e.institution,
        startYear: e.startYear ?? e.startDate?.slice(0, 4),
        endYear: e.endYear ?? e.endDate?.slice(0, 4),
        stillStudying: e.stillStudying,
      })),
      skills: (resume.skills ?? []).map((s, idx) =>
        typeof s === "string"
          ? { id: `skill-${idx}`, name: s }
          : { id: s.id ?? `skill-${idx}`, name: s.name, level: s.level }
      ),
      certifications: (resume.certifications ?? []).map((c, idx) => ({
        id: c.id ?? `cert-${idx}`,
        title: c.title ?? c.name,
        company: c.company ?? c.issuer,
        date: c.date,
        link: c.link,
      })),
      languages: (resume.languages ?? []).map((l, idx) => ({
        id: l.id ?? `lang-${idx}`,
        name: l.name ?? l.language,
        level: l.level,
      })),
      links: (resume.links ?? []).map((l) => ({ url: l.url })),
    }
  }, [resume])

  useEffect(() => {
    if (!editingSection && (user ?? session)) {
      setFormData(profileData)
      setResumeFormData(resumeFormDataFromProfile)
    }
  }, [user, session, editingSection, profileData, resumeFormDataFromProfile])

  const syncFormForSection = useCallback(
    (section: SectionId) => {
      setFormData(profileData)
      if (resume && section !== "sidebar") {
        setResumeFormData({
          experiences: (resume.experiences ?? []).map((e, idx) => ({
            id: e.id ?? `exp-${idx}`,
            title: e.title ?? e.position,
            company: e.company,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillWorking: e.stillWorking ?? e.current,
            description: e.description,
          })),
          education: (resume.education ?? []).map((e, idx) => ({
            id: e.id ?? `edu-${idx}`,
            title: e.title ?? e.degree,
            institute: e.institute ?? e.institution,
            startYear: e.startYear ?? e.startDate?.slice(0, 4),
            endYear: e.endYear ?? e.endDate?.slice(0, 4),
            stillStudying: e.stillStudying,
          })),
          skills: (resume.skills ?? []).map((s, idx) =>
            typeof s === "string"
              ? { id: `skill-${idx}`, name: s }
              : { id: s.id ?? `skill-${idx}`, name: s.name, level: s.level }
          ),
          certifications: (resume.certifications ?? []).map((c, idx) => ({
            id: c.id ?? `cert-${idx}`,
            title: c.title ?? c.name,
            company: c.company ?? c.issuer,
            date: c.date,
            link: c.link,
          })),
          languages: (resume.languages ?? []).map((l, idx) => ({
            id: l.id ?? `lang-${idx}`,
            name: l.name ?? l.language,
            level: l.level,
          })),
          links: (resume.links ?? []).map((l) => ({ url: l.url })),
        })
      } else if (!resume && section !== "sidebar") {
        setResumeFormData(emptyResumeFormData())
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
    (
      field: keyof FormData,
      value: string | readonly string[] | { street: string; city: string; country: string }
    ) => {
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
      experiences: resumeFormData.experiences.reduce<
        {
          title: string
          company?: string
          startYear?: string
          endYear?: string
          stillWorking?: boolean
          description?: string
        }[]
      >((acc, e) => {
        const title = (e.title ?? e.position)?.trim()
        if (title) {
          acc.push({
            title,
            company: e.company?.trim(),
            startYear: e.startYear?.trim(),
            endYear: e.endYear?.trim(),
            stillWorking: e.stillWorking ?? e.current,
            description: e.description?.trim(),
          })
        }
        return acc
      }, []),
      education: resumeFormData.education.reduce<
        {
          title: string
          institute?: string
          startYear?: string
          endYear?: string
          stillStudying?: boolean
        }[]
      >((acc, e) => {
        const title = (e.title ?? e.degree)?.trim()
        if (title) {
          acc.push({
            title,
            institute: (e.institute ?? e.institution)?.trim(),
            startYear: e.startYear?.trim(),
            endYear: e.endYear?.trim(),
            stillStudying: e.stillStudying,
          })
        }
        return acc
      }, []),
      skills: resumeFormData.skills.reduce<{ name: string; level?: string }[]>((acc, s) => {
        const name = s.name?.trim()
        if (name) {
          acc.push({ name, level: s.level || undefined })
        }
        return acc
      }, []),
      certifications: resumeFormData.certifications.reduce<
        { title: string; company?: string; date?: string; link?: string }[]
      >((acc, c) => {
        const title = (c.title ?? c.name)?.trim()
        if (title) {
          acc.push({
            title,
            company: (c.company ?? c.issuer)?.trim(),
            date: c.date?.trim(),
            link: c.link?.trim(),
          })
        }
        return acc
      }, []),
      languages: resumeFormData.languages.reduce<{ name: string; level?: string }[]>((acc, l) => {
        const name = (l.name ?? l.language)?.trim()
        if (name) {
          acc.push({ name, level: l.level || undefined })
        }
        return acc
      }, []),
      links: resumeFormData.links.reduce<{ url: string }[]>((acc, l) => {
        const url = l.url?.trim()
        if (url) {
          acc.push({ url })
        }
        return acc
      }, []),
    }),
    [formData.bio, resumeFormData]
  )

  const handleSaveSection = useCallback(
    async (section: SectionId) => {
      if (!userId) return

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
        const hasLocation =
          formData.location.street || formData.location.city || formData.location.country
        await updateUserMutation.mutateAsync({
          name: formData.name,
          profession: formData.profession || undefined,
          phone: formData.phone || undefined,
          avatar: formData.avatar || undefined,
          birthday: formData.dateOfBirth || undefined,
          location: hasLocation
            ? {
                street: formData.location.street || undefined,
                city: formData.location.city || undefined,
                country: formData.location.country || undefined,
              }
            : undefined,
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
        experiences: (resume.experiences ?? []).map((e, idx) => ({
          id: e.id ?? `exp-${idx}`,
          title: e.title ?? e.position,
          company: e.company,
          startYear: e.startYear ?? e.startDate?.slice(0, 4),
          endYear: e.endYear ?? e.endDate?.slice(0, 4),
          stillWorking: e.stillWorking ?? e.current,
          description: e.description,
        })),
        education: (resume.education ?? []).map((e, idx) => ({
          id: e.id ?? `edu-${idx}`,
          title: e.title ?? e.degree,
          institute: e.institute ?? e.institution,
          startYear: e.startYear ?? e.startDate?.slice(0, 4),
          endYear: e.endYear ?? e.endDate?.slice(0, 4),
          stillStudying: e.stillStudying,
        })),
        skills: (resume.skills ?? []).map((s, idx) =>
          typeof s === "string"
            ? { id: `skill-${idx}`, name: s }
            : { id: s.id ?? `skill-${idx}`, name: s.name, level: s.level }
        ),
        certifications: (resume.certifications ?? []).map((c, idx) => ({
          id: c.id ?? `cert-${idx}`,
          title: c.title ?? c.name,
          company: c.company ?? c.issuer,
          date: c.date,
          link: c.link,
        })),
        languages: (resume.languages ?? []).map((l, idx) => ({
          id: l.id ?? `lang-${idx}`,
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
    (file: File) => {
      if (file && userId) {
        uploadAvatarMutation.mutate(file, {
          onSuccess: (updatedUser) => {
            if (updatedUser?.avatar) {
              setFormData((prev) => ({ ...prev, avatar: updatedUser.avatar ?? prev.avatar }))
            }
          },
        })
      }
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

  const handleAvatarDelete = useCallback(() => {
    if (!userId) return
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: () => {
        setFormData((prev) => ({ ...prev, avatar: "" }))
      },
    })
  }, [userId, deleteAvatarMutation])

  const handleCvDelete = useCallback(() => {
    if (!resume?.id || !resume?.cvFile?.path) return
    deleteCvMutation.mutate(resume.cvFile.path)
  }, [resume?.id, resume?.cvFile?.path, deleteCvMutation])

  const isLoading = userLoading || resumeLoading
  const isSaving =
    updateUserMutation.isPending || updateResumeMutation.isPending || createResumeMutation.isPending

  const value: ProfileContextValue = {
    userId,
    user,
    resume,
    isLoading,
    isSaving,
    editingSection,
    formData,
    resumeFormData,
    errors,
    profileData,
    userError,
    handleEditSection,
    handleInputChange,
    handleResumeArrayChange,
    handleSaveSection,
    handleCancelSection,
    handleAvatarUpload,
    handleCvUpload,
    handleAvatarDelete,
    handleCvDelete,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
