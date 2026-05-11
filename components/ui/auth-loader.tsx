"use client"

export function AuthLoader() {
  return (
    <div
      className="flex h-dvh items-center justify-center bg-background"
      aria-label="Cargando"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <span className="text-xs text-muted-foreground">Verificando…</span>
      </div>
    </div>
  )
}
