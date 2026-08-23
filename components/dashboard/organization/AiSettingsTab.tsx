"use client"

import { Add01Icon, AiMagicIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PROVIDERS, type ProviderId } from "@/lib/ai/byok/registry"
import {
  type AiCredentialListItem,
  activateCredential,
  deleteCredentialById,
  getMaskedCredential,
  listCredentials,
  saveCredential,
} from "@/lib/api/ai-credentials"
import { btnAccentClass, FieldLabel, StateCard } from "./SettingsUi"

const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[]

const PROVIDER_LOGO_MAP: Record<ProviderId, string> = {
  openai: "openai",
  anthropic: "anthropic",
  google: "google",
  zai: "zai",
  openrouter: "openrouter",
}

type FlatModel = {
  id: string
  label: string
  provider: ProviderId
  providerLabel: string
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "adding" }
  | { kind: "error"; message: string }
  | { kind: "saved" }

function CredentialCard({
  credential,
  onActivate,
  onDelete,
  busy,
}: {
  credential: AiCredentialListItem
  onActivate: (id: string) => void
  onDelete: (id: string) => void
  busy: boolean
}) {
  const providerConfig = PROVIDERS[credential.provider]

  return (
    <div
      className={`relative rounded-xl border p-4 shadow-none transition-colors ${
        credential.isActive
          ? "border-secondary/30 bg-secondary/5"
          : "border-border/50 bg-surface-container-lowest"
      }`}
    >
      <div className="flex items-start gap-3">
        <ModelSelectorLogo
          provider={PROVIDER_LOGO_MAP[credential.provider]}
          className="size-5 mt-0.5"
        />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">
              {providerConfig?.label ?? credential.provider}
            </p>
            {credential.isActive ? (
              <span className="shrink-0 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                Activo
              </span>
            ) : (
              <span className="shrink-0 rounded-md bg-surface-container-highest px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Inactivo
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{credential.modelId}</p>
          {credential.label && (
            <p className="text-xs text-muted-foreground truncate">{credential.label}</p>
          )}
          <p className="font-mono text-xs text-muted-foreground">{credential.keyPreview}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-3">
        {!credential.isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onActivate(credential.id)}
            disabled={busy}
            className="h-9 rounded-md px-3 text-xs font-medium"
          >
            Activar
          </Button>
        )}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(credential.id)}
          disabled={busy}
          className="h-9 rounded-md px-3 text-xs font-medium text-destructive hover:text-destructive/80"
        >
          Eliminar
        </Button>
      </div>
    </div>
  )
}

