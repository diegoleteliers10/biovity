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
    <main className="p-6 lg:px-12 lg:py-8">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="flex items-center gap-7 pb-7">
          <div className="size-[108px] shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-56 rounded bg-muted animate-pulse" />
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="h-3 w-64 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <div className="h-52 bg-muted animate-pulse rounded-2xl" />
            <div className="h-72 bg-muted animate-pulse rounded-2xl" />
          </div>
          <div className="space-y-5">
            <div className="h-40 bg-muted animate-pulse rounded-2xl" />
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.08em] text-foreground uppercase">
      {children}
    </h2>
  )
}

function ProfileContentInner() {
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
      <main className="p-6">
        <p className="text-destructive text-pretty">
          {userError instanceof Error ? userError.message : "Error al cargar el perfil"}
        </p>
      </main>
    )
  }

  return (
    <main className="p-6 lg:px-12 lg:py-8">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="flex items-center justify-between lg:hidden">
          <MobileMenuButton />
        </div>

        <ProfileIdentityHeader />

        {errors.general && (
          <p className="mt-6 text-sm text-destructive text-pretty">{errors.general}</p>
        )}

        <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <SectionLabel>Sobre mí</SectionLabel>
              <PersonalForm />
            </section>
            <section className="space-y-4">
              <SectionLabel>Experiencia</SectionLabel>
              <ExperienceForm />
            </section>
            <section className="space-y-4">
              <SectionLabel>Formación</SectionLabel>
              <EducationForm />
            </section>
            <section className="space-y-4">
              <SectionLabel>Certificaciones</SectionLabel>
              <CertificationsForm />
            </section>
            <section className="space-y-4">
              <SectionLabel>Idiomas</SectionLabel>
              <LanguagesForm />
            </section>
            <section className="space-y-4">
              <SectionLabel>Enlaces</SectionLabel>
              <LinksForm />
            </section>
          </div>

          <aside className="space-y-5 self-start lg:sticky lg:top-8">
            <ProfileAside />
          </aside>
        </div>
      </div>
    </main>
  )
}

export { ProfileContentInner }
