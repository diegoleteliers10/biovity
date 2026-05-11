"use client"

import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"

type EventFormHeaderProps = {
  isEditMode: boolean
  lockedType?: string
  eventTypeLabel?: string
}

export function EventFormHeader({ isEditMode, lockedType, eventTypeLabel }: EventFormHeaderProps) {
  return (
    <SheetHeader>
      <SheetTitle>
        {isEditMode ? "Editar Evento" : lockedType ? eventTypeLabel : "Crear Evento"}
      </SheetTitle>
      <SheetDescription>
        {isEditMode
          ? "Actualiza los detalles del evento"
          : lockedType
            ? `Programar ${eventTypeLabel?.toLowerCase()} para el candidato`
            : "Crear un nuevo evento en el calendario"}
      </SheetDescription>
    </SheetHeader>
  )
}
