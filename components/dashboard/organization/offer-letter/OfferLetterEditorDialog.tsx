"use client"

import { Briefcase01Icon, EyeIcon, RefreshIcon, SentIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  type OfferLetterData,
  renderOfferLetterPdf,
  sendOfferLetter,
} from "@/lib/api/offer-letters"

type OfferLetterEditorDialogProps = {
  applicationId: string
  candidateName: string
  jobTitle: string
  companyName: string
  salary?: { min?: number; max?: number; currency?: string; period?: string }
  workMode?: string
  signerName?: string
  signerRole?: string
  companyAddress?: string
  onClose: () => void
  onSent?: () => void
}

function formatClp(value: number | undefined): string {
  if (value == null) return ""
  return `$${new Intl.NumberFormat("es-CL").format(value)}`
}

function Field({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs leading-4 font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

/**
 * Mount conditionally (once per application) so the initial state is built
 * from props and the first preview renders exactly once.
 */
export function OfferLetterEditorDialog({
  applicationId,
  candidateName,
  jobTitle,
  companyName,
  salary,
  workMode,
  signerName,
  signerRole,
  companyAddress,
  onClose,
  onSent,
}: OfferLetterEditorDialogProps) {
  const initialRange =
    salary?.min != null && salary?.max != null
      ? `${formatClp(salary.min)} - ${formatClp(salary.max)}`
      : salary?.min != null
        ? formatClp(salary.min)
        : ""

  const [form, setForm] = useState({
    greeting: "Estimado/a {candidate}:",
    intro: "",
    positionSummary: "",
    compensation: initialRange,
    compensationDetail: "",
    benefits: "",
    startDate: "",
    workMode: workMode ?? "Presencial",
    conditions: "",
    closing: "",
    signerName: signerName ?? "",
    signerRole: signerRole ?? "",
    companyAddress: companyAddress ?? "",
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const previewUrlRef = useRef<string | null>(null)

  const letterData = useMemo<OfferLetterData>(
    () => ({
      companyName,
      candidateName,
      jobTitle,
      greeting: form.greeting,
      intro: form.intro,
      positionSummary: form.positionSummary,
      compensation: form.compensation,
      compensationDetail: form.compensationDetail,
      benefits: form.benefits
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      startDate: form.startDate,
      workMode: form.workMode,
      conditions: form.conditions,
      closing: form.closing,
      signerName: form.signerName,
      signerRole: form.signerRole,
      companyAddress: form.companyAddress,
    }),
    [companyName, candidateName, jobTitle, form]
  )
  const letterDataRef = useRef(letterData)
  useEffect(() => {
    letterDataRef.current = letterData
  }, [letterData])

  const update = useCallback(
    (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value })),
    []
  )

  const setPreviewBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    previewUrlRef.current = url
    setPreviewUrl(url)
  }, [])

  const generatePreview = useCallback(async () => {
    setIsRendering(true)
    const result = await renderOfferLetterPdf(letterDataRef.current)
    setIsRendering(false)
    if (!result.isOk()) {
      toast.error(result.error)
      return
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    setPreviewBlob(result.value)
  }, [setPreviewBlob])

  // First preview on mount; afterwards refresh is manual.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only initial preview
  useEffect(() => {
    void generatePreview()
  }, [])

  // Revoke the blob URL when the dialog unmounts.
  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    },
    []
  )

  const handleSend = useCallback(async () => {
    setIsSending(true)
    const result = await sendOfferLetter({ applicationId, letterData: letterDataRef.current })
    setIsSending(false)
    if (!result.isOk()) {
      toast.error(result.error)
      return
    }
    toast.success(
      result.value.emailed
        ? "Oferta enviada por chat y correo al candidato."
        : "Oferta enviada por chat al candidato."
    )
    onClose()
    onSent?.()
  }, [applicationId, onClose, onSent])

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="flex h-[90dvh] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-border/40 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <HugeiconsIcon icon={Briefcase01Icon} size={18} className="text-secondary" />
            Carta de oferta para {candidateName}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {jobTitle} · {companyName}. Se envía por chat y correo con el PDF adjunto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Formulario */}
          <div className="min-h-0 overflow-y-auto border-b border-border/40 p-5 lg:border-b-0 lg:border-r">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Saludo ({candidate} = nombre)" full>
                <Input
                  value={form.greeting}
                  onChange={(e) => update("greeting", e.target.value)}
                  placeholder="Estimado/a {candidate}:"
                />
              </Field>
              <Field label="Introducción" full>
                <Textarea
                  value={form.intro}
                  onChange={(e) => update("intro", e.target.value)}
                  placeholder="Nos alegra extenderte la siguiente oferta..."
                  rows={3}
                />
              </Field>
              <Field label="Sobre la posición" full>
                <Textarea
                  value={form.positionSummary}
                  onChange={(e) => update("positionSummary", e.target.value)}
                  placeholder="Responsabilidades y contexto del rol..."
                  rows={3}
                />
              </Field>
              <Field label="Compensación">
                <Input
                  value={form.compensation}
                  onChange={(e) => update("compensation", e.target.value)}
                  placeholder="$1.300.000 - $1.700.000"
                />
              </Field>
              <Field label="Fecha de inicio">
                <Input
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  placeholder="1 de marzo, 2027"
                />
              </Field>
              <Field label="Modalidad">
                <Select value={form.workMode} onValueChange={(v) => update("workMode", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Jornada / contrato">
                <Input
                  value={form.compensationDetail}
                  onChange={(e) => update("compensationDetail", e.target.value)}
                  placeholder="Jornada completa, liquidaciones mensuales..."
                />
              </Field>
              <Field label="Beneficios (uno por línea)" full>
                <Textarea
                  value={form.benefits}
                  onChange={(e) => update("benefits", e.target.value)}
                  placeholder={"Seguro de salud\nDías administrativos\nCapacitaciones"}
                  rows={4}
                />
              </Field>
              <Field label="Condiciones adicionales" full>
                <Textarea
                  value={form.conditions}
                  onChange={(e) => update("conditions", e.target.value)}
                  placeholder="Período de prueba, confidencialidad, etc."
                  rows={3}
                />
              </Field>
              <Field label="Cierre" full>
                <Textarea
                  value={form.closing}
                  onChange={(e) => update("closing", e.target.value)}
                  rows={3}
                />
              </Field>
              <Field label="Firma: nombre">
                <Input
                  value={form.signerName}
                  onChange={(e) => update("signerName", e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </Field>
              <Field label="Firma: cargo">
                <Input
                  value={form.signerRole}
                  onChange={(e) => update("signerRole", e.target.value)}
                  placeholder="Gerente de Talento"
                />
              </Field>
              <Field label="Dirección de la empresa" full>
                <Input
                  value={form.companyAddress}
                  onChange={(e) => update("companyAddress", e.target.value)}
                  placeholder="Providencia, Santiago, Chile"
                />
              </Field>
            </div>
          </div>

          {/* Vista previa */}
          <div className="flex min-h-0 flex-col bg-surface-container-low">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <HugeiconsIcon icon={EyeIcon} size={15} />
                Vista previa
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void generatePreview()}
                disabled={isRendering}
                className="h-7 gap-1.5 rounded-md px-2.5 text-xs"
              >
                <HugeiconsIcon
                  icon={RefreshIcon}
                  size={14}
                  className={isRendering ? "animate-spin" : ""}
                />
                {isRendering ? "Generando..." : "Actualizar"}
              </Button>
            </div>
            <div className="min-h-0 flex-1 p-4">
              {previewUrl ? (
                <iframe
                  title="Vista previa de la carta de oferta"
                  src={previewUrl}
                  className="h-full w-full rounded-lg border border-border/40 bg-white"
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/60">
                  <p className="text-sm text-muted-foreground">
                    {isRendering ? "Generando vista previa..." : "Sin vista previa"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-border/40 px-5 py-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending}
            className="h-9 rounded-lg px-4"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => void handleSend()}
            disabled={isSending}
            className="h-9 gap-2 rounded-lg px-4"
          >
            <HugeiconsIcon icon={SentIcon} size={16} />
            {isSending ? "Enviando..." : "Enviar oferta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
