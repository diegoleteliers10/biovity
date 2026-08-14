import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { FeaturebaseDashboardProvider } from "@/components/featurebase/FeaturebaseDashboardProvider"
import { checkUserRole, getServerSession } from "@/lib/auth"
import {
  FEATUREBASE_APP_ID,
  FEATUREBASE_BOARDS,
  isFeaturebaseEnabled,
} from "@/lib/featurebase/config"
import { signFeaturebaseJwt } from "@/lib/featurebase/jwt"

export default async function DashboardLayout({
  user,
  admin,
  organization,
}: {
  user: ReactNode
  admin: ReactNode
  organization: ReactNode
  children: ReactNode
}) {
  const role = await checkUserRole()
  if (!role) redirect("/")

  const slot = role === "admin" ? admin : role === "organization" ? organization : user

  if (isFeaturebaseEnabled()) {
    const session = await getServerSession()
    const sessionUser = session?.user as
      | { id?: string; email?: string; name?: string; avatar?: string }
      | undefined

    if (sessionUser?.id && sessionUser.email) {
      const jwt = signFeaturebaseJwt({
        userId: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        profilePicture: sessionUser.avatar || undefined,
        locale: "es",
      })
      return (
        <FeaturebaseDashboardProvider
          appId={FEATUREBASE_APP_ID}
          jwt={jwt}
          board={FEATUREBASE_BOARDS[role]}
        >
          {slot}
        </FeaturebaseDashboardProvider>
      )
    }
  }

  return <>{slot}</>
}
