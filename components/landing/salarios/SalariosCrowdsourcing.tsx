"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  GiftIcon,
  Loading01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type SalarySubmissionPayload, submitSalary } from "@/lib/api/salaries"
import {
  BENEFICIOS_CHILE,
  CARRERAS_STEM_CHILE,
  HABILIDADES_CIENCIA_CHILE,
  INDUSTRIAS_CHILE,
  MODALIDADES_TRABAJO_CHILE,
  NIVELES_EDUCACION_CHILE,
  NIVELES_EXPERIENCIA_CHILE,
  REGIONES_CHILE,
} from "@/lib/data/salarios-data"
import type { ExperienceLevelChile } from "@/lib/types/salarios"
import { cn, formatAmountCLP } from "@/lib/utils"

const TOTAL_STEPS = 3
const STEP_TITLES = ["Cargo y ubicación", "Compensación", "Formación y habilidades"]
const STEP_DETAILS = [
  "Tu perfil y lugar de trabajo",
  "Sueldo líquido y beneficios",
  "Estudios y técnicas principales",
]

type FormState = {
  profession: string
  industry: string
  experienceYears: string
  experienceLevel: ExperienceLevelChile | ""
  region: string
  workMode: string
  monthlySalaryClp: string
  annualBonusClp: string
  benefits: string[]
  skills: string[]
  educationLevel: string
}

const INITIAL_STATE: FormState = {
  profession: "",
  industry: "",
  experienceYears: "",
  experienceLevel: "",
  region: "",
  workMode: "",
  monthlySalaryClp: "",
  annualBonusClp: "",
  benefits: [],
  skills: [],
  educationLevel: "",
}

function levelFromYears(years: number): ExperienceLevelChile {
  if (years <= 2) return "JUNIOR"
  if (years <= 5) return "MID"
  if (years <= 8) return "SENIOR"
  return "LEAD"
}

