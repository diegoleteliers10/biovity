"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useReducer } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { getQuestionsByJob } from "@/lib/api/job-questions"
import { useCreateApplicationMutation } from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"
import { getResultErrorMessage } from "@/lib/result"
import { QuestionField } from "./question-field"

type ApplyJobSheetProps = {
  jobId: string
  jobTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ApplicationFormState = {
  answers: Record<string, string>
  coverLetter: string
  salaryMin: string
  salaryMax: string
  availabilityDate: string
  error: string | null
}

type ApplicationFormAction =
  | { type: "SET_ANSWER"; questionId: string; value: string }
  | { type: "SET_COVER_LETTER"; value: string }
  | { type: "SET_SALARY_MIN"; value: string }
  | { type: "SET_SALARY_MAX"; value: string }
  | { type: "SET_AVAILABILITY_DATE"; value: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" }

const applicationFormReducer = (
  state: ApplicationFormState,
  action: ApplicationFormAction
): ApplicationFormState => {
  switch (action.type) {
    case "SET_ANSWER":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } }
    case "SET_COVER_LETTER":
      return { ...state, coverLetter: action.value }
    case "SET_SALARY_MIN":
      return { ...state, salaryMin: action.value }
    case "SET_SALARY_MAX":
      return { ...state, salaryMax: action.value }
    case "SET_AVAILABILITY_DATE":
      return { ...state, availabilityDate: action.value }
    case "SET_ERROR":
      return { ...state, error: action.error }
    case "RESET":
      return {
        answers: {},
        coverLetter: "",
        salaryMin: "",
        salaryMax: "",
        availabilityDate: "",
        error: null,
      }
    default:
      return state
  }
}

const initialApplicationFormState: ApplicationFormState = {
  answers: {},
  coverLetter: "",
  salaryMin: "",
  salaryMax: "",
  availabilityDate: "",
  error: null,
}

export function ApplyJobSheet({ jobId, jobTitle, open, onOpenChange }: ApplyJobSheetProps) {
  const { useSession } = authClient
  const { data: session } = useSession()
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id
  const sessionTokenUserId = (session as { session?: { userId?: string } } | undefined)?.session
    ?.userId
  const userId = sessionUserId ?? sessionTokenUserId

  const [formState, dispatch] = useReducer(applicationFormReducer, initialApplicationFormState)

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

  const requiredQuestions = questions.filter((q) => q.required)
  const missingRequired = requiredQuestions.filter((q) => !formState.answers[q.id]?.trim())

  const handleSubmit = async () => {
    if (!userId) return

    if (missingRequired.length > 0) {
      dispatch({ type: "SET_ERROR", error: "Por favor responde todas las preguntas obligatorias" })
      return
    }

    const salaryMinValue = parseSalaryInput(formState.salaryMin)
    const salaryMaxValue = parseSalaryInput(formState.salaryMax)

    if (
      salaryMinValue != null &&
      salaryMaxValue != null &&
      Number.isFinite(salaryMinValue) &&
      Number.isFinite(salaryMaxValue) &&
      salaryMinValue > salaryMaxValue
    ) {
      dispatch({
        type: "SET_ERROR",
        error: "El salario mínimo no puede ser mayor al salario máximo.",
      })
      return
    }

    dispatch({ type: "SET_ERROR", error: null })
    const answerList = Object.entries(formState.answers).reduce<
      { questionId: string; value: string }[]
    >((acc, [questionId, value]) => {
      if (value.trim()) {
        acc.push({ questionId, value })
      }
      return acc
    }, [])

    createMutation.mutate(
      {
        jobId,
        coverLetter: formState.coverLetter.trim() || undefined,
        salaryMin: salaryMinValue,
        salaryMax: salaryMaxValue,
        salaryCurrency:
          salaryMinValue !== undefined || salaryMaxValue !== undefined ? "CLP" : undefined,
        availabilityDate: formState.availabilityDate || undefined,
        answers: answerList.length > 0 ? answerList : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err: Error) => {
          dispatch({ type: "SET_ERROR", error: err.message || "Error al enviar la postulación" })
        },
      }
    )
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
            <div className="text-center py-4 text-muted-foreground">Cargando preguntas…</div>
          )}

          {!loadingQuestions && questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Preguntas del trabajo</h3>
              {questions.map((question) => {
                const fieldId = `question-${question.id}`
                return (
                  <div key={question.id} className="space-y-2">
                    <label htmlFor={fieldId} className="text-sm font-medium">
                      {question.label}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    {question.helperText && (
                      <p id={`${fieldId}-helper`} className="text-xs text-muted-foreground">
                        {question.helperText}
                      </p>
                    )}
                    <QuestionField
                      question={question}
                      id={fieldId}
                      value={formState.answers[question.id] ?? ""}
                      onChange={(questionId, value) =>
                        dispatch({ type: "SET_ANSWER", questionId, value })
                      }
                    />
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground">Tu postulación</h3>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Carta de presentación</Label>
              <Textarea
                id="coverLetter"
                placeholder="Cuéntanos por qué te interesa este trabajo..."
                value={formState.coverLetter}
                onChange={(e) => dispatch({ type: "SET_COVER_LETTER", value: e.target.value })}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formState.coverLetter.length}/2000
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Expectativa salario mínimo (CLP)</Label>
                <Input
                  id="salaryMin"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 800.000"
                  value={formState.salaryMin}
                  onChange={(e) => {
                    const normalized = normalizeSalaryInput(e.target.value)
                    dispatch({ type: "SET_SALARY_MIN", value: formatSalaryInput(normalized) })
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
                  value={formState.salaryMax}
                  onChange={(e) => {
                    const normalized = normalizeSalaryInput(e.target.value)
                    dispatch({ type: "SET_SALARY_MAX", value: formatSalaryInput(normalized) })
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availabilityDate">Fecha de disponibilidad</Label>
              <Input
                id="availabilityDate"
                type="date"
                value={formState.availabilityDate}
                onChange={(e) => dispatch({ type: "SET_AVAILABILITY_DATE", value: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Recuerda tener adjunto tu CV en tu perfil. Lo leeremos sin necesidad de que lo subas
            nuevamente. Si no está adjunto, nos basaremos únicamente en la información de tu perfil.
          </div>

          {(formState.error || queryError) && (
            <p className="text-sm text-destructive text-center">{formState.error || queryError}</p>
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
