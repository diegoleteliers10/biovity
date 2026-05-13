import { Suspense } from "react"
import type { ClientSession } from "@/components/dashboard/employee/profile/profile-context"
import { ProfileProvider } from "@/components/dashboard/employee/profile/profile-context"
import { getServerSession } from "@/lib/auth"
import { ProfileContentInner } from "./components/ProfileContentInner"

type PageProps = {
  children?: React.ReactNode
}

async function ProfileContent() {
  const session = await getServerSession()
  // Convert server session to client session format
  const clientSession: ClientSession | null = session
    ? {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          type: (session.user as { type?: string }).type,
          profession: (session.user as { profession?: string }).profession,
          avatar: (session.user as { avatar?: string | null }).avatar,
        },
        session: session.session
          ? {
              id: session.session.id,
              expiresAt: session.session.expiresAt,
              token: session.session.token,
            }
          : null,
      }
    : null

  return (
    <ProfileProvider session={clientSession}>
      <Suspense
        fallback={
          <main className="p-6">
            <p className="text-muted-foreground text-pretty">Cargando...</p>
          </main>
        }
      >
        <ProfileContentInner />
      </Suspense>
    </ProfileProvider>
  )
}

export default async function EmployeeProfilePage(_props: PageProps) {
  return <ProfileContent />
}
