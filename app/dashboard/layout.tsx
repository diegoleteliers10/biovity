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
}) {
  const role = await checkUserRole()
  if (!role) redirect("/register")

  if (role === "admin") return admin
  if (role === "organization") return organization
  return user
}
