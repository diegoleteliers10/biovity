// Subscription plan definitions and pricing for Biovity
// Used by frontend components to display plan info

export type PlanKey = "pro" | "business"

export const PLAN_PRICES_CLP: Record<PlanKey, number> = {
  pro: 40_000,
  business: 80_000,
} as const

// Plan display names in Spanish
export const PLAN_DISPLAY_NAMES: Record<PlanKey, string> = {
  pro: "Pro",
  business: "Business",
}

// Features included in each plan (for display purposes)
export const PLAN_FEATURES: Record<PlanKey, string[]> = {
  pro: [
    "10 ofertas activas",
    "Acceso completo a perfiles",
    "Filtros avanzados de busqueda",
    "4 ofertas destacadas/mes",
    "Soporte por email y llamada",
    "ATS completo",
    "AI Matching de candidatos",
  ],
  business: [
    "20 ofertas activas",
    "Acceso completo a perfiles",
    "Filtros avanzados de busqueda",
    "10 ofertas destacadas/mes",
    "Soporte prioritario 24/7",
    "ATS completo",
    "AI Matching de candidatos",
    "Pagina de empresa personalizada",
  ],
}

// Enterprise plan (custom pricing, contact sales)
export const ENTERPRISE_PLAN = {
  name: "Enterprise",
  price: null,
  description: "Soluciones a medida para grandes organizaciones.",
  features: [
    "Ofertas ilimitadas",
    "Acceso completo a perfiles",
    "Todas las funcionalidades",
    "Account manager dedicado",
    "Soporte prioritario 24/7",
    "Integraciones personalizadas",
    "Onboarding personalizado",
    "SLA garantizado",
  ],
} as const

/**
 * Get plan display price formatted as CLP string.
 */
export function getPlanDisplayPrice(plan: PlanKey): string {
  const price = PLAN_PRICES_CLP[plan]
  return price.toLocaleString("es-CL")
}

/**
 * Check if a plan requires contact (Enterprise)
 */
export function isContactPlan(plan: string): boolean {
  return plan === "enterprise"
}
