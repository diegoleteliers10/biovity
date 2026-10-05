import { createHash } from "node:crypto"
import { Result as R, type Result } from "better-result"
import { z } from "zod"
import { sanitizeInput } from "@/lib/ai/sanitize"
import type { Application } from "@/lib/api/applications"
import type { Job } from "@/lib/api/jobs"
import type { Resume } from "@/lib/api/resumes"
import { JEV_MAX_CV_TEXT_LENGTH, JEV_MODEL_VERSION, JEV_RUBRIC_VERSION } from "./constants"
import type { CandidateAssessmentInput } from "./types"

const ProfileTextSchema = z.string().trim().max(5000)

function safeProfileText(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return ""
  const text = ProfileTextSchema.parse(value)
  sanitizeInput(text, "jev-assessment")
  return text
}

function jobSkills(job: Job): string[] {
  return (job.requiredSkills ?? []).flatMap((item) => {
    const safeItem = safeProfileText(item)
    return safeItem ? [safeItem] : []
  })
}

function resumeSkills(resume: Resume): string[] {
  return resume.skills.flatMap((skill) => {
    const name = typeof skill === "string" ? skill : skill.name
    const safeName = safeProfileText(name)
    return safeName ? [safeName] : []
  })
}

function snapshotExperiences(resume: Resume): Array<Record<string, string | boolean>> {
  return resume.experiences.flatMap((experience) => {
    const title = safeProfileText(experience.title ?? experience.position)
    const company = safeProfileText(experience.company)
    const description = safeProfileText(experience.description)
    const startDate = safeProfileText(experience.startDate ?? experience.startYear)
    const endDate = safeProfileText(experience.endDate ?? experience.endYear)
    const current = experience.current ?? experience.stillWorking
    const dates = { title, company, description, startDate, endDate }
    const entry = typeof current === "boolean" ? { ...dates, current } : dates
    return Object.values(dates).some(Boolean) ? [entry] : []
  })
}

function snapshotEducation(resume: Resume): Array<Record<string, string>> {
  return resume.education.flatMap((education) => {
    const degree = safeProfileText(education.degree ?? education.title)
    const institution = safeProfileText(education.institution ?? education.institute)
    const entry = { degree, institution }
    return Object.values(entry).some(Boolean) ? [entry] : []
  })
}

function snapshotCertifications(resume: Resume): string[] {
  return resume.certifications.flatMap((certification) => {
    const name = safeProfileText(certification.name ?? certification.title)
    const issuer = safeProfileText(certification.issuer ?? certification.company)
    const value = [name, issuer].filter(Boolean).join(" · ")
    return value ? [value] : []
  })
}

function snapshotLanguages(resume: Resume): string[] {
  return resume.languages.flatMap((language) => {
    const name = safeProfileText(language.name ?? language.language)
    const level = safeProfileText(language.level)
    const value = [name, level].filter(Boolean).join(" · ")
    return value ? [value] : []
  })
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`
  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`
  }
  return JSON.stringify(value) ?? "null"
}

export function prepareCandidateAssessment(args: {
  application: Application
  job: Job
  resume: Resume | null
  organizationId: string
  requestedBy: string
  cvText: string
}): Result<CandidateAssessmentInput, Error> {
  return R.try({
    try: () => {
      const { application, job, resume, organizationId, requestedBy } = args
      const jobSnapshot = {
        title: safeProfileText(job.title),
        description: safeProfileText(job.description),
        requiredSkills: jobSkills(job),
        minimumExperienceYears: job.minExperience ?? 0,
        experienceLevel: safeProfileText(job.experienceLevel),
        employmentType: safeProfileText(job.employmentType),
        modality: job.location?.isRemote
          ? "Remoto"
          : job.location?.isHybrid
            ? "Híbrido"
            : "Presencial",
      }
      const cvText = z.string().trim().max(JEV_MAX_CV_TEXT_LENGTH).parse(args.cvText)
      sanitizeInput(cvText, "jev-assessment")
      const candidateSnapshot = {
        cvText,
        summary: safeProfileText(resume?.summary),
        skills: resume ? resumeSkills(resume) : [],
        experiences: resume ? snapshotExperiences(resume) : [],
        education: resume ? snapshotEducation(resume) : [],
        certifications: resume ? snapshotCertifications(resume) : [],
        languages: resume ? snapshotLanguages(resume) : [],
      }
      const state = { job: jobSnapshot, candidate: candidateSnapshot }
      const fingerprint = createHash("sha256")
        .update(stableJson({ state, engine: JEV_MODEL_VERSION, rubric: JEV_RUBRIC_VERSION }))
        .digest("hex")
      return {
        applicationId: application.id,
        candidateId: application.candidateId,
        jobId: job.id,
        organizationId,
        requestedBy,
        fingerprint,
        jobSnapshot,
        candidateSnapshot,
      }
    },
    catch: (cause) => (cause instanceof Error ? cause : new Error("Candidate data is invalid")),
  })
}
