import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type ResumeExperience = {
  id?: string
  title?: string
  position?: string
  company?: string
  startDate?: string
  startYear?: string
  endDate?: string
  endYear?: string
  current?: boolean
  stillWorking?: boolean
  description?: string
}

export type ResumeEducation = {
  id?: string
  title?: string
  degree?: string
  institution?: string
  institute?: string
  startDate?: string
  startYear?: string
  endDate?: string
  endYear?: string
  stillStudying?: boolean
}

export type ResumeSkill = {
  id?: string
  name: string
  level?: string
}

export type ResumeCertification = {
  id?: string
  title?: string
  name?: string
  issuer?: string
  company?: string
  date?: string
  link?: string
}

export type ResumeLanguage = {
  id?: string
  name?: string
  language?: string
  level?: string
}

export type ResumeLink = {
  url: string
}

export type ResumeCvFile = {
  url?: string
  path?: string
  originalName?: string
  mimeType?: string
  size?: number
  uploadedAt?: string
}

export type Resume = {
  id: string
  userId: string
  summary: string | null
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  skills: (string | ResumeSkill)[]
  certifications: ResumeCertification[]
  languages: ResumeLanguage[]
  links: ResumeLink[]
  cvFile: ResumeCvFile | null
  createdAt: string
  updatedAt: string
}

export type CreateResumeInput = {
  userId: string
  summary?: string
  experiences?: ResumeExperience[]
  education?: ResumeEducation[]
  skills?: (string | ResumeSkill)[]
  certifications?: ResumeCertification[]
  languages?: ResumeLanguage[]
  links?: ResumeLink[]
  cvFile?: ResumeCvFile
}

export type UpdateResumeInput = Partial<Omit<CreateResumeInput, "userId">>

/** Normalizes API response to ensure Resume shape with arrays. */
function normalizeResume(raw: unknown): Resume | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  let resumeObj: unknown =
    (obj.data as Record<string, unknown> | undefined) ??
    (obj.resume as Record<string, unknown> | undefined) ??
    obj

  if (resumeObj && typeof resumeObj === "object") {
    const r0 = resumeObj as Record<string, unknown>
    if (r0.data && typeof r0.data === "object") resumeObj = r0.data
  }

  if (!resumeObj || typeof resumeObj !== "object") return null

  const r = resumeObj as Record<string, unknown>
  const id = String(r.id ?? "")
  if (!id) return null

  return {
    id,
    userId: String(r.userId ?? r.user_id ?? ""),
    summary: typeof r.summary === "string" ? r.summary : null,
    experiences: Array.isArray(r.experiences) ? r.experiences : [],
    education: Array.isArray(r.education) ? r.education : [],
    skills: Array.isArray(r.skills) ? r.skills : [],
    certifications: Array.isArray(r.certifications) ? r.certifications : [],
    languages: Array.isArray(r.languages) ? r.languages : [],
    links: Array.isArray(r.links) ? r.links : [],
    cvFile: (r.cvFile ?? r.cv_file) ? ((r.cvFile ?? r.cv_file) as ResumeCvFile) : null,
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    updatedAt: String(r.updatedAt ?? r.updated_at ?? ""),
  }
}

export async function getResumeByUserId(
  userId: string
): Promise<Result<Resume | null, ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(`${API_BASE}/api/v1/resumes/user/${userId}`)

  if (result.isErr()) {
    const error = result.error
    if (error._tag === "ApiError" && error.status === 404) {
      return R.ok(null)
    }
    return R.err(error)
  }

  const normalized = normalizeResume(result.value)
  return R.ok(normalized)
}

export async function getResume(id: string): Promise<Result<Resume, ApiError | NetworkError>> {
  return fetchJson<Resume>(`${API_BASE}/api/v1/resumes/${id}`)
}

export async function getResumesByUserIds(
  userIds: string[]
): Promise<Result<Record<string, Resume>, ApiError | NetworkError>> {
  if (userIds.length === 0) return R.ok({})

  const idsParam = userIds.join(",")
  const result = await fetchJson<unknown>(`${API_BASE}/api/v1/resumes/users?ids=${idsParam}`)

  if (result.isErr()) return R.err(result.error)

  const raw = result.value
  if (!raw || typeof raw !== "object") return R.ok({})

  const obj = raw as Record<string, unknown>
  const resumesObj: Record<string, Resume> = {}

  if (Array.isArray(obj.data)) {
    for (const item of obj.data) {
      const normalized = normalizeResume(item)
      if (normalized) {
        resumesObj[normalized.userId] = normalized
      }
    }
  }

  return R.ok(resumesObj)
}

export async function createResume(
  input: CreateResumeInput
): Promise<Result<Resume, ApiError | NetworkError>> {
  return fetchJson<Resume>(`${API_BASE}/api/v1/resumes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function updateResume(
  id: string,
  input: UpdateResumeInput
): Promise<Result<Resume, ApiError | NetworkError>> {
  return fetchJson<Resume>(`${API_BASE}/api/v1/resumes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function uploadResumeCv(
  resumeId: string,
  file: File
): Promise<Result<Resume, ApiError | NetworkError>> {
  const formData = new FormData()
  formData.append("file", file)

  const uploadUrl = "/api/upload/cv"

  const uploadResult = await fetchJson<{
    url?: string
    originalName?: string
    mimeType?: string
    size?: number
    uploadedAt?: string
  }>(uploadUrl, { method: "POST", body: formData })

  if (uploadResult.isErr()) return R.err(uploadResult.error)

  const uploadData = uploadResult.value

  const cvFile: ResumeCvFile = {
    url: uploadData.url,
    originalName: uploadData.originalName,
    mimeType: uploadData.mimeType,
    size: uploadData.size,
    uploadedAt: uploadData.uploadedAt,
  }

  return updateResume(resumeId, { cvFile })
}
