import { XIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobRequiredSkillsProps {
  skills: string[]
  onSkillsChange: (skills: string[]) => void
}

export function JobRequiredSkills({ skills, onSkillsChange }: JobRequiredSkillsProps) {
  const [inputValue, setInputValue] = useState("")

  const addSkill = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || skills.includes(trimmed)) {
      setInputValue("")
      return
    }
    onSkillsChange([...skills, trimmed])
    setInputValue("")
  }, [inputValue, skills, onSkillsChange])

  const removeSkill = useCallback(
    (skill: string) => {
      onSkillsChange(skills.filter((s) => s !== skill))
    },
    [skills, onSkillsChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  return (
    <Field>
      <FieldLabel>Habilidades requeridas</FieldLabel>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder="Escribir y presionar Enter para agregar..."
      />
      <p className="text-muted-foreground text-xs mt-1">Ej: Python, SQL, PCR, manejo de equipos</p>
    </Field>
  )
}
