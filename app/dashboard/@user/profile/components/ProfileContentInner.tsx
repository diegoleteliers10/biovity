"use client"

import { useState } from "react"

import { CertificationsForm } from "@/components/dashboard/employee/profile/CertificationsForm"
import { EducationForm } from "@/components/dashboard/employee/profile/EducationForm"
import { ExperienceForm } from "@/components/dashboard/employee/profile/ExperienceForm"
import { LanguagesForm } from "@/components/dashboard/employee/profile/LanguagesForm"
import { LinksForm } from "@/components/dashboard/employee/profile/LinksForm"
import { PersonalForm } from "@/components/dashboard/employee/profile/PersonalForm"
import { ProfileAside } from "@/components/dashboard/employee/profile/ProfileAside"
import { ProfileIdentityHeader } from "@/components/dashboard/employee/profile/ProfileIdentityHeader"
import { useProfileContext } from "@/components/dashboard/employee/profile/profile-context"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { useMountEffect } from "@/hooks/use-mount-effect"

function ProfileLoadingSkeleton() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="flex flex-col items-start gap-6 border-b border-border/40 pb-6 lg:flex-row lg:items-center">
          <div className="size-24 sm:size-28 shrink-0 rounded-full bg-surface-container-highest/60 animate-pulse" />
          <div className="flex-1 space-y-2.5">
            <div className="h-7 w-56 rounded-md bg-surface-container-highest/60 animate-pulse" />
            <div className="h-4 w-40 rounded-md bg-surface-container-highest/60 animate-pulse" />
            <div className="h-3 w-64 rounded-md bg-surface-container-highest/60 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="h-44 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
            <div className="h-56 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
            <div className="h-56 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-36 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
            <div className="h-48 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
            <div className="h-28 rounded-xl border border-border/40 bg-surface-container-low animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-foreground">{children}</h2>
}

export function ProfileContentInner() {
  const { userId, user, isLoading, errors, userError } = useProfileContext()
  const [mounted, setMounted] = useState(false)

  useMountEffect(() => {
    setMounted(true)
  })

  if (!mounted || !userId || isLoading || !user) {
    return <ProfileLoadingSkeleton />
  }

  if (userError) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 p-5 max-w-md shadow-none">
          <p className="text-sm font-medium text-foreground">No se pudo cargar tu perfil</p>
          <p className="text-xs text-muted-foreground">
            {userError instanceof Error ? userError.message : "Error inesperado."}
          </p>
          <p className="text-xs text-muted-foreground">
            Recarga la página para intentarlo de nuevo.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="flex items-center justify-between lg:hidden mb-4">
          <MobileMenuButton />
        </div>

        <ProfileIdentityHeader />

        {errors.general && (
          <p className="mt-4 text-xs text-destructive text-pretty">{errors.general}</p>
        )}

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            <section className="space-y-2.5">
              <SectionLabel>Sobre mí</SectionLabel>
              <PersonalForm />
            </section>
            <section className="space-y-2.5">
              <SectionLabel>Experiencia</SectionLabel>
              <ExperienceForm />
            </section>
            <section className="space-y-2.5">
              <SectionLabel>Formación</SectionLabel>
              <EducationForm />
            </section>
            <section className="space-y-2.5">
              <SectionLabel>Certificaciones</SectionLabel>
              <CertificationsForm />
            </section>
            <section className="space-y-2.5">
              <SectionLabel>Idiomas</SectionLabel>
              <LanguagesForm />
            </section>
            <section className="space-y-2.5">
              <SectionLabel>Enlaces</SectionLabel>
              <LinksForm />
            </section>
          </div>

          <aside className="space-y-4 self-start lg:sticky lg:top-8">
            <ProfileAside />
          </aside>
        </div>
      </div>
    </main>
  )
}
