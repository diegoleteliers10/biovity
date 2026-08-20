"use client"

import { ArrowDown01Icon, Edit01Icon, EyeIcon, HelpCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useReducer, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader } from "@/components/animate-ui/components/radix/sheet"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ComboboxPortalContainer } from "@/components/ui/combobox"
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
  JobRequiredSkills,
  JobSalaryFields,
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
  region: string
  country: string
  workMode: WorkMode
  salaryMin: string
  salaryMax: string
  benefits: JobBenefitInput[]
  requiredSkills: string[]
  minExperience: number
  category: string
  expiresAt: string
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
  region: "",
  country: "",
  workMode: "onsite",
  salaryMin: "",
  salaryMax: "",
  benefits: [],
  requiredSkills: [],
  minExperience: 0,
  category: "",
  expiresAt: "",
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
    region: job?.location?.state ?? "",
    country: job?.location?.country ?? "",
    workMode: job?.location?.isRemote ? "remote" : job?.location?.isHybrid ? "hybrid" : "onsite",
    salaryMin: job?.salary?.min != null ? String(job.salary.min) : "",
    salaryMax: job?.salary?.max != null ? String(job.salary.max) : "",
    benefits,
    requiredSkills: job?.requiredSkills ?? [],
    minExperience: job?.minExperience ?? 0,
    category: job?.category ?? "",
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
  const [detailsOpen, setDetailsOpen] = useState(false)
  const publishSucceededRef = useRef(false)

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
        region: template.location?.state ?? "",
        country: template.location?.country ?? "",
        workMode,
        salaryMin: template.salary?.min != null ? String(template.salary.min) : "",
        salaryMax: template.salary?.max != null ? String(template.salary.max) : "",
        benefits: template.benefits ?? [],
        requiredSkills: template.requiredSkills ?? [],
        minExperience: template.minExperience ?? 0,
        category: template.category ?? "",
      },
    })
    setActiveTab("edit")
  }, [])

  const stripHtml = useCallback((html: string) => html.replace(/<[^>]*>/g, "").trim(), [])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = "required"
    if (!stripHtml(form.description)) e.description = "required"
    if (!form.salaryMin.trim()) e.salary = "required"
    else if (form.salaryMax.trim() && Number(form.salaryMin) > Number(form.salaryMax))
      e.salary = "El sueldo mínimo debe ser menor o igual al máximo"
    if (!form.category) e.category = "required"
    return e
  }, [form, stripHtml])

  const canSubmit = Object.keys(errors).length === 0

  const buildPayload = useCallback(
    (status: string) => ({
      title: form.title.trim(),
      description: form.description.trim(),
      employmentType: form.employmentType || undefined,
      experienceLevel: form.experienceLevel || undefined,
      location: {
        city: form.city.trim() || undefined,
        state: form.region.trim() || undefined,
        country: form.country.trim() || undefined,
        isRemote: form.workMode === "remote",
        isHybrid: form.workMode === "hybrid",
      },
      salary: form.salaryMin.trim()
        ? {
            min: Number(form.salaryMin),
            ...(form.salaryMax.trim() ? { max: Number(form.salaryMax) } : {}),
            currency: "CLP",
            period: "monthly",
          }
        : {},
      benefits: form.benefits.length > 0 ? form.benefits : undefined,
      requiredSkills: form.requiredSkills.length > 0 ? form.requiredSkills : undefined,
      minExperience: form.minExperience > 0 ? form.minExperience : undefined,
      category: form.category || undefined,
      status,
      expiresAt: form.expiresAt || undefined,
    }),
    [form]
  )

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const payload = buildPayload("active")

    if (isEdit && job) {
      updateMutation.mutate(
        { id: job.id, input: payload },
        {
          onSuccess: () => {
            if (recruiterId) {
              logActivityMutation.mutate({
                userId: recruiterId,
                action: "job.updated",
                description: `Publicó la oferta de trabajo "${payload.title}"`,
              })
            }
            handleOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: (newJob) => {
          publishSucceededRef.current = true
          completeStep.mutate("create_offer")
          if (recruiterId) {
            logActivityMutation.mutate({
              userId: recruiterId,
              action: "job.created",
              description: `Publicó la oferta de trabajo "${newJob.title}"`,
            })
          }
          handleOpenChange(false)
        },
      })
    }
  }

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        publishSucceededRef.current = false
        onOpenChange(true)
        return
      }
      if (!isEdit && !publishSucceededRef.current && !isSubmitting && form.title.trim()) {
        createMutation.mutate(buildPayload("draft"))
      }
      resetForm()
      onOpenChange(false)
    },
    [isEdit, isSubmitting, form.title, createMutation, buildPayload, onOpenChange, resetForm]
  )

  const tabs: { id: ActiveTab; label: string; icon: typeof Edit01Icon }[] = [
    { id: "edit", label: "Editar", icon: Edit01Icon },
    { id: "preview", label: "Vista previa", icon: EyeIcon },
    ...(isEdit && job?.id
      ? [{ id: "questions" as ActiveTab, label: "Preguntas", icon: HelpCircleIcon }]
      : []),
  ]

  const activeJobId = isEdit ? job?.id : null

  return (
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
        <ComboboxPortalContainer>
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
              <JobTitleField value={form.title} onChange={(v) => setField("title", v)} />

              <JobDescriptionField
                value={form.description}
                onChange={(v) => setField("description", v)}
              />

              <JobSalaryFields
                salaryMin={form.salaryMin}
                salaryMax={form.salaryMax}
                onSalaryMinChange={(v) => setField("salaryMin", v)}
                onSalaryMaxChange={(v) => setField("salaryMax", v)}
                error={errors.salary !== "required" ? errors.salary : undefined}
              />

              <JobCategoryField value={form.category} onChange={(v) => setField("category", v)} />

              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    <span>Más detalles (opcional)</span>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={15}
                      className={`transition-transform duration-200 ${detailsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <JobContractFields
                    employmentType={form.employmentType}
                    experienceLevel={form.experienceLevel}
                    onEmploymentTypeChange={(v) => setField("employmentType", v)}
                    onExperienceLevelChange={(v) => setField("experienceLevel", v)}
                  />

                  <JobLocationField
                    workMode={form.workMode}
                    city={form.city}
                    region={form.region}
                    country={form.country}
                    onWorkModeChange={(v) => setField("workMode", v)}
                    onCityChange={(v) => setField("city", v)}
                    onRegionChange={(v) => setField("region", v)}
                    onCountryChange={(v) => setField("country", v)}
                  />

                  <JobRequiredSkills
                    skills={form.requiredSkills}
                    onSkillsChange={(v) => setField("requiredSkills", v)}
                  />

                  <JobMinExperience
                    value={form.minExperience}
                    onChange={(v) => setField("minExperience", v)}
                  />

                  <JobExpirationField
                    value={form.expiresAt}
                    onChange={(v) => setField("expiresAt", v)}
                  />

                  <JobBenefitsSelector
                    benefits={form.benefits}
                    onBenefitsChange={(v) => setField("benefits", v)}
                  />
                </CollapsibleContent>
              </Collapsible>

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
                region={form.region}
                country={form.country}
                salaryMin={form.salaryMin}
                salaryMax={form.salaryMax}
                benefits={form.benefits}
                requiredSkills={form.requiredSkills}
                minExperience={form.minExperience}
                category={form.category}
                expiresAt={form.expiresAt}
              />
              {/* CTA to go back and submit */}
              {!isEdit && (
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
                  Gestiona las preguntas para los postulantes de esta oferta.
                </p>
              </div>
              <QuestionsManager jobId={activeJobId} organizationId={organizationId} />
            </div>
          )}
        </ComboboxPortalContainer>
      </SheetContent>
    </Sheet>
  )
}

export { BENEFIT_OPTIONS, type JobFormAction, type JobFormState }
