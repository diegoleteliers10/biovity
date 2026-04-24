"use client"

import { useEffect, useState } from "react"
import { CertificationsForm } from "@/components/dashboard/employee/profile/CertificationsForm"
import { EducationForm } from "@/components/dashboard/employee/profile/EducationForm"
import { ExperienceForm } from "@/components/dashboard/employee/profile/ExperienceForm"
import { LanguagesForm } from "@/components/dashboard/employee/profile/LanguagesForm"
import { LinksForm } from "@/components/dashboard/employee/profile/LinksForm"
import { PersonalForm } from "@/components/dashboard/employee/profile/PersonalForm"
import {
  ProfileProvider,
  useProfileContext,
} from "@/components/dashboard/employee/profile/profile-context"
import { SidebarCard } from "@/components/dashboard/employee/profile/SidebarCard"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"

function ProfileLoadingSkeleton() {
  return (
    <main className="p-6 space-y-6">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 bg-muted animate-pulse rounded-xl" />
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    </main>
  )
}

function ProfileAuthRequired() {
  return (
    <main className="p-6">
      <p className="text-muted-foreground text-pretty">Inicia sesión para ver tu perfil.</p>
    </main>
  )
}

function ProfileErrorState({ message }: { message: string }) {
  return (
    <main className="p-6">
      <p className="text-destructive text-pretty">{message}</p>
    </main>
  )
}

function ProfileContent() {
  const { userId, user, isLoading, errors, userError } = useProfileContext()

  if (!userId) {
    return <ProfileAuthRequired />
  }

  if (userError) {
    return (
      <ProfileErrorState
        message={userError instanceof Error ? userError.message : "Error al cargar el perfil"}
      />
    )
  }

  if (isLoading && !user) {
    return <ProfileLoadingSkeleton />
  }

  return (
    <main className="p-6 space-y-8">
      {/* Top row: menu on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona tu información personal y profesional
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <SidebarCard />

        <div className="space-y-6 min-w-0">
          {errors.general && (
            <p className="text-sm text-destructive text-pretty">{errors.general}</p>
          )}
          <PersonalForm />
          <ExperienceForm />
          <EducationForm />
          <CertificationsForm />
          <LanguagesForm />
          <LinksForm />
        </div>
      </div>
    </main>
  )
}

function EmployeeProfile() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return <ProfileLoadingSkeleton />
  }

  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  )
}

export default EmployeeProfile
