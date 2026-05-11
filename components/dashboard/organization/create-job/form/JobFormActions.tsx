import { DialogFooter } from "@/components/animate-ui/components/radix/dialog"
import { Button } from "@/components/ui/button"

interface JobFormActionsProps {
  isSubmitting: boolean
  isEdit: boolean
  canSubmit: boolean
  onCancel: () => void
}

export function JobFormActions({ isSubmitting, isEdit, canSubmit, onCancel }: JobFormActionsProps) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting
          ? isEdit
            ? "Guardando..."
            : "Creando..."
          : isEdit
            ? "Guardar cambios"
            : "Crear oferta"}
      </Button>
    </DialogFooter>
  )
}
