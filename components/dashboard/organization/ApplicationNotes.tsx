"use client"

import { Cancel01Icon, Message01Icon, PlusSignIcon, Tag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEvaluations } from "@/hooks/use-evaluations"
import { useAddNoteMutation, useApplicationNotes, useDeleteNoteMutation } from "@/hooks/use-notes"
import { formatDateChilean } from "@/lib/utils"
import { applicationComments } from "./application-comments"

export function ApplicationNotes({ applicationId }: { applicationId: string }) {
  const { data: notes, isLoading } = useApplicationNotes(applicationId)
  const evaluationsQuery = useEvaluations(applicationId)
  const comments = applicationComments(notes ?? [], evaluationsQuery.data ?? [])
  const loading = isLoading || evaluationsQuery.isLoading
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
          className="h-7 gap-1.5"
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

      {loading && <p className="text-xs text-muted-foreground py-2">Cargando notas...</p>}

      {!loading && !evaluationsQuery.isError && comments.length === 0 && (
        <div className="rounded-lg border border-dashed bg-background p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No hay notas. Agrega una para dejar un registro interno.
          </p>
        </div>
      )}

      {evaluationsQuery.isError && (
        <div role="alert" className="text-xs text-destructive">
          No se pudieron actualizar los comentarios de evaluación.
          <button
            type="button"
            onClick={() => void evaluationsQuery.refetch()}
            className="ml-2 underline"
          >
            Reintentar
          </button>
        </div>
      )}
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="group relative rounded-lg border bg-background p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="whitespace-pre-wrap break-words min-w-0 text-sm text-foreground">
                  {comment.content}
                </p>
                {comment.kind === "note" && (
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(comment.note.id)}
                    className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                    aria-label="Eliminar nota"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </button>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{comment.author}</span>
                <span>|</span>
                <span>{formatDateChilean(comment.date, "d MMM yyyy HH:mm")}</span>
                {comment.kind === "evaluation" && (
                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-secondary-soft">
                    Evaluación
                  </span>
                )}
                {comment.kind === "note" && comment.note.tags.length > 0 && (
                  <>
                    <span>|</span>
                    {comment.note.tags.map((tag) => (
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
