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
import { parseTalentFilters, type TalentFilters } from "@/lib/api/talent-search"
import {
  type SavedSearch,
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
  useSavedSearches,
  useUpdateSavedSearchMutation,
} from "@/lib/api/use-saved-searches"

type SavedSearchDialogProps = {
  organizationId: string | undefined
  currentFilters: TalentFilters
  onLoadSearch: (filters: TalentFilters) => void
}

export function SavedSearchDialog({
  organizationId,
  currentFilters,
  onLoadSearch,
}: SavedSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const [loadValue, setLoadValue] = useState("")

  const { data: savedSearches = [] } = useSavedSearches(organizationId)
  const createMutation = useCreateSavedSearchMutation(organizationId ?? "")
  const deleteMutation = useDeleteSavedSearchMutation(organizationId ?? "")
  const updateMutation = useUpdateSavedSearchMutation(organizationId ?? "")

  const handleSave = useCallback(() => {
    if (!name.trim() || !organizationId) return
    createMutation.mutate(
      { name: name.trim(), filters: currentFilters, notifyEnabled },
      {
        onSuccess: () => {
          toast.success("Búsqueda guardada")
          setName("")
          setNotifyEnabled(false)
          setOpen(false)
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }, [name, notifyEnabled, organizationId, currentFilters, createMutation])

  const handleLoad = useCallback(
    (searchId: string) => {
      const search = savedSearches.find((s) => s.id === searchId)
      if (search) {
        const filters = parseTalentFilters(search.filters)
        if (!filters) {
          toast.error(
            "Esta búsqueda guardada tiene filtros inválidos. Elimínala y guárdala de nuevo."
          )
          return
        }
        onLoadSearch(filters)
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

  const handleToggleAlerts = useCallback(() => {
    const search = savedSearches.find((item) => item.id === loadValue)
    if (!search) return
    updateMutation.mutate(
      { id: search.id, notifyEnabled: !search.notifyEnabled },
      {
        onSuccess: (result) => {
          if (result.isErr()) toast.error(result.error.message)
          else toast.success(result.value.notifyEnabled ? "Alertas activadas" : "Alertas pausadas")
        },
      }
    )
  }, [loadValue, savedSearches, updateMutation])

  return (
    <div className="flex items-center gap-2">
      {savedSearches.length > 0 && (
        <div className="flex items-center gap-1">
          <Select value={loadValue} onValueChange={handleLoad}>
            <SelectTrigger className="h-9 w-40">
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
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAlerts}
                disabled={updateMutation.isPending}
              >
                {savedSearches.find((search) => search.id === loadValue)?.notifyEnabled
                  ? "Pausar alertas"
                  : "Activar alertas"}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  const search = savedSearches.find((s) => s.id === loadValue)
                  if (search)
                    handleDelete({ stopPropagation: () => {} } as React.MouseEvent, search)
                }}
                aria-label="Eliminar búsqueda guardada"
              >
                <HugeiconsIcon icon={Delete03Icon} size={14} />
              </Button>
            </>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <HugeiconsIcon icon={BookmarkAdd01Icon} size={14} strokeWidth={1.5} />
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
            <div className="flex items-start gap-2">
              <Checkbox
                id="search-alerts"
                checked={notifyEnabled}
                onCheckedChange={(checked) => setNotifyEnabled(checked === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="search-alerts">Activar alertas para esta búsqueda</Label>
                <p className="text-xs text-muted-foreground">
                  Los reclutadores de la empresa reciben avisos según sus preferencias. Los
                  resúmenes llegan a las 09:00, hora de Santiago. El semanal llega el lunes.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="h-9 px-4"
                onClick={handleSave}
                disabled={!name.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
