import {
  Agreement01Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const TRUST_ITEMS = [
  { icon: Shield01Icon, label: "Empresas verificadas" },
  { icon: EyeIcon, label: "Salarios visibles" },
  { icon: CheckmarkCircle02Icon, label: "Ofertas reales" },
  { icon: Agreement01Icon, label: "Gratis para profesionales" },
]

/**
 * Quiet trust strip under the hero: one line of icon + label, no cards,
 * no descriptions. Replaces the old 4-card transparency grid.
 */
export function TrustStrip() {
  return (
    <section className="bg-surface-container-low border-y border-border/40 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <HugeiconsIcon icon={item.icon} size={16} className="shrink-0" strokeWidth={1.75} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