export function SalariosCrowdsourcing() {
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const setExperienceYears = (raw: string) => {
    const years = Number(raw)
    setForm((prev) => ({
      ...prev,
      experienceYears: raw,
      experienceLevel: years >= 0 && years <= 50 ? levelFromYears(years) : prev.experienceLevel,
    }))
  }

  const toggleArrayItem = (key: "benefits" | "skills", value: string) => {
    setForm((prev) => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const stepValid = useMemo(() => {
    if (step === 0) {
      return (
        form.profession !== "" &&
        form.industry !== "" &&
        form.experienceYears !== "" &&
        Number(form.experienceYears) >= 0 &&
        form.region !== "" &&
        form.workMode !== ""
      )
    }
    if (step === 1) {
      return Number(form.monthlySalaryClp) >= 300000
    }
    return form.educationLevel !== ""
  }, [step, form])

  const handleNext = () => {
    setError(null)
    if (!stepValid) {
      setError("Completa los campos requeridos para continuar.")
      return
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  const handleBack = () => {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    const payload: SalarySubmissionPayload = {
      profession: form.profession,
      industry: form.industry,
      experienceYears: Number(form.experienceYears),
      experienceLevel: form.experienceLevel as SalarySubmissionPayload["experienceLevel"],
      educationLevel: form.educationLevel as SalarySubmissionPayload["educationLevel"],
      region: form.region,
      workMode: form.workMode as SalarySubmissionPayload["workMode"],
      monthlySalaryClp: Number(form.monthlySalaryClp),
      annualBonusClp: form.annualBonusClp ? Number(form.annualBonusClp) : 0,
      benefits: form.benefits,
      skills: form.skills,
    }

    const result = await submitSalary(payload)

    if (result.isErr()) {
      setIsSubmitting(false)
      setError(result.error.message ?? "Error al registrar. Intenta de nuevo.")
      return
    }

    setIsSubmitting(false)
    setIsCompleted(true)
  }

  const handleReset = () => {
    setForm(INITIAL_STATE)
    setStep(0)
    setError(null)
    setIsCompleted(false)
  }

  if (isCompleted) {
    return (
      <section className="bg-surface-container-lowest px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:self-center">
            <p className="mb-5 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
              Registro salarial · Chile
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-foreground text-balance sm:text-5xl">
              Un sueldo también es un <span className="text-accent">dato.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Comparte tu sueldo líquido y el contexto de tu trayectoria. Tu aporte anónimo ayuda a
              formar referencias salariales para las ciencias en Chile.
            </p>
          </div>
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.35, ease: "easeOut" }}
            className="rounded-xl border border-border bg-surface-container-low p-5 shadow-none sm:p-6 lg:col-span-7 lg:self-center lg:p-8"
            role="status"
          >
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-secondary/20 bg-secondary/10 text-secondary">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
            </div>
            <p className="mb-2 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
              Aporte recibido
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Tu referencia ya está registrada.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Gracias por contribuir a la transparencia salarial del ecosistema científico en Chile.
              Tu aporte es 100% anónimo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleReset}
                className="h-11 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-1.5" />
                Registrar otro sueldo
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-lg border-border bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-high"
                asChild
              >
                <a href="/jobs">Explorar ofertas de empleo</a>
              </Button>
            </div>
          </m.div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="encuesta"
      className="bg-surface-container-lowest px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:pb-24"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:self-center">
          <m.div initial={false} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-5 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
              Datos de compensación · Ciencias en Chile
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              Un sueldo también es un <span className="text-accent">dato.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Comparte tu sueldo líquido y el contexto de tu trayectoria. Tu aporte anónimo ayuda a
              formar referencias salariales para las ciencias en Chile.
            </p>
          </m.div>

          <ol className="relative mt-9 space-y-1 before:absolute before:bottom-7 before:left-[15px] before:top-7 before:w-px before:bg-border">
            {STEP_TITLES.map((title, index) => {
              const isCurrent = step === index
              const isComplete = step > index

              return (
                <li
                  key={title}
                  aria-current={isCurrent ? "step" : undefined}
                  className="relative flex items-center gap-4 py-2.5"
                >
                  <span
                    className={cn(
                      "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-surface-container-lowest font-mono text-xs tabular-nums transition-colors",
                      isCurrent
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : isComplete
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {STEP_DETAILS[index]}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="lg:col-span-7 lg:self-center">
          <Card className="rounded-xl border border-border bg-surface-container-low p-5 shadow-none sm:p-6 lg:p-8">
            <div className="mb-7">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
                    Ficha salarial
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {STEP_TITLES[step]}
                  </h2>
                </div>
                <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-muted-foreground">
                  0{step + 1} <span className="text-border">/</span> 0{TOTAL_STEPS}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Avance del formulario"
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-valuenow={step + 1}
                aria-valuetext={`Etapa ${step + 1} de ${TOTAL_STEPS}`}
                className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest"
              >
                <m.div
                  className="h-full origin-left rounded-full bg-secondary"
                  initial={false}
                  animate={{ scaleX: (step + 1) / TOTAL_STEPS }}
                  transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: "easeOut" }}
                />
              </div>
            </div>

            <div>
              <m.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reducedMotion ? 0.01 : 0.25, ease: "easeOut" }}
              >
                {step === 0 && (
                  <StepRole form={form} set={set} setExperienceYears={setExperienceYears} />
                )}
                {step === 1 && (
                  <StepCompensation form={form} set={set} toggleArrayItem={toggleArrayItem} />
                )}
                {step === 2 && (
                  <StepEducation form={form} set={set} toggleArrayItem={toggleArrayItem} />
                )}
              </m.div>

              {error && (
                <p className="text-sm text-destructive mt-4 font-medium" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 pt-6 border-t border-border/60">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="h-11 px-5 rounded-lg border-border bg-surface-container-lowest text-sm font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1.5" />
                    Atrás
                  </Button>
                ) : (
                  <span />
                )}

                {step < TOTAL_STEPS - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!stepValid}
                    className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                  >
                    Continuar
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !stepValid}
                    className="h-11 px-6 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <HugeiconsIcon
                          icon={Loading01Icon}
                          size={16}
                          className="animate-spin mr-1.5"
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={GiftIcon} size={16} className="mr-1.5" />
                        Registrar salario
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <p className="text-center text-xs font-mono text-muted-foreground mt-6">
            Nunca guardamos tu correo ni información identificable.
          </p>
        </div>
      </div>
    </section>
  )
}

type StepProps = {
  form: FormState
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  setExperienceYears?: (raw: string) => void
  toggleArrayItem?: (key: "benefits" | "skills", value: string) => void
}

function StepRole({ form, set, setExperienceYears }: StepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Carrera / Profesión" required>
        <StyledSelect
          value={form.profession}
          onChange={(v) => set("profession", v)}
          placeholder="Selecciona tu carrera"
          options={CARRERAS_STEM_CHILE}
        />
      </Field>
      <Field label="Industria" required>
        <StyledSelect
          value={form.industry}
          onChange={(v) => set("industry", v)}
          placeholder="Selecciona la industria"
          options={INDUSTRIAS_CHILE}
        />
      </Field>
      <Field
        label="Años de experiencia"
        required
        hint={
          form.experienceLevel
            ? `Nivel sugerido: ${
                NIVELES_EXPERIENCIA_CHILE.find((n) => n.value === form.experienceLevel)?.label
              }`
            : undefined
        }
      >
        <Input
          type="number"
          min={0}
          max={50}
          inputMode="numeric"
          value={form.experienceYears}
          onChange={(e) => setExperienceYears?.(e.target.value)}
          placeholder="Ej. 4"
          className="h-11 px-3.5 bg-surface-container-lowest text-sm rounded-lg border-border font-mono"
        />
      </Field>
      <Field label="Región de Chile" required>
        <StyledSelect
          value={form.region}
          onChange={(v) => set("region", v)}
          placeholder="Selecciona tu región"
          options={REGIONES_CHILE}
        />
      </Field>
      <Field label="Modalidad de trabajo" required className="md:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MODALIDADES_TRABAJO_CHILE.map((opt) => (
            <ChipToggle
              key={opt.value}
              label={opt.label}
              selected={form.workMode === opt.value}
              onClick={() => set("workMode", opt.value)}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}

function StepCompensation({ form, set, toggleArrayItem }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Sueldo líquido mensual (CLP)" required>
          <Input
            type="number"
            min={0}
            step={10000}
            inputMode="numeric"
            value={form.monthlySalaryClp}
            onChange={(e) => set("monthlySalaryClp", e.target.value)}
            placeholder="Ej. 1800000"
            className="h-11 px-3.5 bg-surface-container-lowest text-sm rounded-lg border-border font-mono"
          />
          {form.monthlySalaryClp !== "" && Number(form.monthlySalaryClp) > 0 && (
            <p className="mt-1.5 text-xs text-secondary font-mono font-medium">
              {formatAmountCLP(Number(form.monthlySalaryClp))} / mes
            </p>
          )}
        </Field>
        <Field label="Bono anual aproximado (CLP)" optional>
          <Input
            type="number"
            min={0}
            step={50000}
            inputMode="numeric"
            value={form.annualBonusClp}
            onChange={(e) => set("annualBonusClp", e.target.value)}
            placeholder="Ej. 2000000"
            className="h-11 px-3.5 bg-surface-container-lowest text-sm rounded-lg border-border font-mono"
          />
        </Field>
      </div>

      <Field label="Beneficios incluidos" optional>
        <div className="flex flex-wrap gap-2 pt-1">
          {BENEFICIOS_CHILE.map((opt) => (
            <ChipToggle
              key={opt.value}
              label={opt.label}
              selected={form.benefits.includes(opt.value)}
              onClick={() => toggleArrayItem?.("benefits", opt.value)}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}

function StepEducation({ form, set, toggleArrayItem }: StepProps) {
  const skillOptions = HABILIDADES_CIENCIA_CHILE
  return (
    <div className="space-y-6">
      <Field label="Nivel educativo máximo" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {NIVELES_EDUCACION_CHILE.map((opt) => (
            <ChipToggle
              key={opt.value}
              label={opt.label}
              selected={form.educationLevel === opt.value}
              onClick={() => set("educationLevel", opt.value)}
            />
          ))}
        </div>
      </Field>

      <Field label="Habilidades y técnicas principales" optional>
        <div className="flex flex-wrap gap-2 pt-1">
          {skillOptions.map((label) => (
            <ChipToggle
              key={label}
              label={label}
              selected={form.skills.includes(label)}
              onClick={() => toggleArrayItem?.("skills", label)}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}

function Field({
  label,
  required,
  optional,
  hint,
  className,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <span className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-secondary ml-1">*</span>}
        {optional && (
          <span className="text-muted-foreground ml-1.5 text-xs font-normal">(opcional)</span>
        )}
      </span>
      {children}
      {hint && <p className="mt-1.5 text-xs font-mono text-muted-foreground">{hint}</p>}
    </div>
  )
}

function StyledSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <Select
      value={value || "select-placeholder"}
      onValueChange={(nextValue) => onChange(nextValue === "select-placeholder" ? "" : nextValue)}
    >
      <SelectTrigger
        aria-label={placeholder}
        className={cn(
          "h-11 w-full rounded-lg border-border bg-surface-container-lowest px-3.5 pr-1 text-sm text-foreground focus-visible:border-secondary",
          value === "" && "text-muted-foreground"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="select-placeholder" disabled>
          {placeholder}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ChipToggle({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer",
        selected
          ? "border-secondary bg-secondary/10 text-secondary font-semibold"
          : "border-border bg-surface-container-lowest text-muted-foreground hover:border-secondary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
