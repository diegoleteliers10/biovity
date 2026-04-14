import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:mt-0 [&>svg~*]:*:+mt-1 [&>p]:text-muted-foreground [&>strong]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border/60",
        destructive: "border-destructive/50 bg-destructive/5 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = ({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => (
  <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
)

const AlertTitle = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
)

const AlertDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p className={cn("text-sm [&_p]:mt-1", className)} {...props} />
)

export { Alert, AlertDescription, AlertTitle }
