"use client"

import { useCallback, useEffect, useState } from "react"
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
import { Label } from "@/components/ui/label"
import { PROVIDERS, type ProviderId } from "@/lib/ai/byok/registry"
import {
  type AiCredentialListItem,
  activateCredential,
  deleteCredentialById,
  getMaskedCredential,
  listCredentials,
  saveCredential,
} from "@/lib/api/ai-credentials"

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
      className={`relative rounded-lg border p-4 transition-colors ${
        credential.isActive
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border bg-background"
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
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Activo
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
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
            className="h-7 px-2 text-xs"
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
          className="h-7 px-2 text-xs text-destructive hover:text-destructive/80"
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
    <form onSubmit={handleSubmit} className="rounded-lg border border-dashed p-4 space-y-3">
      <p className="text-sm font-medium">Nueva credencial</p>

      <div className="space-y-2">
        <Label>Proveedor y modelo</Label>
        <ModelSelector open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
          <ModelSelectorTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm outline-offset-2 outline-ring transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2"
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

      <div className="space-y-2">
        <Label htmlFor="new-apikey">API key</Label>
        <Input
          id="new-apikey"
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-label">Etiqueta (opcional)</Label>
        <Input
          id="new-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={64}
          placeholder="Mi clave de OpenAI"
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
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex-1" />
        <Button type="submit" disabled={apiKey.length < 10 || busy} size="sm">
          {busy ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}

export function AiSettingsTab({ organizationId }: { organizationId: string }) {
  const [credentials, setCredentials] = useState<AiCredentialListItem[]>([])
  const [status, setStatus] = useState<Status>({ kind: "loading" })
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchCredentials = useCallback(async () => {
    setStatus({ kind: "loading" })
    const result = await listCredentials(organizationId)
    if (result.isErr()) {
      const fallback = await getMaskedCredential(organizationId)
      if (
        fallback.isOk() &&
        fallback.value.hasCredential &&
        fallback.value.provider &&
        fallback.value.modelId
      ) {
        setCredentials([
          {
            id: "active",
            provider: fallback.value.provider,
            modelId: fallback.value.modelId,
            keyPreview: fallback.value.keyPreview ?? "****",
            label: fallback.value.label,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ])
      }
      setStatus({ kind: "idle" })
      return
    }
    setCredentials(result.value)
    const active = result.value.find((c) => c.isActive)
    if (!active) {
      setCredentials([])
    }
    setStatus({ kind: "idle" })
  }, [organizationId])

  useEffect(() => {
    fetchCredentials()
  }, [fetchCredentials])

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
    fetchCredentials()
  }

  async function handleActivate(credentialId: string) {
    setStatus({ kind: "adding" })
    const result = await activateCredential(organizationId, credentialId)
    if (result.isErr()) {
      setStatus({ kind: "error", message: result.error.message ?? "Error al activar" })
      return
    }
    setStatus({ kind: "saved" })
    fetchCredentials()
  }

  async function handleDelete(credentialId: string) {
    setStatus({ kind: "adding" })
    const result = await deleteCredentialById(organizationId, credentialId)
    if (result.isErr()) {
      setStatus({ kind: "error", message: result.error.message ?? "Error al eliminar" })
      return
    }
    setStatus({ kind: "saved" })
    fetchCredentials()
  }

  const busy = status.kind === "loading" || status.kind === "adding"
  const activeCredential = credentials.find((c) => c.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">Configuracion de IA</h3>
          <p className="text-muted-foreground text-sm">
            Administra las credenciales de proveedores de IA para esta organizacion. Solo puede
            haber una credencial activa a la vez.
          </p>
        </div>
        {!showAddForm && (
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)} disabled={busy}>
            Agregar credencial
          </Button>
        )}
      </div>

      {showAddForm && (
        <AddCredentialForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} busy={busy} />
      )}

      {status.kind === "error" && <p className="text-destructive text-sm">{status.message}</p>}
      {status.kind === "saved" && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">Operacion completada.</p>
      )}

      {status.kind === "loading" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted/30" />
          ))}
        </div>
      ) : credentials.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay credenciales configuradas. Se usa el modelo por defecto de la plataforma.
          </p>
        </div>
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
