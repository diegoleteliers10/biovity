import type { LucideIcon } from "lucide-react"

/**
 * Base shape for landing sections that render an icon card with title and description.
 * Keeps interfaces small and specific (Interface Segregation); extend for extra fields.
 */
export interface IconTitleDescription {
  icon: LucideIcon
  title: string
  description: string
}
