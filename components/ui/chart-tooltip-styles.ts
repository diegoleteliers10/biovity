import type { CSSProperties } from "react"

export const chartTooltipStyles = {
  contentStyle: {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--popover-foreground)",
    fontSize: 12,
    boxShadow: "0 4px 16px rgb(0 0 0 / 0.2)",
  } satisfies CSSProperties,
  labelStyle: { color: "var(--muted-foreground)" } satisfies CSSProperties,
  itemStyle: { color: "var(--popover-foreground)" } satisfies CSSProperties,
}
