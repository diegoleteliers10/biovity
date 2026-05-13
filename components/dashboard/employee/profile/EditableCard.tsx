import { Cancel01Icon, Edit01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
        "group relative bg-white transition-all duration-200",
        "hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]",
        isEditing && "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {!isEditing && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-foreground hover:bg-transparent"
          onClick={onEdit}
          aria-label="Editar sección"
        >
          <HugeiconsIcon icon={Edit01Icon} size={16} strokeWidth={1.5} />
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
