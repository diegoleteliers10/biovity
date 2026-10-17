import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminButtonProps = React.ComponentProps<typeof Button>

const sizeClasses: Record<NonNullable<AdminButtonProps["size"]>, string> = {
  default: "h-11 rounded-lg px-6 text-sm font-medium",
  xs: "h-8 rounded-md px-2 text-xs font-medium",
  sm: "h-9 rounded-md px-3 text-xs font-medium",
  lg: "h-11 rounded-lg px-6 text-sm font-medium",
  icon: "size-9 rounded-lg",
  "icon-xs": "size-7 rounded-md",
  "icon-sm": "size-8 rounded-lg",
  "icon-lg": "size-10 rounded-lg",
}

const variantClasses: Record<NonNullable<AdminButtonProps["variant"]>, string> = {
  default:
    "dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:focus-visible:border-primary dark:focus-visible:ring-primary/40",
  outline:
    "border-border/40 bg-surface-container-lowest text-foreground hover:bg-surface-container-low",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  ghost: "text-muted-foreground hover:text-foreground",
  destructive: "",
  link: "",
}

export function AdminButton({
  className,
  size = "default",
  variant = "default",
  ...props
}: AdminButtonProps) {
  const resolvedSize = size ?? "default"
  const resolvedVariant = variant ?? "default"

  return (
    <Button
      {...props}
      size={resolvedSize}
      variant={resolvedVariant}
      className={cn(sizeClasses[resolvedSize], variantClasses[resolvedVariant], className)}
    />
  )
}
