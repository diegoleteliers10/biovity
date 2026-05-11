"use client"

type EventFormErrorProps = {
  error: Error | null
}

export function EventFormError({ error }: EventFormErrorProps) {
  if (!error) return null
  return <p className="text-sm text-destructive">{error.message || "Error en el evento"}</p>
}
