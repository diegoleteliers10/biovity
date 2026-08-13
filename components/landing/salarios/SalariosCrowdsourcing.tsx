"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  GiftIcon,
  Loading01Icon,
  LockKeyIcon,
  Shield02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useEffect, useMemo, useState } from "react"
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

const STORAGE_KEY = "biovity:salary:submitted"
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
  const [percentile, setPercentile] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setSubmitted(true)
    }
  }, [])

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

    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1")
    setPercentile(result.value.percentile)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <UnlockedInsights percentile={percentile} monthlyClp={Number(form.monthlySalaryClp) || 0} />
    )
  }

  return (
    <section id="encuesta" className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-4">
            <HugeiconsIcon icon={GiftIcon} size={16} />
            Give to Get — Encuesta anónima
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Comparte tu sueldo y{" "}
            <span className="text-accent font-semibold">desbloquea insights</span> del mercado
            chileno
          </h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            100% anónimo, sin registro. Tres pasos rápidos y verás en qué percentil estás respecto a
            tu especialidad, región y nivel.
          </p>
        </m.div>

        <Card className="rounded-2xl border-0 shadow-none bg-surface-container-low p-4 sm:p-6 md:p-8">
          {/* Recuadro Verde del Formulario */}
          <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <HugeiconsIcon icon={Shield02Icon} size={22} className="text-secondary shrink-0" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                  Encuesta salarial Chile (CLP)
                </h3>
              </div>
              <span className="text-xs sm:text-sm font-medium text-secondary bg-secondary/15 px-3 py-1 rounded-full border border-secondary/20 shrink-0">
                Paso {step + 1} de {TOTAL_STEPS}
              </span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-secondary/20 overflow-hidden">
              <m.div
                className="h-full bg-secondary rounded-full"
                initial={false}
                animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="px-1 sm:px-2">
            <m.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.25, ease: "easeOut" }}
            >
              {step === 0 && (
                <StepRole
                  form={form}
                  set={set}
                  setExperienceYears={setExperienceYears}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
              {step === 1 && (
                <StepCompensation
                  form={form}
                  set={set}
                  setExperienceYears={setExperienceYears}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
              {step === 2 && (
                <StepEducation
                  form={form}
                  set={set}
                  setExperienceYears={setExperienceYears}
                  toggleArrayItem={toggleArrayItem}
                />
              )}
            </m.div>

            {error && (
              <p className="text-sm text-destructive mt-4" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-10 px-4"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
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
                  className="h-10 px-5 bg-zinc-900 hover:bg-zinc-800 text-white"
                >
                  Continuar
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !stepValid}
                  className="h-10 px-5 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon icon={Loading01Icon} size={18} className="animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={GiftIcon} size={18} />
                      Enviar y desbloquear
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <HugeiconsIcon icon={LockKeyIcon} size={14} />
          Nunca guardamos tu correo ni nombre. Datos usados solo para estadísticas anónimas.
        </p>
      </div>
    </section>
  )
}

type StepProps = {
  form: FormState
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  setExperienceYears: (raw: string) => void
  toggleArrayItem: (key: "benefits" | "skills", value: string) => void
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
        <YearsInput value={form.experienceYears} onChange={setExperienceYears} />
      </Field>
      <Field label="Región de Chile" required>
        <StyledSelect
          value={form.region}
          onChange={(v) => set("region", v)}
          placeholder="Selecciona tu región"
          options={REGIONES_CHILE}
        />
      </Field>
      <Field label="Modalidad" required className="md:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
    <div className="space-y-5">
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
            className="h-10 text-sm"
          />
          {form.monthlySalaryClp !== "" && Number(form.monthlySalaryClp) > 0 && (
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              {formatAmountCLP(Number(form.monthlySalaryClp))} / mes
            </p>
          )}
        </Field>
        <Field label="Bono anual (CLP)" optional>
          <Input
            type="number"
            min={0}
            step={50000}
            inputMode="numeric"
            value={form.annualBonusClp}
            onChange={(e) => set("annualBonusClp", e.target.value)}
            placeholder="Ej. 2000000"
            className="h-10 text-sm"
          />
        </Field>
      </div>

      <Field label="Beneficios que recibes" optional>
        <div className="flex flex-wrap gap-2">
          {BENEFICIOS_CHILE.map((opt) => (
            <ChipToggle
              key={opt.value}
              label={opt.label}
              selected={form.benefits.includes(opt.value)}
              onClick={() => toggleArrayItem("benefits", opt.value)}
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
    <div className="space-y-5">
      <Field label="Nivel educativo" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      <Field label="Habilidades / certificaciones que posees" optional>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((label) => (
            <ChipToggle
              key={label}
              label={label}
              selected={form.skills.includes(label)}
              onClick={() => toggleArrayItem("skills", label)}
            />
          ))}
        </div>
      </Field>
    </div>
  )
}

function UnlockedInsights({
  percentile,
  monthlyClp,
}: {
  percentile: number | null
  monthlyClp: number
}) {
  const reducedMotion = useReducedMotion()
  return (
    <section className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
        >
          <Card className="rounded-2xl border-0 shadow-none bg-surface-container-low p-4 sm:p-6 md:p-8">
            <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-5 md:p-6 mb-6">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} className="text-secondary shrink-0" />
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  Insights desbloqueados
                </h3>
              </div>
            </div>

            <div className="space-y-6 px-1 sm:px-2">
              <p className="text-muted-foreground">
                Gracias por contribuir al primer dataset abierto de sueldos STEM, salud y ciencias
                en Chile. Aquí está tu posición respecto al mercado.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Tu percentil
                  </p>
                  {percentile !== null ? (
                    <>
                      <p className="text-4xl font-bold text-secondary">P{percentile}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estás sobre el {percentile}% de los sueldos reportados en tu segmento.
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-foreground">
                      Eres el primero en tu segmento
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-border/10 bg-surface-container-lowest p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Tu sueldo reportado
                  </p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    {monthlyClp ? formatAmountCLP(monthlyClp) : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">líquido mensual en CLP</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                A medida que más profesionales en Chile aporten su sueldo, los percentiles se
                recalibran automáticamente con cada nuevo dato.
              </p>
            </div>
          </Card>
        </m.div>
      </div>
    </section>
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
      <span className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {optional && <span className="text-muted-foreground ml-1 font-normal">(opcional)</span>}
      </span>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function YearsInput({ value, onChange }: { value: string; onChange: (raw: string) => void }) {
  return (
    <Input
      type="number"
      min={0}
      max={50}
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ej. 4"
      className="h-10 text-sm"
    />
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
          "h-10 w-full appearance-none rounded-md border border-input bg-input/20 px-3 pr-9 text-sm",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 outline-none",
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
        className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
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
        "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all text-left",
        selected
          ? "border-secondary bg-secondary/10 text-secondary"
          : "border-border/20 bg-surface-container-lowest text-muted-foreground hover:border-secondary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
