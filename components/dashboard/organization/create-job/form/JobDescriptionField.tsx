import { RichTextEditor } from "@/components/dashboard/shared/lazy-rich-text-editor"
import { Field, FieldLabel } from "@/components/ui/field"

interface JobDescriptionFieldProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionField({ value, onChange }: JobDescriptionFieldProps) {
  return (
    <Field>
      <FieldLabel>
        Descripción <span className="text-red-600 font-bold ml-0.5">*</span>
      </FieldLabel>
      <RichTextEditor
        content={value}
        onChange={onChange}
        placeholder="Describe el puesto, requisitos y responsabilidades..."
        className="min-h-[160px]"
      />
    </Field>
  )
}
