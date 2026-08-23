import { cn } from "@/lib/utils"

export function EditableCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-surface-container-lowest p-4 sm:p-5 shadow-none",
        className
      )}
    >
      {children}
    </div>
  )
}
