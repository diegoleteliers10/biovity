"use client"

import {
  Calendar01Icon,
  ChevronDown,
  Clock01Icon,
  Delete01Icon,
  Edit01Icon,
  Location05Icon,
  VideoCameraAiIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card } from "@/components/ui/card"
import type { Event } from "@/lib/types/events"

type UpcomingEventsProps = {
  events?: Event[]
  isLoading?: boolean
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
}

export function UpcomingEvents({ events = [], isLoading, onEdit, onDelete }: UpcomingEventsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  const now = new Date()
  const upcoming = events
    .filter((e) => new Date(e.startAt) >= now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 5)

  const formatEventDate = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
    } catch {
      return ""
    }
  }

  const formatEventTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return ""
    }
  }

  const formatEndTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return ""
    }
  }

  const getEventTypeDot = (type: Event["type"]) => {
    switch (type) {
      case "interview":
        return "bg-primary"
      case "onboarding":
        return "bg-secondary"
      case "task_deadline":
        return "bg-accent"
      case "announcement":
        return "bg-muted-foreground"
      default:
        return "bg-muted-foreground"
    }
  }

  const getEventTypeLabel = (type: Event["type"]) => {
    switch (type) {
      case "interview":
        return "Entrevista"
      case "onboarding":
        return "Onboarding"
      case "task_deadline":
        return "Deadline"
      case "announcement":
        return "Anuncio"
      default:
        return type
    }
  }

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <Card className="bg-white border border-border/10 h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <HugeiconsIcon icon={Calendar01Icon} className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">Próximos Eventos</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">No hay eventos próximos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event, index) => {
              const isExpanded = expandedId === event.id
              return (
                <div key={event.id}>
                  <motion.div
                    layout
                    className={`relative p-4 rounded-lg bg-white cursor-pointer ${isExpanded ? "shadow-md" : "hover:shadow-sm border border-border/50"}`}
                    onClick={() => handleToggle(event.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handleToggle(event.id)
                    }
                    aria-expanded={isExpanded}
                    aria-label={`Evento: ${event.title}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${getEventTypeDot(event.type)}`} />
                          <h4 className="font-medium text-sidebar-foreground text-sm leading-tight">
                            {event.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {index === 0 && (
                            <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium">
                              Próximo
                            </span>
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <HugeiconsIcon
                              icon={ChevronDown}
                              className="h-4 w-4 text-muted-foreground shrink-0"
                            />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon icon={Calendar01Icon} className="h-3 w-3" />
                          <span>{formatEventDate(event.startAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
                          <span>{formatEventTime(event.startAt)}</span>
                        </div>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                          <HugeiconsIcon icon={Location05Icon} className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t space-y-3">
                            {event.description && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Descripción
                                </p>
                                <p className="text-sm text-foreground">{event.description}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {event.endAt && (
                                <span className="text-xs px-2 py-1 rounded-full bg-muted/30 text-muted-foreground">
                                  {formatEventTime(event.startAt)} — {formatEndTime(event.endAt)}
                                </span>
                              )}
                            </div>

                            {event.meetingUrl && (
                              <div className="flex items-center gap-2">
                                <HugeiconsIcon
                                  icon={VideoCameraAiIcon}
                                  className="h-4 w-4 text-primary shrink-0"
                                />
                                <a
                                  href={event.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline truncate"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {event.meetingUrl}
                                </a>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEdit?.(event)
                                }}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                              >
                                <HugeiconsIcon icon={Edit01Icon} className="h-3.5 w-3.5" />
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteEventId(event.id)
                                }}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <HugeiconsIcon icon={Delete01Icon} className="h-3.5 w-3.5" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteEventId !== null} onOpenChange={(open) => !open && setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteEventId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteEventId) {
                  onDelete?.(deleteEventId)
                  setDeleteEventId(null)
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
