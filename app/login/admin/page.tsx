import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthLoader } from "@/components/ui/auth-loader"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { AdminLoginContent } from "./admin-login-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Administracion - Biovity",
  description: "Panel de administracion de Biovity",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <SessionRefresher />
      <AdminLoginContent />
    </Suspense>
  )
}
