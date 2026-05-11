export function QuestionsListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-16 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  )
}
