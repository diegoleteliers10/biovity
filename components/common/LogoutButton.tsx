"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const { signOut } = authClient

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login")
          },
        },
      })
    } catch (_error) {
      router.push("/login")
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="mt-4"
    >
      Cerrar sesión
    </Button>
  )
}
