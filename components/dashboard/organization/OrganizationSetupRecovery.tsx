"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateOrganizationMutation } from "@/lib/api/use-organization-mutations"

export function OrganizationSetupRecovery() {
  const router = useRouter()
  const createOrganization = useCreateOrganizationMutation()
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createOrganization.mutate(
      { name: name.trim(), website: website.trim() },
      { onSuccess: () => router.refresh() }
    )
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl items-center px-4 py-12 sm:px-6">
      <form
        onSubmit={submit}
        className="w-full space-y-5 rounded-xl border border-border bg-card p-6"
      >
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Completa tu organización</h1>
          <p className="text-sm text-muted-foreground">
            La cuenta existe, pero falta guardar los datos de la organización.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="organization-name" className="block text-sm font-medium">
            Nombre de la organización
          </label>
          <Input
            id="organization-name"
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="organization-website" className="block text-sm font-medium">
            Sitio web
          </label>
          <Input
            id="organization-website"
            type="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        {createOrganization.error ? (
          <p role="alert" className="text-sm text-destructive">
            {createOrganization.error.message}
          </p>
        ) : null}
        <Button type="submit" disabled={createOrganization.isPending || name.trim().length < 2}>
          {createOrganization.isPending ? "Guardando" : "Guardar organización"}
        </Button>
      </form>
    </main>
  )
}
