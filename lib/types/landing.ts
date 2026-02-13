import type { IconSvgElement } from "@hugeicons/react"

/**
 * Base shape for landing sections that render an icon card with title and description.
 * Keeps interfaces small and specific (Interface Segregation); extend for extra fields.
 */
export interface IconTitleDescription {
  icon: IconSvgElement
  title: string
  description: string
}
