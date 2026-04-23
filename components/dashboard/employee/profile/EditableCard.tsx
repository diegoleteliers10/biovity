import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  FloppyDiskIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type EditableCardProps = {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  children: React.ReactNode
  className?: string
}

export function EditableCard({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isSaving,
  children,
  className,
}: EditableCardProps) {
  return (
    <Card
      className={cn(
        "group relative bg-white border border-border/10 hover:bg-secondary/5 transition-colors duration-300",
        className
      )}
    >
      {!isEditing && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={onEdit}
          aria-label="Editar sección"
        >
          <HugeiconsIcon icon={Edit01Icon} size={18} />
        </Button>
      )}
      {children}
      {isEditing && (
        <div className="flex flex-wrap gap-3 justify-end px-6 pb-6 pt-0">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      )}
    </Card>
  )
}
