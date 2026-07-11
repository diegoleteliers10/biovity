import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { checkUserRole } from "@/lib/auth"

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
  return <>{slot}</>
}
