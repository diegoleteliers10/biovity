"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { replace } = useRouter()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!session?.user) {
    void replace("/")
    return null
  }

  return <>{children}</>
}
