"use client"

import {
  CheckmarkCircle01Icon,
  Edit01Icon,
  EyeIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useReducer, useState } from "react"
import { Sheet, SheetContent, SheetHeader } from "@/components/animate-ui/components/radix/sheet"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { JobTemplate } from "@/lib/api/job-templates"
import type { Job, JobBenefitInput } from "@/lib/api/jobs"
import { useLogActivityMutation } from "@/lib/api/use-activity-logs"
import { useCreateJobMutation, useUpdateJobMutation } from "@/lib/api/use-jobs"
import { useDashboardSession } from "../DashboardSessionContext"
import {
  BENEFIT_OPTIONS,
  JobBenefitsSelector,
  JobCategoryField,
  JobContractFields,
  JobDescriptionField,
  JobExpirationField,
  JobFormActions,
  JobFormHeader,
  JobLocationField,
  JobMinExperience,
  JobNegotiableSalary,
  JobRequiredSkills,
  JobSalaryFields,
  JobStatusField,
  JobTitleField,
} from "./create-job/form"
import type { WorkMode } from "./create-job/form/JobLocationField"
import { JobPreview } from "./create-job/JobPreview"
import { TemplatePanelButtons } from "./create-job/TemplatePanel"
import { QuestionsManager } from "./QuestionsManager"

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
  isNegotiable: boolean
  benefits: JobBenefitInput[]
  requiredSkills: string[]
  minExperience: number
  category: string
  status: string
  expiresAt: string
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
  isNegotiable: false,
  benefits: [],
  requiredSkills: [],
  minExperience: 0,
  category: "",
  status: "active",
  expiresAt: "",
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

function buildInitialJobFormState(job: Job | null | undefined): JobFormState {
  const benefits =
    (job?.benefits as { tipo?: string; title?: string }[] | undefined)?.reduce<JobBenefitInput[]>(
      (acc, b) => {
        const title = b.title ?? (b.tipo === "otro" ? "Otro" : b.tipo)
        if (title) {
          acc.push({ tipo: b.tipo || "otro", title })
        }
        return acc
      },
      []
    ) ?? EMPTY_ARRAY
  return {
    ...initialFormState,
    title: job?.title ?? "",
    description: job?.description ?? "",
    employmentType: job?.employmentType ?? "",
    experienceLevel: job?.experienceLevel ?? "",
    city: job?.location?.city ?? "",
    country: job?.location?.country ?? "",
    workMode: job?.location?.isRemote ? "remote" : job?.location?.isHybrid ? "hybrid" : "onsite",
    salaryMin: job?.salary?.min != null ? String(job.salary.min) : "",
    salaryMax: job?.salary?.max != null ? String(job.salary.max) : "",
    isNegotiable: job?.salary?.isNegotiable ?? false,
    benefits,
    requiredSkills: job?.requiredSkills ?? [],
    minExperience: job?.minExperience ?? 0,
    category: job?.category ?? "",
    status: job?.status ?? "active",
    expiresAt: job?.expiresAt ? job.expiresAt.slice(0, 10) : "",
  }
}

type ActiveTab = "edit" | "preview" | "questions"

type CreateJobDialogProps = {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
}

