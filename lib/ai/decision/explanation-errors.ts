export function explanationErrorCode(error: Error): string {
  const message = error.message.toLowerCase()
  if (message.includes("insufficient balance") || message.includes("no resource package"))
    return "provider_balance"
  if ("statusCode" in error && error.statusCode === 429) return "provider_rate_limit"
  if ("statusCode" in error && (error.statusCode === 401 || error.statusCode === 403))
    return "provider_auth"
  if (error.name === "TimeoutError" || error.name === "AbortError") return "provider_timeout"
  return "explanation_failed"
}

export function explanationErrorMessage(code: string | null): string {
  switch (code) {
    case "provider_balance":
      return "El proveedor de IA no tiene saldo o un paquete de API disponible. Revisa la cuenta de la clave configurada. El score de Jev no cambia."
    case "provider_rate_limit":
      return "El proveedor de IA alcanzó su límite de solicitudes. Vuelve a intentar más tarde. El score de Jev no cambia."
    case "provider_auth":
      return "El proveedor de IA rechazó la clave de API. Revisa la configuración. El score de Jev no cambia."
    case "provider_timeout":
      return "La explicación superó el tiempo de espera. Vuelve a intentar. El score de Jev no cambia."
    case "invalid_explanation_format":
      return "El proveedor de IA devolvió una explicación con formato inválido. Vuelve a intentar. El score de Jev no cambia."
    case "unsupported_evidence":
      return "La explicación no contiene citas válidas del perfil o de la oferta. Vuelve a intentar. El score de Jev no cambia."
    default:
      return "No se pudo generar la explicación. El score de Jev no cambia."
  }
}