function AddCredentialForm({
  onAdd,
  onCancel,
  busy,
}: {
  onAdd: (input: { provider: ProviderId; modelId: string; apiKey: string; label?: string }) => void
  onCancel: () => void
  busy: boolean
}) {
  const [provider, setProvider] = useState<ProviderId>("openai")
  const [modelId, setModelId] = useState(PROVIDERS.openai.defaultModel)
  const [apiKey, setApiKey] = useState("")
  const [label, setLabel] = useState("")
  const [modelDialogOpen, setModelDialogOpen] = useState(false)

  const allModels = PROVIDER_IDS.flatMap((pid) =>
    PROVIDERS[pid].models.map((m) => ({
      id: m.id,
      label: m.label,
      provider: pid,
      providerLabel: PROVIDERS[pid].label,
    }))
  )

  const selectedModel =
    allModels.find((m) => m.id === modelId && m.provider === provider) ?? allModels[0]

  function handleModelSelect(model: FlatModel) {
    setProvider(model.provider)
    setModelId(model.id)
    setModelDialogOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (apiKey.length < 10) return
    onAdd({
      provider,
      modelId,
      apiKey,
      label: label.trim() || undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-dashed border-border/50 p-4 space-y-3 shadow-none"
    >
      <p className="text-sm font-medium">Nueva credencial</p>

      <div className="space-y-1.5">
        <FieldLabel>Proveedor y modelo</FieldLabel>
        <ModelSelector open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
          <ModelSelectorTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-full items-center gap-2.5 rounded-md border border-input bg-input/20 px-2.5 text-[13px] leading-4 transition-colors outline-none hover:bg-input/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <ModelSelectorLogo
                provider={PROVIDER_LOGO_MAP[selectedModel.provider]}
                className="size-4"
              />
              <span className="flex-1 text-left truncate font-medium">{selectedModel.label}</span>
              <span className="text-muted-foreground text-xs">{selectedModel.providerLabel}</span>
            </button>
          </ModelSelectorTrigger>
          <ModelSelectorContent title="Seleccionar modelo">
            <ModelSelectorInput placeholder="Buscar modelo..." />
            <ModelSelectorList>
              <ModelSelectorEmpty>No se encontraron modelos.</ModelSelectorEmpty>
              {PROVIDER_IDS.map((pid) => (
                <ModelSelectorGroup key={pid} heading={PROVIDERS[pid].label}>
                  {PROVIDERS[pid].models.map((m) => (
                    <ModelSelectorItem
                      key={`${pid}/${m.id}`}
                      value={`${pid}/${m.id}/${m.label}`}
                      onSelect={() =>
                        handleModelSelect({
                          id: m.id,
                          label: m.label,
                          provider: pid,
                          providerLabel: PROVIDERS[pid].label,
                        })
                      }
                    >
                      <ModelSelectorLogo provider={PROVIDER_LOGO_MAP[pid]} />
                      <ModelSelectorName>{m.label}</ModelSelectorName>
                    </ModelSelectorItem>
                  ))}
                </ModelSelectorGroup>
              ))}
            </ModelSelectorList>
          </ModelSelectorContent>
        </ModelSelector>
      </div>

      <div className="space-y-1.5">
        <FieldLabel htmlFor="new-apikey">API key</FieldLabel>
        <Input
          id="new-apikey"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="h-9"
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel htmlFor="new-label">Etiqueta (opcional)</FieldLabel>
        <Input
          id="new-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={64}
          placeholder="Mi clave de OpenAI"
          className="h-9"
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Obtén tu key en{" "}
        <a
          href={PROVIDERS[provider].docsUrl}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {PROVIDERS[provider].docsUrl}
        </a>
      </p>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-9 rounded-md px-3">
          Cancelar
        </Button>
        <div className="flex-1" />
        <Button type="submit" disabled={apiKey.length < 10 || busy} className="h-9 rounded-md px-3">
          {busy ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}

export function AiSettingsTab({ organizationId }: { organizationId: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [showAddForm, setShowAddForm] = useState(false)

  const credentialsQuery = useQuery({
    queryKey: ["ai-credentials", organizationId],
    queryFn: async () => {
      const result = await listCredentials(organizationId)
      if (result.isErr()) {
        const fallback = await getMaskedCredential(organizationId)
        if (
          fallback.isOk() &&
          fallback.value.hasCredential &&
          fallback.value.provider &&
          fallback.value.modelId
        ) {
          return [
            {
              id: "active",
              provider: fallback.value.provider,
              modelId: fallback.value.modelId,
              keyPreview: fallback.value.keyPreview ?? "****",
              label: fallback.value.label,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ]
        }
        return []
      }
      const active = result.value.find((c) => c.isActive)
      if (!active) {
        return []
      }
      return result.value
    },
  })

  const credentials = credentialsQuery.data ?? []

  async function handleAdd(input: {
    provider: ProviderId
    modelId: string
    apiKey: string
    label?: string
  }) {
    setStatus({ kind: "adding" })
    const result = await saveCredential(organizationId, input)
    if (result.isErr()) {
      setStatus({ kind: "error", message: result.error.message ?? "Error al guardar" })
      return
    }
    setShowAddForm(false)
    setStatus({ kind: "saved" })
    void credentialsQuery.refetch()
  }

  async function handleActivate(credentialId: string) {
    setStatus({ kind: "adding" })
    const result = await activateCredential(organizationId, credentialId)
    if (result.isErr()) {
      setStatus({ kind: "error", message: result.error.message ?? "Error al activar" })
      return
    }
    setStatus({ kind: "saved" })
    void credentialsQuery.refetch()
  }

  async function handleDelete(credentialId: string) {
    setStatus({ kind: "adding" })
    const result = await deleteCredentialById(organizationId, credentialId)
    if (result.isErr()) {
      setStatus({ kind: "error", message: result.error.message ?? "Error al eliminar" })
      return
    }
    setStatus({ kind: "saved" })
    void credentialsQuery.refetch()
  }

  const busy = credentialsQuery.isLoading || status.kind === "adding"
  const activeCredential = credentials.find((c) => c.isActive)

  return (
    <div className="space-y-6">
      {credentials.length > 0 && !showAddForm && (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            disabled={busy}
            className="h-9 rounded-md px-3"
          >
            Agregar credencial
          </Button>
        </div>
      )}

      {showAddForm && (
        <AddCredentialForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} busy={busy} />
      )}

      {status.kind === "error" && <p className="text-destructive text-sm">{status.message}</p>}
      {status.kind === "saved" && <p className="text-sm text-secondary">Operación completada.</p>}

      {credentialsQuery.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-surface-container-highest/60"
            />
          ))}
        </div>
      ) : credentials.length === 0 ? (
        <StateCard
          icon={AiMagicIcon}
          violet
          title="No hay credenciales configuradas"
          chip={
            <span className="rounded-md border border-accent/20 bg-accent/15 px-2 py-0.5 text-xs leading-4 font-medium text-accent">
              Modelo por defecto
            </span>
          }
        >
          <p className="mt-1 max-w-[52ch] text-sm leading-6 text-muted-foreground text-pretty">
            Se usa el modelo por defecto de la plataforma para calcular la compatibilidad entre
            candidatos y ofertas.
          </p>
          {!showAddForm && (
            <div className="mt-4">
              <Button
                className={`${btnAccentClass} h-9 rounded-md px-3`}
                onClick={() => setShowAddForm(true)}
                disabled={busy}
              >
                <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={1.8} />
                Agregar credencial
              </Button>
            </div>
          )}
        </StateCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {credentials.map((cred) => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              onActivate={handleActivate}
              onDelete={handleDelete}
              busy={busy}
            />
          ))}
        </div>
      )}

      {!activeCredential && credentials.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Ninguna credencial activa. Se usa el modelo por defecto de la plataforma.
        </p>
      )}
    </div>
  )
}
