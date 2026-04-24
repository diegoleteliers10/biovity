"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const { signOut } = authClient

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
          router.push("/login")
        },
      },
    })
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="mt-4">
      Cerrar sesión
    </Button>
  )
}
