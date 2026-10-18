export function isPendingToolApproval(value: unknown, state: unknown): value is { id: string } {
  if (state !== "approval-requested" || !value || typeof value !== "object" || !("id" in value)) {
    return false
  }
  return typeof value.id === "string" && value.id.length > 0
}
