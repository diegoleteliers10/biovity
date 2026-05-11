import { AIJobDescriptionWriter } from "@/components/ai/AIJobDescriptionWriter"
import { RichTextEditor } from "@/components/dashboard/shared/lazy-rich-text-editor"
import { Field, FieldLabel } from "@/components/ui/field"

interface JobDescriptionFieldProps {
  value: string
  isGenerating: boolean
  jobTitle: string
  experienceLevel: string
  employmentType: string
  isRemote: boolean
  onChange: (value: string) => void
  onGeneratingChange: (value: boolean) => void
}

export function JobDescriptionField({
  value,
  isGenerating,
  jobTitle,
  experienceLevel,
  employmentType,
  isRemote,
  onChange,
  onGeneratingChange,
}: JobDescriptionFieldProps) {
  return (
    <Field>
      <FieldLabel>Descripción *</FieldLabel>
      <RichTextEditor
        content={value}
        onChange={onChange}
        placeholder="Describe el puesto, requisitos y responsabilidades..."
        className="min-h-[160px]"
        isGenerating={isGenerating}
        toolbarSuffix={
          <AIJobDescriptionWriter
            jobTitle={jobTitle}
            companyName=""
            area={experienceLevel}
            skills={[]}
            contractType={employmentType}
            modality={isRemote ? "remoto" : "presencial"}
            currentDescription={value}
            onGenerated={onChange}
            onGeneratingChange={onGeneratingChange}
          />
        }
      />
    </Field>
  )
}
