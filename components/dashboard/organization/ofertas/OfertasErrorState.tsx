import { Button } from "@/components/ui/button"

interface OfertasErrorStateProps {
  error: Error
  onRetry?: () => void
}

export function OfertasErrorState({ error, onRetry }: OfertasErrorStateProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
      <p className="text-destructive text-sm">{error.message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
