"use client"

import { CheckmarkCircle02Icon, Clock01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Module } from "@/lib/types/capsulas"
import { cn } from "@/lib/utils"

type Props = {
  modules: Module[]
  completedModules: Set<number>
  activeModule: number
  onModuleClick: (index: number) => void
  allCompleted: boolean
}

export function CapsuleDrawer({
  modules,
  completedModules,
  activeModule,
  onModuleClick,
  allCompleted,
}: Props) {
  const [open, setOpen] = useState(false)

  const handleModuleClick = (index: number) => {
    onModuleClick(index)
    setOpen(false)
  }

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full shadow-lg size-12">
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Módulos</SheetTitle>
          </SheetHeader>
          <ul className="space-y-1 px-6 pb-6">
            {modules.map((mod, i) => {
              const isCompleted = completedModules.has(i)
              const isActive = activeModule === i
              return (
                <li key={mod.slug}>
                  <button
                    type="button"
                    onClick={() => handleModuleClick(i)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-3",
                      isActive
                        ? "bg-secondary/10 text-secondary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-container-low"
                    )}
                  >
                    <span className="shrink-0">
                      {isCompleted ? (
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={16}
                          className="text-secondary"
                        />
                      ) : (
                        <span
                          className={cn(
                            "flex items-center justify-center size-4 rounded-full border text-[10px] font-mono",
                            isActive
                              ? "border-secondary text-secondary"
                              : "border-border/60 text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </span>
                      )}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span>{mod.title}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HugeiconsIcon icon={Clock01Icon} size={10} />
                        {mod.duration} min
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          {allCompleted && (
            <div className="mx-6 mb-6 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-xs font-medium text-secondary">Módulos completados</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
