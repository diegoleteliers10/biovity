import { Edit01Icon, FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { DialogDescription, DialogTitle } from "@/components/animate-ui/components/radix/dialog"

interface JobFormHeaderProps {
  isEdit: boolean
}

export function JobFormHeader({ isEdit }: JobFormHeaderProps) {
  return (
    <>
      <DialogTitle className="flex items-center gap-2">
        <HugeiconsIcon icon={isEdit ? Edit01Icon : FileAddIcon} size={20} />
        {isEdit ? "Editar oferta" : "Crear oferta"}
      </DialogTitle>
      <DialogDescription>
        {isEdit
          ? "Modifica los datos y guarda para actualizar la vacante."
          : "Completa los datos para publicar una nueva vacante."}
      </DialogDescription>
    </>
  )
}
