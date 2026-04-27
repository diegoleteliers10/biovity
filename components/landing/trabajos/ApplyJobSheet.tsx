"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getQuestionsByJob, type JobQuestion } from "@/lib/api/job-questions"
import { useCreateApplicationMutation } from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"
import { getResultErrorMessage } from "@/lib/result"

type ApplyJobSheetProps = {
  jobId: string
  jobTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyJobSheet({ jobId, jobTitle, open, onOpenChange }: ApplyJobSheetProps) {
  const { useSession } = authClient
  const { data: session } = useSession()
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id
  const sessionTokenUserId = (session as { session?: { userId?: string } } | undefined)?.session
    ?.userId
  const userId = sessionUserId ?? sessionTokenUserId

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [coverLetter, setCoverLetter] = useState("")
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [availabilityDate, setAvailabilityDate] = useState("")
  const [error, setError] = useState<string | null>(null)

  const normalizeSalaryInput = (value: string): string => {
    const onlyDigits = value.replace(/\D/g, "")
    return onlyDigits.replace(/^0+(?=\d)/, "")
  }

  const formatSalaryInput = (value: string): string => {
    if (!value) return ""
    return Number(value).toLocaleString("es-CL")
  }

  const parseSalaryInput = (value: string): number | undefined => {
    const normalized = normalizeSalaryInput(value)
    if (!normalized) return undefined
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  const createMutation = useCreateApplicationMutation(userId)
  const questionsQuery = useQuery({
    queryKey: ["job-questions", "public", jobId],
    queryFn: async () => {
      const result = await getQuestionsByJob(jobId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
        .filter((q) => q.status.toLowerCase() === "published")
        .sort((a, b) => a.orderIndex - b.orderIndex)
    },
    enabled: open && Boolean(jobId),
    refetchOnMount: "always",
  })

  const questions = questionsQuery.data ?? []
  const loadingQuestions = questionsQuery.isLoading
  const queryError = questionsQuery.error?.message ?? null

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const requiredQuestions = questions.filter((q) => q.required)
  const missingRequired = requiredQuestions.filter((q) => !answers[q.id]?.trim())

  const handleSubmit = async () => {
    if (!userId) return

    if (missingRequired.length > 0) {
      setError("Por favor responde todas las preguntas obligatorias")
      return
    }

    const salaryMinValue = parseSalaryInput(salaryMin)
    const salaryMaxValue = parseSalaryInput(salaryMax)

    if (
      salaryMinValue != null &&
      salaryMaxValue != null &&
      Number.isFinite(salaryMinValue) &&
      Number.isFinite(salaryMaxValue) &&
      salaryMinValue > salaryMaxValue
    ) {
      setError("El salario mínimo no puede ser mayor al salario máximo.")
      return
    }

    setError(null)
    const answerList = Object.entries(answers)
      .filter(([, value]) => value.trim())
      .map(([questionId, value]) => ({ questionId, value }))

    createMutation.mutate(
      {
        jobId,
        coverLetter: coverLetter.trim() || undefined,
        salaryMin: salaryMinValue,
        salaryMax: salaryMaxValue,
        salaryCurrency:
          salaryMinValue !== undefined || salaryMaxValue !== undefined ? "CLP" : undefined,
        availabilityDate: availabilityDate || undefined,
        answers: answerList.length > 0 ? answerList : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: Error) => {
          setError(err.message || "Error al enviar la postulación")
        },
      }
    )
  }

  const renderQuestion = (question: JobQuestion) => {
    const value = answers[question.id] ?? ""
    const isRequired = question.required
    const questionType = question.type.toUpperCase()

    switch (questionType) {
      case "TEXT":
        return (
          <Input
            key={question.id}
            placeholder={question.placeholder || "Ingresa tu respuesta"}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            aria-label={question.label}
            aria-required={isRequired}
          />
        )

      case "TEXTAREA":
        return (
          <Textarea
            key={question.id}
            placeholder={question.placeholder || "Ingresa tu respuesta"}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            aria-label={question.label}
            aria-required={isRequired}
          />
        )

      case "NUMBER":
        return (
          <Input
            key={question.id}
            type="number"
            placeholder={question.placeholder || "Ingresa un número"}
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            aria-label={question.label}
            aria-required={isRequired}
          />
        )

      case "SELECT":
        return (
          <Select value={value} onValueChange={(v) => handleAnswerChange(question.id, v)}>
            <SelectTrigger aria-label={question.label} aria-required={isRequired}>
              <SelectValue placeholder={question.placeholder || "Selecciona una opción"} />
            </SelectTrigger>
            <SelectContent>
              {(question.options ?? []).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "MULTISELECT": {
        const selected = value ? value.split(",") : []
        return (
          <div className="flex flex-wrap gap-2">
            {(question.options ?? []).map((option) => {
              const isSelected = selected.includes(option)
              return (
                <Button
                  key={option}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newSelected = isSelected
                      ? selected.filter((s) => s !== option)
                      : [...selected, option]
                    handleAnswerChange(question.id, newSelected.join(","))
                  }}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        )
      }

      case "BOOLEAN":
        return (
          <div className="flex gap-4">
            {["Sí", "No"].map((option) => (
              <Button
                key={option}
                type="button"
                variant={value === option ? "default" : "outline"}
                size="sm"
                onClick={() => handleAnswerChange(question.id, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )

      case "DATE":
        return (
          <Input
            key={question.id}
            type="date"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            aria-label={question.label}
            aria-required={isRequired}
          />
        )

      default:
        return null
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto p-0 data-[side=right]:w-[90vw] data-[side=right]:sm:max-w-none data-[side=right]:md:w-[44rem] data-[side=right]:lg:w-[52rem]"
      >
        <SheetHeader className="border-b bg-muted/30 px-6 py-4 pr-10 text-left sm:px-8 sm:pr-12">
          <SheetTitle>Postular a {jobTitle}</SheetTitle>
          <SheetDescription>Completa el formulario para enviar tu postulación</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-6 pb-6 sm:px-8">
          {loadingQuestions && (
            <div className="text-center py-4 text-muted-foreground">Cargando preguntas...</div>
          )}

          {!loadingQuestions && questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Preguntas del trabajo</h3>
              {questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {question.label}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {question.helperText && (
                    <p className="text-xs text-muted-foreground">{question.helperText}</p>
                  )}
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground">Tu postulación</h3>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Carta de presentación</Label>
              <Textarea
                id="coverLetter"
                placeholder="Cuéntanos por qué te interesa este trabajo..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">{coverLetter.length}/2000</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Expectativa salario mínimo (CLP)</Label>
                <Input
                  id="salaryMin"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 800.000"
                  value={salaryMin}
                  onChange={(e) => {
                    const normalized = normalizeSalaryInput(e.target.value)
                    setSalaryMin(formatSalaryInput(normalized))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Expectativa salario máximo (CLP)</Label>
                <Input
                  id="salaryMax"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 1.200.000"
                  value={salaryMax}
                  onChange={(e) => {
                    const normalized = normalizeSalaryInput(e.target.value)
                    setSalaryMax(formatSalaryInput(normalized))
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availabilityDate">Fecha de disponibilidad</Label>
              <Input
                id="availabilityDate"
                type="date"
                value={availabilityDate}
                onChange={(e) => setAvailabilityDate(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Recuerda tener adjunto tu CV en tu perfil. Lo leeremos sin necesidad de que lo subas
            nuevamente. Si no está adjunto, nos basaremos únicamente en la información de tu perfil.
          </div>

          {(error || queryError) && (
            <p className="text-sm text-destructive text-center">{error || queryError}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || loadingQuestions || missingRequired.length > 0}
            >
              {createMutation.isPending ? "Enviando..." : "Enviar postulación"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
