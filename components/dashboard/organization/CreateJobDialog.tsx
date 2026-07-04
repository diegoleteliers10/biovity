"use client"

import { useCallback, useEffect, useMemo, useReducer } from "react"
import { createPortal } from "react-dom"
import { Sheet, SheetContent, SheetHeader } from "@/components/animate-ui/components/radix/sheet"
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
import type { WorkMode } from "./create-job/form/JobLocationField"

type JobFormState = {
  title: string
  description: string
  employmentType: string
  experienceLevel: string
  city: string
  country: string
  workMode: WorkMode
  salaryMin: string
  salaryMax: string
  benefits: JobBenefitInput[]
  isGeneratingDescription: boolean
}

type JobFormAction =
  | { type: "SET_FIELD"; field: keyof JobFormState; value: JobFormState[keyof JobFormState] }
  | { type: "RESET" }
  | { type: "SET_ALL"; payload: Partial<JobFormState> }

const EMPTY_ARRAY: JobBenefitInput[] = []

const initialFormState: JobFormState = {
  title: "",
  description: "",
  employmentType: "",
  experienceLevel: "",
  city: "",
  country: "",
  workMode: "onsite",
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

  const parsedBenefits = useMemo(
    () =>
      (job?.benefits as { tipo?: string; title?: string }[] | undefined)?.reduce<JobBenefitInput[]>(
        (acc, b) => {
          const title = b.title ?? (b.tipo === "otro" ? "Otro" : b.tipo)
          if (title) {
            acc.push({ tipo: b.tipo || "otro", title })
          }
          return acc
        },
        []
      ) ?? EMPTY_ARRAY,
    [job?.benefits]
  )

  const effectiveTitle = job?.title ?? ""
  const effectiveDescription = job?.description ?? ""
  const effectiveEmploymentType = job?.employmentType ?? ""
  const effectiveExperienceLevel = job?.experienceLevel ?? ""
  const effectiveCity = job?.location?.city ?? ""
  const effectiveCountry = job?.location?.country ?? ""
  const effectiveWorkMode: WorkMode = job?.location?.isRemote
    ? "remote"
    : job?.location?.isHybrid
      ? "hybrid"
      : "onsite"
  const effectiveSalaryMin = job?.salary?.min != null ? String(job.salary.min) : ""
  const effectiveSalaryMax = job?.salary?.max != null ? String(job.salary.max) : ""
  const effectiveBenefits = job ? parsedBenefits : EMPTY_ARRAY

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
          workMode: effectiveWorkMode,
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
    effectiveWorkMode,
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
    location: {
      city: form.city.trim() || undefined,
      country: form.country.trim() || undefined,
      isRemote: form.workMode === "remote",
      isHybrid: form.workMode === "hybrid",
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
    <>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] bg-black/50 animate-in fade-in duration-200"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />,
          document.body
        )}
      <Sheet open={open} onOpenChange={handleOpenChange} modal={false}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg z-[120]"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement
            if (
              target.closest("[data-slot='select-content']") ||
              target.closest("[data-slot='combobox-content']")
            ) {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement
            if (
              target.closest("[data-slot='select-content']") ||
              target.closest("[data-slot='combobox-content']")
            ) {
              e.preventDefault()
            }
          }}
        >
          <SheetHeader>
            <JobFormHeader isEdit={isEdit} />
          </SheetHeader>

          <form
            key={job?.id ?? "new"}
            onSubmit={handleSubmit}
            className="space-y-4 overflow-y-auto px-4 pb-4"
          >
            <JobTitleField value={form.title} onChange={(v) => setField("title", v)} />

            <JobDescriptionField
              value={form.description}
              isGenerating={form.isGeneratingDescription}
              jobTitle={form.title}
              experienceLevel={form.experienceLevel}
              employmentType={form.employmentType}
              isRemote={form.workMode === "remote"}
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
              workMode={form.workMode}
              city={form.city}
              country={form.country}
              onWorkModeChange={(v) => setField("workMode", v)}
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
        </SheetContent>
      </Sheet>
    </>
  )
}

export { BENEFIT_OPTIONS, type JobFormAction, type JobFormState }