export function CreateJobDialog({ organizationId, open, onOpenChange, job }: CreateJobDialogProps) {
  const [form, dispatch] = useReducer(jobFormReducer, job, buildInitialJobFormState)
  const [activeTab, setActiveTab] = useState<ActiveTab>("edit")
  // After creation, store the new job ID to show the questions step
  const [createdJobId, setCreatedJobId] = useState<string | null>(null)

  const createMutation = useCreateJobMutation(organizationId)
  const updateMutation = useUpdateJobMutation(organizationId)
  const logActivityMutation = useLogActivityMutation(organizationId)
  const session = useDashboardSession()
  const recruiterId = session?.user?.id ?? ""
  const { completeStep } = useOnboarding()
  const isEdit = Boolean(job?.id)

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET" })
    setActiveTab("edit")
    setCreatedJobId(null)
  }, [])

  const setField = useCallback(
    (field: keyof JobFormState, value: JobFormState[keyof JobFormState]) => {
      dispatch({ type: "SET_FIELD", field, value })
    },
    []
  )

  // Load template into the form
  const handleLoadTemplate = useCallback((template: JobTemplate) => {
    const workMode: WorkMode = template.location?.isRemote
      ? "remote"
      : template.location?.isHybrid
        ? "hybrid"
        : "onsite"
    dispatch({
      type: "SET_ALL",
      payload: {
        title: template.title ?? "",
        description: template.description ?? "",
        employmentType: template.employmentType ?? "",
        experienceLevel: template.experienceLevel ?? "",
        city: template.location?.city ?? "",
        country: template.location?.country ?? "",
        workMode,
        salaryMin: template.salary?.min != null ? String(template.salary.min) : "",
        salaryMax: template.salary?.max != null ? String(template.salary.max) : "",
        isNegotiable: template.salary?.isNegotiable ?? false,
        benefits: template.benefits ?? [],
        requiredSkills: template.requiredSkills ?? [],
        minExperience: template.minExperience ?? 0,
        category: template.category ?? "",
      },
    })
    setActiveTab("edit")
  }, [])

  const parsedBenefitsRemoved = null

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
      form.isNegotiable || form.salaryMin || form.salaryMax
        ? {
            min: form.salaryMin ? Number(form.salaryMin) : undefined,
            max: form.salaryMax ? Number(form.salaryMax) : undefined,
            currency: "CLP",
            period: "monthly",
            isNegotiable: form.isNegotiable,
          }
        : undefined,
    benefits: form.benefits.length > 0 ? form.benefits : undefined,
    requiredSkills: form.requiredSkills.length > 0 ? form.requiredSkills : undefined,
    minExperience: form.minExperience > 0 ? form.minExperience : undefined,
    category: form.category || undefined,
    status: form.status,
    expiresAt: form.expiresAt || undefined,
  }

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = "El título es requerido"
    if (!stripHtml(form.description)) e.description = "La descripción es requerida"
    if (!form.employmentType) e.employmentType = "Selecciona un tipo de empleo"
    if (!form.experienceLevel) e.experienceLevel = "Selecciona un nivel de experiencia"
    if (
      !form.isNegotiable &&
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    )
      e.salary = "El salario mínimo debe ser menor o igual al máximo"
    if (!form.workMode) e.location = "Selecciona un modo de trabajo"
    return e
  }, [form])

  const canSubmit = Object.keys(errors).length === 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    if (isEdit && job) {
      updateMutation.mutate(
        { id: job.id, input: payload },
        {
          onSuccess: () => {
            if (recruiterId) {
              logActivityMutation.mutate({
                userId: recruiterId,
                action: "job.updated",
                description: `Actualizó la oferta de trabajo "${payload.title}"`,
              })
            }
            handleOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: (newJob) => {
          completeStep.mutate("create_offer")
          if (recruiterId) {
            logActivityMutation.mutate({
              userId: recruiterId,
              action: "job.created",
              description: `Publicó la oferta de trabajo "${newJob.title}"`,
            })
          }
          // For new offers: show the questions step instead of closing
          setCreatedJobId(newJob.id)
          setActiveTab("questions")
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const tabs: { id: ActiveTab; label: string; icon: typeof Edit01Icon }[] = [
    { id: "edit", label: "Editar", icon: Edit01Icon },
    { id: "preview", label: "Vista previa", icon: EyeIcon },
    ...(createdJobId || (isEdit && job?.id)
      ? [{ id: "questions" as ActiveTab, label: "Preguntas", icon: HelpCircleIcon }]
      : []),
  ]

  const activeJobId = createdJobId ?? (isEdit ? job?.id : null)

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange} modal={true}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg z-[120] flex flex-col"
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

          {/* Tab navigation */}
          <div className="flex items-center gap-1 border-b border-border/60 px-4 pt-1 pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors rounded-t-md border-b-2 ${
                  activeTab === tab.id
                    ? "border-secondary text-secondary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <HugeiconsIcon icon={tab.icon} size={13} strokeWidth={1.5} />
                {tab.label}
                {tab.id === "questions" && createdJobId && (
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    size={12}
                    strokeWidth={1.5}
                    className="text-secondary"
                  />
                )}
              </button>
            ))}

            {/* Template buttons pushed to right */}
            {activeTab === "edit" && (
              <div className="ml-auto pb-1">
                <TemplatePanelButtons
                  organizationId={organizationId}
                  formData={form}
                  onLoad={handleLoadTemplate}
                />
              </div>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "edit" && (
            <form
              key={job?.id ?? "new"}
              onSubmit={handleSubmit}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              <JobTitleField
                value={form.title}
                onChange={(v) => setField("title", v)}
                error={errors.title}
              />

              <JobDescriptionField
                value={form.description}
                isGenerating={form.isGeneratingDescription}
                jobTitle={form.title}
                experienceLevel={form.experienceLevel}
                employmentType={form.employmentType}
                isRemote={form.workMode === "remote"}
                onChange={(v) => setField("description", v)}
                onGeneratingChange={(v) => setField("isGeneratingDescription", v)}
                error={errors.description}
              />

              <JobContractFields
                employmentType={form.employmentType}
                experienceLevel={form.experienceLevel}
                onEmploymentTypeChange={(v) => setField("employmentType", v)}
                onExperienceLevelChange={(v) => setField("experienceLevel", v)}
                errorEmploymentType={errors.employmentType}
                errorExperienceLevel={errors.experienceLevel}
              />

              <JobLocationField
                workMode={form.workMode}
                city={form.city}
                country={form.country}
                onWorkModeChange={(v) => setField("workMode", v)}
                onCityChange={(v) => setField("city", v)}
                onCountryChange={(v) => setField("country", v)}
                error={errors.location}
              />

              <JobSalaryFields
                salaryMin={form.salaryMin}
                salaryMax={form.salaryMax}
                onSalaryMinChange={(v) => setField("salaryMin", v)}
                onSalaryMaxChange={(v) => setField("salaryMax", v)}
                error={errors.salary}
              />

              <JobRequiredSkills
                skills={form.requiredSkills}
                onSkillsChange={(v) => setField("requiredSkills", v)}
              />

              <JobMinExperience
                value={form.minExperience}
                onChange={(v) => setField("minExperience", v)}
              />

              <JobNegotiableSalary
                checked={form.isNegotiable}
                onCheckedChange={(v) => setField("isNegotiable", v)}
              />

              <JobCategoryField value={form.category} onChange={(v) => setField("category", v)} />

              <div className="grid grid-cols-2 gap-3">
                <JobStatusField value={form.status} onChange={(v) => setField("status", v)} />
                <JobExpirationField
                  value={form.expiresAt}
                  onChange={(v) => setField("expiresAt", v)}
                />
              </div>

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
          )}

          {activeTab === "preview" && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-3 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2">
                <p className="text-xs text-secondary font-medium">
                  Vista previa — así verá el candidato esta oferta
                </p>
              </div>
              <JobPreview
                title={form.title}
                description={form.description}
                employmentType={form.employmentType}
                experienceLevel={form.experienceLevel}
                workMode={form.workMode}
                city={form.city}
                country={form.country}
                salaryMin={form.salaryMin}
                salaryMax={form.salaryMax}
                isNegotiable={form.isNegotiable}
                benefits={form.benefits}
                requiredSkills={form.requiredSkills}
                minExperience={form.minExperience}
                category={form.category}
                status={form.status}
                expiresAt={form.expiresAt}
              />
              {/* CTA to go back and submit */}
              {!isEdit && !createdJobId && (
                <div className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("edit")}>
                    Seguir editando
                  </Button>
                  <Button
                    type="button"
                    disabled={!canSubmit || isSubmitting}
                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                  >
                    {isSubmitting ? "Publicando…" : "Publicar oferta"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "questions" && activeJobId && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-3 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2">
                <p className="text-xs text-secondary font-medium">
                  {createdJobId
                    ? "¡Oferta creada! Ahora puedes agregar preguntas para los postulantes."
                    : "Gestiona las preguntas para los postulantes de esta oferta."}
                </p>
              </div>
              <QuestionsManager jobId={activeJobId} organizationId={organizationId} />
              {createdJobId && (
                <div className="mt-4 flex justify-end">
                  <Button type="button" onClick={() => handleOpenChange(false)}>
                    Finalizar
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export { BENEFIT_OPTIONS, type JobFormAction, type JobFormState }
