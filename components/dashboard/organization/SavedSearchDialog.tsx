"use client"

import { BookmarkAdd01Icon, Delete03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type SavedSearch,
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
  useSavedSearches,
} from "@/lib/api/use-saved-searches"

type SavedSearchDialogProps = {
  organizationId: string | undefined
  currentFilters: Record<string, unknown>
  onLoadSearch: (filters: Record<string, unknown>) => void
}

export function SavedSearchDialog({
  organizationId,
  currentFilters,
  onLoadSearch,
}: SavedSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [notify, setNotify] = useState(false)
  const [loadValue, setLoadValue] = useState("")

  const { data: savedSearches = [] } = useSavedSearches(organizationId)
  const createMutation = useCreateSavedSearchMutation(organizationId ?? "")
  const deleteMutation = useDeleteSavedSearchMutation(organizationId ?? "")

  const handleSave = useCallback(() => {
    if (!name.trim() || !organizationId) return
    createMutation.mutate(
      { name: name.trim(), filters: currentFilters, notify },
      {
        onSuccess: () => {
          toast.success("Búsqueda guardada")
          setName("")
          setNotify(false)
          setOpen(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }, [name, organizationId, currentFilters, notify, createMutation])

  const handleLoad = useCallback(
    (searchId: string) => {
      const search = savedSearches.find((s) => s.id === searchId)
      if (search) {
        onLoadSearch(search.filters)
        setLoadValue("")
        toast.success(`Filtros cargados: ${search.name}`)
      }
    },
    [savedSearches, onLoadSearch]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent, search: SavedSearch) => {
      e.stopPropagation()
      deleteMutation.mutate(search.id, {
        onSuccess: () => toast.success(`"${search.name}" eliminada`),
        onError: (err) => toast.error(err.message),
      })
    },
    [deleteMutation]
  )

  return (
    <div className="flex items-center gap-2">
      {savedSearches.length > 0 && (
        <div className="flex items-center gap-1">
          <Select value={loadValue} onValueChange={handleLoad}>
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue placeholder="Cargar búsqueda" />
            </SelectTrigger>
            <SelectContent>
              {savedSearches.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                  className="group flex items-center justify-between"
                >
                  <span>{s.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadValue && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                const search = savedSearches.find((s) => s.id === loadValue)
                if (search) handleDelete({ stopPropagation: () => {} } as React.MouseEvent, search)
              }}
              aria-label="Eliminar búsqueda guardada"
            >
              <HugeiconsIcon icon={Delete03Icon} size={14} />
            </Button>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={BookmarkAdd01Icon} size={14} className="mr-1" />
            Guardar búsqueda
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Guardar búsqueda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="search-name">Nombre de la búsqueda</Label>
              <Input
                id="search-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Desarrolladores React Chile"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="search-notify"
                checked={notify}
                onCheckedChange={(checked) => setNotify(checked === true)}
              />
              <Label htmlFor="search-notify" className="text-sm cursor-pointer">
                Notificarme cuando haya nuevos candidatos
              </Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!name.trim() || createMutation.isPending}>
                {createMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
