interface OfertasErrorStateProps {
  error: Error
}

export function OfertasErrorState({ error }: OfertasErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
      <p className="text-destructive text-sm">{error.message}</p>
    </div>
  )
}
