"use client"

import { Cancel01Icon, Message01Icon, PlusSignIcon, Tag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAddNoteMutation, useApplicationNotes, useDeleteNoteMutation } from "@/hooks/use-notes"

export function ApplicationNotes({ applicationId }: { applicationId: string }) {
  const { data: notes, isLoading } = useApplicationNotes(applicationId)
  const addMutation = useAddNoteMutation(applicationId)
  const deleteMutation = useDeleteNoteMutation(applicationId)

  const [newNote, setNewNote] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = () => {
    if (!newNote.trim()) return
    addMutation.mutate(
      { content: newNote.trim() },
      {
        onSuccess: () => {
          setNewNote("")
          setIsAdding(false)
        },
      }
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Notas internas</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="h-8 gap-1.5"
        >
          <HugeiconsIcon icon={isAdding ? Cancel01Icon : PlusSignIcon} size={14} />
          {isAdding ? "Cancelar" : "Agregar nota"}
        </Button>
      </div>

      {isAdding && (
        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nota sobre este candidato..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newNote.trim() || addMutation.isPending}
            >
              <HugeiconsIcon icon={Message01Icon} size={14} className="mr-1.5" />
              {addMutation.isPending ? "Enviando..." : "Guardar"}
            </Button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-xs text-muted-foreground py-2">Cargando notas...</p>}

      {!isLoading && (!notes || notes.length === 0) && (
        <div className="rounded-lg border border-dashed bg-background p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No hay notas. Agrega una para dejar un registro interno.
          </p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="group relative rounded-lg border bg-background p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="whitespace-pre-wrap text-sm text-foreground">{note.content}</p>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(note.id)}
                  className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  aria-label="Eliminar nota"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{note.author_name}</span>
                <span>|</span>
                <span>{new Date(note.created_at).toLocaleDateString("es-CL")}</span>
                {note.tags.length > 0 && (
                  <>
                    <span>|</span>
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5"
                      >
                        <HugeiconsIcon icon={Tag01Icon} size={10} />
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
