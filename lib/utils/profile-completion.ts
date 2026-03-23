import type { Resume } from "@/lib/api/resumes"
import type { User } from "@/lib/api/users"

const TOTAL = 13

function hasSkill(s: string | { name?: string }): boolean {
  if (typeof s === "string") return s.trim().length > 0
  return Boolean(s.name?.trim())
}

function hasExperience(e: unknown): boolean {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  const v = (k: string) => (typeof o[k] === "string" ? (o[k] as string).trim() : "")
  return v("company").length > 0 || v("title").length > 0 || v("position").length > 0
}

function hasEducation(e: unknown): boolean {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  const v = (k: string) => (typeof o[k] === "string" ? (o[k] as string).trim() : "")
  return (
    v("institution").length > 0 ||
    v("institute").length > 0 ||
    v("degree").length > 0 ||
    v("title").length > 0
  )
}

function hasLanguage(l: unknown): boolean {
  if (!l || typeof l !== "object") return false
  const o = l as Record<string, unknown>
  const v = (k: string) => (typeof o[k] === "string" ? (o[k] as string).trim() : "")
  return v("name").length > 0 || v("language").length > 0
}

export function computeProfileCompletion(
  user: User | null | undefined,
  resume: Resume | null | undefined
): { percentage: number; isComplete: boolean } | null {
  if (!user) return null

  const checks = [
    Boolean(user.avatar?.trim()),
    Boolean(user.name?.trim()),
    Boolean(user.email?.trim()),
    Boolean(user.phone?.trim()),
    Boolean(user.location && (user.location.city?.trim() || user.location.country?.trim())),
    Boolean(user.birthday?.trim()),
    Boolean(user.profession?.trim()),
    Boolean(resume?.cvFile?.url?.trim()),
    Boolean(resume?.summary?.trim()),
    Array.isArray(resume?.skills) && resume.skills.length > 0 && resume.skills.some(hasSkill),
    Array.isArray(resume?.experiences) &&
      resume.experiences.length > 0 &&
      resume.experiences.some(hasExperience),
    Array.isArray(resume?.education) &&
      resume.education.length > 0 &&
      resume.education.some(hasEducation),
    Array.isArray(resume?.languages) &&
      resume.languages.length > 0 &&
      resume.languages.some(hasLanguage),
  ]

  const filled = checks.filter(Boolean).length
  const percentage = Math.round((filled / TOTAL) * 100)
  const isComplete = filled === TOTAL
  return { percentage, isComplete }
}
