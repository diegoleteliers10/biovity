"use client"

import { Button } from "@/components/ui/button"

type EventFormFooterProps = {
  isEditMode: boolean
  isLoading: boolean
  isValid: boolean
  onCancel: () => void
  onDelete: () => void
}

export function EventFormFooter({
  isEditMode,
  isLoading,
  isValid,
  onCancel,
  onDelete,
}: EventFormFooterProps) {
  return (
    <div className="mt-auto flex gap-2 pt-4 border-t">
      {isEditMode && (
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={isLoading}
          className="flex-1"
        >
          Eliminar
        </Button>
      )}
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
        Cancelar
      </Button>
      <Button type="submit" disabled={!isValid || isLoading} className="flex-1">
        {isLoading
          ? isEditMode
            ? "Guardando..."
            : "Creando..."
          : isEditMode
            ? "Guardar"
            : "Crear evento"}
      </Button>
    </div>
  )
}
