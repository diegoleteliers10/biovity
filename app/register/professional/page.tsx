import type { Metadata } from "next"
import { Suspense } from "react"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { AuthLoader } from "@/components/ui/auth-loader"
import { UserRegisterContent } from "./register-user-content"

export const dynamic = "force-dynamic"

export default function UserRegisterPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <SessionRefresher />
      <UserRegisterContent />
    </Suspense>
  )
}
