"use client"

import { Button } from "@/components/ui/button"
import { signOutAndRedirect } from "@/lib/auth-client"

export function LogoutButton() {
  const handleLogout = async () => {
    await signOutAndRedirect("/")
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="mt-4">
      Cerrar sesion
    </Button>
  )
}
