import { PLANES_EMPRESAS } from "@/lib/data/empresas-data"
import { CARRERA_CHART_DATA } from "@/lib/data/salarios-data"

export function pricingMarkdown() {
  return PLANES_EMPRESAS.map((plan) => {
    const price =
      plan.price === "Personalizado" ? "Precio personalizado" : `$${plan.price} CLP ${plan.period}`
    return `## ${plan.name}\n\n${price}\n\n${plan.description}\n\n${plan.features.map((feature) => `- ${feature}`).join("\n")}\n\n[${plan.cta}](https://biovity.cl${plan.href})`
  }).join("\n\n")
}

export function salariesMarkdown() {
  return CARRERA_CHART_DATA.map(
    (career) =>
      `- ${career.carrera}: junior $${(career.junior * 1000).toLocaleString("es-CL")} CLP, senior $${(career.senior * 1000).toLocaleString("es-CL")} CLP`
  ).join("\n")
}
