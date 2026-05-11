export function QuestionsErrorState({ error }: { error?: Error | null }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-10 text-center">
      <p className="text-sm text-destructive">
        Error al cargar preguntas. Verifica que el job exista.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {error instanceof Error ? error.message : "Intenta recargar la página"}
      </p>
    </div>
  )
}
