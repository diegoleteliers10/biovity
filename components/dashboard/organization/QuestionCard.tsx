"use client"

import { Delete02Icon, Edit02Icon, Globe02Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { JobQuestion } from "@/lib/api/job-questions"

interface QuestionCardProps {
  question: JobQuestion
  onEdit: (question: JobQuestion) => void
  onDelete: (id: string) => void
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
}

export function QuestionCard({
  question,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}: QuestionCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{question.label}</span>
          {question.required && <span className="shrink-0 text-destructive text-xs">*</span>}
          <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wider">
            {question.type}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{question.status === "published" ? "Publicada" : "Borrador"}</span>
          {question.options && question.options.length > 0 && (
            <span>· {question.options.length} opciones</span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(question)} className="gap-2">
            <HugeiconsIcon icon={Edit02Icon} size={14} />
            Editar
          </DropdownMenuItem>
          {question.status === "draft" ? (
            <DropdownMenuItem onClick={() => onPublish(question.id)} className="gap-2">
              <HugeiconsIcon icon={Globe02Icon} size={14} />
              Publicar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onUnpublish(question.id)} className="gap-2">
              <HugeiconsIcon icon={Edit02Icon} size={14} />
              Despublicar
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => onDelete(question.id)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
