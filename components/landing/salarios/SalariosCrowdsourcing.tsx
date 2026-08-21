"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  GiftIcon,
  Loading01Icon,
  PlusSignIcon,
  Shield02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { type SalarySubmissionPayload, submitSalary } from "@/lib/api/salaries"
import {
  BENEFICIOS_CHILE,
  CARRERAS_STEM_CHILE,
  INDUSTRIAS_CHILE,
  MODALIDADES_TRABAJO_CHILE,
  NIVELES_EDUCACION_CHILE,
  NIVELES_EXPERIENCIA_CHILE,
  REGIONES_CHILE,
  SKILLS_IMPACTO_CHILE,
} from "@/lib/data/salarios-data"
import type { ExperienceLevelChile } from "@/lib/types/salarios"
import { cn, formatAmountCLP } from "@/lib/utils"

const TOTAL_STEPS = 3

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
      <section className="py-28 md:py-36 lg:py-48 bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
          >
            <Card className="rounded-xl border-0 shadow-none bg-surface-container-low p-6 sm:p-8 md:p-10 text-center">
              <div className="size-14 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center mx-auto mb-5">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
              </div>

              <h3 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                ¡Salario registrado exitosamente!
              </h3>

              <p className="text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Gracias por contribuir a la transparencia salarial del ecosistema científico en Chile. Tu aporte es 100% anónimo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  onClick={handleReset}
                  className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-1.5" />
                  Registrar otro sueldo
                </Button>
                <Button
                  variant="outline"
                  className="h-11 px-6 bg-surface-container-lowest border-border hover:bg-surface-container-high rounded-lg text-sm font-medium"
                  asChild
                >
                  <a href="/trabajos">Explorar ofertas de empleo</a>
                </Button>
              </div>
            </Card>
          </m.div>
        </div>
      </section>
    )
  }

  return (
    <section id="encuesta" className="py-28 md:py-36 lg:py-48 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Encuesta Salarial Anónima
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Comparte tu sueldo y{" "}
            <span className="text-accent font-semibold">apoya a la comunidad</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            100% anónimo y sin registro previo. Tu contribución ayuda a crear el primer dataset abierto de compensaciones científicas en Chile.
          </p>
        </m.div>

        {/* Form Container */}
        <Card className="rounded-xl border-0 shadow-none bg-surface-container-low p-6 sm:p-8 md:p-10">
          {/* Step Progress Header */}
          <div className="bg-surface-container-lowest rounded-xl p-5 md:p-6 mb-8 border border-border">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon icon={Shield02Icon} size={20} className="text-secondary shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                  Paso {step + 1} de {TOTAL_STEPS}: {step === 0 ? "Cargo y Ubicación" : step === 1 ? "Compensación" : "Formación y Habilidades"}
                </h3>
              </div>
              <span className="text-xs font-mono font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 shrink-0">
                {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
              <m.div
                className="h-full bg-secondary rounded-full"
                initial={false}
                animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
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
                <StepRole
                  form={form}
                  set={set}
                  setExperienceYears={setExperienceYears}
                />
              )}
              {step === 1 && (
                <StepCompensation
                  form={form}
                  set={set}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
              {step === 2 && (
                <StepEducation
                  form={form}
                  set={set}
                  toggleArrayItem={toggleArrayItem}
                />
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
                      <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin mr-1.5" />
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
  const skillOptions = useMemo(() => SKILLS_IMPACTO_CHILE.map((s) => s.skill), [])
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
        {optional && <span className="text-muted-foreground ml-1.5 text-xs font-normal">(opcional)</span>}
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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-border bg-surface-container-lowest px-3.5 pr-9 text-sm text-foreground",
          "focus:border-secondary outline-none transition-colors",
          value === "" && "text-muted-foreground"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
      />
    </div>
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
