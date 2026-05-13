"use client"

import { useCallback, useEffect, useReducer } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/animate-ui/components/radix/dialog"
import type { Job, JobBenefitInput } from "@/lib/api/jobs"
import { useCreateJobMutation, useUpdateJobMutation } from "@/lib/api/use-jobs"
import {
  BENEFIT_OPTIONS,
  JobBenefitsSelector,
  JobContractFields,
  JobDescriptionField,
  JobFormActions,
  JobFormHeader,
  JobLocationField,
  JobSalaryFields,
  JobTitleField,
} from "./create-job/form"

type JobFormState = {
  title: string
  description: string
  employmentType: string
  experienceLevel: string
  city: string
  country: string
  isRemote: boolean
  salaryMin: string
  salaryMax: string
  benefits: JobBenefitInput[]
  isGeneratingDescription: boolean
}

type JobFormAction =
  | { type: "SET_FIELD"; field: keyof JobFormState; value: JobFormState[keyof JobFormState] }
  | { type: "RESET" }
  | { type: "SET_ALL"; payload: Partial<JobFormState> }

const initialFormState: JobFormState = {
  title: "",
  description: "",
  employmentType: "",
  experienceLevel: "",
  city: "",
  country: "",
  isRemote: false,
  salaryMin: "",
  salaryMax: "",
  benefits: [],
  isGeneratingDescription: false,
}

function jobFormReducer(state: JobFormState, action: JobFormAction): JobFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET":
      return initialFormState
    case "SET_ALL":
      return { ...state, ...action.payload }
    default:
      return state
  }
}

type CreateJobDialogProps = {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
}

export function CreateJobDialog({ organizationId, open, onOpenChange, job }: CreateJobDialogProps) {
  const [form, dispatch] = useReducer(jobFormReducer, initialFormState)

  const createMutation = useCreateJobMutation(organizationId)
  const updateMutation = useUpdateJobMutation(organizationId)
  const isEdit = Boolean(job?.id)

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  const setField = useCallback(
    (field: keyof JobFormState, value: JobFormState[keyof JobFormState]) => {
      dispatch({ type: "SET_FIELD", field, value })
    },
    []
  )

  const parsedBenefits =
    (job?.benefits as { tipo?: string; title?: string }[] | undefined)?.reduce<JobBenefitInput[]>(
      (acc, b) => {
        const label = b.title ?? (b.tipo === "otro" ? "Otro" : b.tipo)
        if (label) {
          acc.push({ tipo: b.tipo || "otro", label })
        }
        return acc
      },
      []
    ) ?? []

  const effectiveTitle = job?.title ?? ""
  const effectiveDescription = job?.description ?? ""
  const effectiveEmploymentType = job?.employmentType ?? ""
  const effectiveExperienceLevel = job?.experienceLevel ?? ""
  const effectiveCity = job?.location?.city ?? ""
  const effectiveCountry = job?.location?.country ?? ""
  const effectiveIsRemote = job?.location?.isRemote ?? false
  const effectiveSalaryMin = job?.salary?.min != null ? String(job.salary.min) : ""
  const effectiveSalaryMax = job?.salary?.max != null ? String(job.salary.max) : ""
  const effectiveBenefits = job ? parsedBenefits : []

  useEffect(() => {
    if (!open) return
    if (job) {
      dispatch({
        type: "SET_ALL",
        payload: {
          title: effectiveTitle,
          description: effectiveDescription,
          employmentType: effectiveEmploymentType,
          experienceLevel: effectiveExperienceLevel,
          city: effectiveCity,
          country: effectiveCountry,
          isRemote: effectiveIsRemote,
          salaryMin: effectiveSalaryMin,
          salaryMax: effectiveSalaryMax,
          benefits: effectiveBenefits,
        },
      })
    } else {
      resetForm()
    }
  }, [
    open,
    job,
    effectiveTitle,
    effectiveDescription,
    effectiveEmploymentType,
    effectiveExperienceLevel,
    effectiveCity,
    effectiveCountry,
    effectiveIsRemote,
    effectiveSalaryMin,
    effectiveSalaryMax,
    effectiveBenefits,
    resetForm,
  ])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) resetForm()
      onOpenChange(next)
    },
    [onOpenChange, resetForm]
  )

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim()

  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    employmentType: form.employmentType,
    experienceLevel: form.experienceLevel,
    status: "active",
    location: {
      city: form.city.trim() || undefined,
      country: form.country.trim() || undefined,
      isRemote: form.isRemote,
      isHybrid: false,
    },
    salary:
      form.salaryMin || form.salaryMax
        ? {
            min: form.salaryMin ? Number(form.salaryMin) : undefined,
            max: form.salaryMax ? Number(form.salaryMax) : undefined,
            currency: "CLP",
            period: "monthly",
            isNegotiable: false,
          }
        : undefined,
    benefits: form.benefits.length > 0 ? form.benefits : undefined,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !form.title.trim() ||
      !stripHtml(form.description) ||
      !form.employmentType ||
      !form.experienceLevel
    )
      return

    if (isEdit && job) {
      updateMutation.mutate(
        { id: job.id, input: payload },
        {
          onSuccess: () => {
            handleOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          handleOpenChange(false)
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const canSubmit = !!(
    form.title.trim() &&
    stripHtml(form.description) &&
    form.employmentType &&
    form.experienceLevel
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <JobFormHeader isEdit={isEdit} />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <JobTitleField value={form.title} onChange={(v) => setField("title", v)} />

          <JobDescriptionField
            value={form.description}
            isGenerating={form.isGeneratingDescription}
            jobTitle={form.title}
            experienceLevel={form.experienceLevel}
            employmentType={form.employmentType}
            isRemote={form.isRemote}
            onChange={(v) => setField("description", v)}
            onGeneratingChange={(v) => setField("isGeneratingDescription", v)}
          />

          <JobContractFields
            employmentType={form.employmentType}
            experienceLevel={form.experienceLevel}
            onEmploymentTypeChange={(v) => setField("employmentType", v)}
            onExperienceLevelChange={(v) => setField("experienceLevel", v)}
          />

          <JobLocationField
            isRemote={form.isRemote}
            city={form.city}
            country={form.country}
            onRemoteChange={(v) => setField("isRemote", v)}
            onCityChange={(v) => setField("city", v)}
            onCountryChange={(v) => setField("country", v)}
          />

          <JobSalaryFields
            salaryMin={form.salaryMin}
            salaryMax={form.salaryMax}
            onSalaryMinChange={(v) => setField("salaryMin", v)}
            onSalaryMaxChange={(v) => setField("salaryMax", v)}
          />

          <JobBenefitsSelector
            benefits={form.benefits}
            onBenefitsChange={(v) => setField("benefits", v)}
          />

          {(createMutation.isError || updateMutation.isError) && (
            <p className="text-destructive text-sm">
              {(createMutation.error ?? updateMutation.error)?.message}
            </p>
          )}

          <JobFormActions
            isSubmitting={isSubmitting}
            isEdit={isEdit}
            canSubmit={canSubmit}
            onCancel={() => handleOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { BENEFIT_OPTIONS, type JobFormAction, type JobFormState }
