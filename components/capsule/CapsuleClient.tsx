"use client"

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useState } from "react"
import { Quiz } from "@/components/quiz/Quiz"
import { Button } from "@/components/ui/button"
import type { Module, ModuleProgress } from "@/lib/types/capsulas"
import { CapsuleDrawer } from "./CapsuleDrawer"
import { CapsuleSidebar } from "./CapsuleSidebar"

type Props = {
  modules: Module[]
  slug: string
  moduleProgress: ModuleProgress[]
  header: React.ReactNode
  quizQuestions: { q: string; options: string[]; correct: number }[]
  quizCategory: string
  quizSlug: string
  authNotice: React.ReactNode
  moduleSections: React.ReactNode[]
}

export function CapsuleClient({
  modules,
  slug,
  moduleProgress,
  header,
  quizQuestions,
  quizCategory,
  quizSlug,
  authNotice,
  moduleSections,
}: Props) {
  const [completedModules, setCompletedModules] = useState<Set<number>>(() => {
    const completed = new Set<number>()
    for (const mp of moduleProgress) {
      if (mp.completed) completed.add(mp.module_index)
    }
    return completed
  })

  const allCompleted = completedModules.size === modules.length

  const activeModule = useMemo(() => {
    for (let i = 0; i < modules.length; i++) {
      if (!completedModules.has(i)) return i
    }
    return modules.length - 1
  }, [completedModules, modules.length])

  const handleModuleClick = useCallback(
    (index: number) => {
      const el = document.getElementById(modules[index]?.slug ?? "")
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [modules]
  )

  const handleModuleComplete = useCallback((index: number) => {
    setCompletedModules((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  return (
    <div className="flex gap-12">
      <CapsuleSidebar
        modules={modules}
        completedModules={completedModules}
        activeModule={activeModule}
        onModuleClick={handleModuleClick}
        allCompleted={allCompleted}
      />

      <div className="flex-1 min-w-0">
        {header}

        <div className="border-t border-border/40 pt-8 space-y-0">
          {modules.map((mod, i) => {
            const isVisible = i === 0 || completedModules.has(i - 1)
            if (!isVisible) return null

            return (
              <div key={mod.slug}>
                {moduleSections[i]}
                <ModuleEndButton
                  index={i}
                  slug={slug}
                  isCompleted={completedModules.has(i)}
                  isLast={i === modules.length - 1}
                  onComplete={handleModuleComplete}
                />
              </div>
            )
          })}
        </div>

        {!allCompleted && authNotice}

        <div className="mt-16 border-t border-border/40 pt-10">
          <Quiz
            questions={quizQuestions}
            category={quizCategory}
            slug={quizSlug}
            locked={!allCompleted}
            completedModules={completedModules.size}
            totalModules={modules.length}
          />
        </div>
      </div>

      <CapsuleDrawer
        modules={modules}
        completedModules={completedModules}
        activeModule={activeModule}
        onModuleClick={handleModuleClick}
        allCompleted={allCompleted}
      />
    </div>
  )
}

function ModuleEndButton({
  index,
  slug,
  isCompleted,
  isLast,
  onComplete,
}: {
  index: number
  slug: string
  isCompleted: boolean
  isLast: boolean
  onComplete: (index: number) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (isCompleted) return
    setLoading(true)
    try {
      await fetch("/api/capsules/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, moduleIndex: index, completed: true }),
      })
    } catch {
      // Optimistic update
    } finally {
      setLoading(false)
      onComplete(index)
    }
  }

  if (isCompleted) {
    return (
      <div className="mt-8 pt-6 border-t border-border/40">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
          Módulo completado
        </span>
      </div>
    )
  }

  return (
    <div className="mt-8 pt-6 border-t border-border/40">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Guardando..." : isLast ? "Completar cápsula" : "Continuar al siguiente módulo"}
      </Button>
    </div>
  )
}
