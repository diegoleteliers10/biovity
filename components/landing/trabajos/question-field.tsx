"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { JobQuestion } from "@/lib/api/job-questions"

type QuestionFieldProps = {
  readonly question: JobQuestion
  readonly id: string
  readonly value: string
  readonly onChange: (id: string, val: string) => void
}

export function QuestionField({ question, id, value, onChange }: QuestionFieldProps) {
  const isRequired = question.required
  const questionType = question.type.toUpperCase()

  switch (questionType) {
    case "TEXT":
      return (
        <Input
          key={question.id}
          id={id}
          placeholder={question.placeholder || "Ingresa tu respuesta"}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          aria-describedby={question.helperText ? `${id}-helper` : undefined}
          aria-required={isRequired}
        />
      )

    case "TEXTAREA":
      return (
        <Textarea
          key={question.id}
          id={id}
          placeholder={question.placeholder || "Ingresa tu respuesta"}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          aria-describedby={question.helperText ? `${id}-helper` : undefined}
          aria-required={isRequired}
        />
      )

    case "NUMBER":
      return (
        <Input
          key={question.id}
          id={id}
          type="number"
          placeholder={question.placeholder || "Ingresa un número"}
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          aria-describedby={question.helperText ? `${id}-helper` : undefined}
          aria-required={isRequired}
        />
      )

    case "SELECT":
      return (
        <Select value={value} onValueChange={(v) => onChange(question.id, v)}>
          <SelectTrigger
            id={id}
            aria-describedby={question.helperText ? `${id}-helper` : undefined}
            aria-required={isRequired}
          >
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
                  onChange(question.id, newSelected.join(","))
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
              onClick={() => onChange(question.id, option)}
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
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(question.id, e.target.value)}
          aria-describedby={question.helperText ? `${id}-helper` : undefined}
          aria-required={isRequired}
        />
      )

    default:
      return null
  }
}
