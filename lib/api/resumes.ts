import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { getErrorMessage } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type ResumeExperience = {
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
  name: string
  level?: string
}

export type ResumeCertification = {
  title?: string
  name?: string
  issuer?: string
  company?: string
  date?: string
  link?: string
}

export type ResumeLanguage = {
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
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/resumes/user/${userId}`)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  if (res.status === 404) {
    return R.ok(null)
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener el currículum"),
      })
    )
  }

  const normalized = normalizeResume(data)
  return R.ok(normalized)
}

export async function getResume(id: string): Promise<Result<Resume, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/resumes/${id}`)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener el currículum"),
      })
    )
  }
  return R.ok(data as Resume)
}

export async function createResume(
  input: CreateResumeInput
): Promise<Result<Resume, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/resumes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al crear el currículum"),
      })
    )
  }
  return R.ok(data as Resume)
}

export async function updateResume(
  id: string,
  input: UpdateResumeInput
): Promise<Result<Resume, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/resumes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al actualizar el currículum"),
      })
    )
  }
  return R.ok(data as Resume)
}

export async function uploadResumeCv(
  resumeId: string,
  file: File
): Promise<Result<Resume, ApiError | NetworkError>> {
  const formData = new FormData()
  formData.append("file", file)

  const uploadUrl = "/api/upload/cv"

  let res: Response
  try {
    res = await fetch(uploadUrl, { method: "POST", body: formData })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const uploadData = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: uploadData,
        message: getErrorMessage(uploadData, "Error al subir el CV"),
      })
    )
  }

  const cvFile: ResumeCvFile = {
    url: (uploadData as { url?: string }).url,
    originalName: (uploadData as { originalName?: string }).originalName,
    mimeType: (uploadData as { mimeType?: string }).mimeType,
    size: (uploadData as { size?: number }).size,
    uploadedAt: (uploadData as { uploadedAt?: string }).uploadedAt,
  }

  return updateResume(resumeId, { cvFile })
}
