import type { ReactNode } from "react"

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-gray-50">{children}</div>
}
