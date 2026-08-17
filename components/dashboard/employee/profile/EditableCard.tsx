import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function EditableCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <Card className={cn("bg-white", className)}>{children}</Card>
}
