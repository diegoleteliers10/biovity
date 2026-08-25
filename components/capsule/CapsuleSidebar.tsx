"use client"

import { CheckmarkCircle02Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Module } from "@/lib/types/capsulas"
import { cn } from "@/lib/utils"

type Props = {
  modules: Module[]
  completedModules: Set<number>
  activeModule: number
  onModuleClick: (index: number) => void
  allCompleted: boolean
}

export function CapsuleSidebar({
  modules,
  completedModules,
  activeModule,
  onModuleClick,
  allCompleted,
}: Props) {
  return (
    <nav className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-8">
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Módulos
        </p>
        <ul className="space-y-1">
          {modules.map((mod, i) => {
            const isCompleted = completedModules.has(i)
            const isActive = activeModule === i
            return (
              <li key={mod.slug}>
                <button
                  type="button"
                  onClick={() => onModuleClick(i)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-start gap-3",
                    isActive
                      ? "bg-secondary/10 text-secondary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container-low"
                  )}
                >
                  <span className="mt-0.5 shrink-0">
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
          <div className="mt-4 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-xs font-medium text-secondary">Módulos completados</p>
          </div>
        )}
      </div>
    </nav>
  )
}
