import { Divider } from "@/components/pdf/divider/divider"
import { Heading } from "@/components/pdf/heading/heading"
import { KeyValue } from "@/components/pdf/key-value/key-value"
import { PdfList } from "@/components/pdf/list/list"
import { PdfImage } from "@/components/pdf/pdf-image/pdf-image"
import { PdfSignatureBlock as Signature } from "@/components/pdf/signature/signature"
import { Text } from "@/components/pdf/text/text"
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider"
import type { OfferLetterData } from "@/lib/api/offer-letters"
import { View } from "@/lib/pdf-primitives"

export const defaultOfferLetterData = (data: Partial<OfferLetterData> = {}): OfferLetterData => ({
  companyName: data.companyName ?? "",
  candidateName: data.candidateName ?? "",
  jobTitle: data.jobTitle ?? "",
  logoUrl: data.logoUrl ?? "",
  letterRef: data.letterRef ?? "",
  issueDate: data.issueDate ?? "",
  greeting: data.greeting ?? "Estimado/a {candidate}:",
  intro:
    data.intro ??
    "Tras nuestro proceso de selección, tenemos el agrado de extenderte la siguiente oferta para incorporarte a nuestro equipo.",
  positionSummary: data.positionSummary ?? "",
  compensation: data.compensation ?? "",
  compensationDetail: data.compensationDetail ?? "",
  benefits: data.benefits ?? [],
  startDate: data.startDate ?? "",
  workMode: data.workMode ?? "",
  contractType: data.contractType ?? "",
  workSchedule: data.workSchedule ?? "",
  probationPeriod: data.probationPeriod ?? "",
  noticePeriod: data.noticePeriod ?? "",
  vacationDays: data.vacationDays ?? "",
  bonusDetails: data.bonusDetails ?? "",
  offerValidUntil: data.offerValidUntil ?? "",
  conditions: data.conditions ?? "",
  closing:
    data.closing ??
    "Para hacer efectiva esta oferta, responde este mensaje aceptando o rechazando desde tu dashboard de Biovity. Quedamos atentos a tu confirmación.",
  acceptanceNote:
    data.acceptanceNote ??
    "Al aceptar esta carta, el candidato declara haber leído y comprendido las condiciones aquí descritas, y autoriza a la empresa a iniciar el proceso de onboarding y registro laboral.",
  signerName: data.signerName ?? "",
  signerRole: data.signerRole ?? "",
  companyAddress: data.companyAddress ?? "",
  hrContactName: data.hrContactName ?? "",
  hrContactEmail: data.hrContactEmail ?? "",
  hrContactPhone: data.hrContactPhone ?? "",
})

/** Paragraph: pdfcn Text renders inline (<span>), so block it with a View. */
function P({
  children,
  style,
  variant = "base",
  color,
}: {
  children: React.ReactNode
  style?: object
  variant?: "base" | "sm" | "xs"
  color?: string
}) {
  return (
    <View style={{ marginTop: 10, ...style }}>
      <Text variant={variant} color={color} align="justify">
        {children}
      </Text>
    </View>
  )
}

function LetterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Heading level={4} weight="semibold" color="#0d3d3d">
        {title}
      </Heading>
      <View style={{ marginTop: 8 }}>{children}</View>
    </View>
  )
}

/**
 * The full letter as a Takumi-renderable React tree. pdfcn components emit
 * plain HTML elements, so this same tree is what `takumi-pdf` turns into PDF
 * bytes server-side.
 */
export function OfferLetterDocument({ data }: { data: OfferLetterData }) {
  const greeting = (data.greeting || "Estimado/a {candidate}:").replace(
    "{candidate}",
    data.candidateName
  )

  const conditions = [
    data.contractType ? { key: "Tipo de contrato", value: data.contractType } : null,
    data.workMode ? { key: "Modalidad", value: data.workMode } : null,
    data.workSchedule ? { key: "Jornada", value: data.workSchedule } : null,
    data.startDate ? { key: "Fecha de inicio", value: data.startDate } : null,
    data.compensation ? { key: "Compensación", value: data.compensation } : null,
    data.probationPeriod ? { key: "Período de prueba", value: data.probationPeriod } : null,
    data.noticePeriod ? { key: "Preaviso", value: data.noticePeriod } : null,
    data.vacationDays ? { key: "Vacaciones", value: data.vacationDays } : null,
  ].filter((entry): entry is { key: string; value: string } => Boolean(entry))

  const hasContact =
    Boolean(data.hrContactName) || Boolean(data.hrContactEmail) || Boolean(data.hrContactPhone)

  return (
    <PdfcnThemeProvider>
      <main style={{ padding: "44px 52px", color: "#1c2726" }}>
        {/* Encabezado */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}>
            {data.logoUrl ? (
              <PdfImage
                src={data.logoUrl}
                fit="contain"
                width={56}
                height={56}
                style={{ marginRight: 14 }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text
                variant="xs"
                weight="semibold"
                transform="uppercase"
                color="#0d3d3d"
                style={{ letterSpacing: 2 }}
              >
                Carta de Oferta
              </Text>
              <Heading level={1} style={{ marginTop: 6 }}>
                {data.companyName}
              </Heading>
              {data.companyAddress ? (
                <Text variant="xs" color="#5b6b69" style={{ marginTop: 4 }}>
                  {data.companyAddress}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={{ maxWidth: 170 }}>
            {data.letterRef ? (
              <Text variant="xs" color="#5b6b69" align="right">
                Ref. {data.letterRef}
              </Text>
            ) : null}
            {data.issueDate ? (
              <Text variant="xs" color="#5b6b69" align="right">
                Emitida el {data.issueDate}
              </Text>
            ) : null}
            <Text variant="xs" color="#5b6b69" align="right">
              Emitida vía Biovity
            </Text>
          </View>
        </View>

        <Divider style={{ margin: "18px 0 22px" }} />

        <View>
          <Text variant="base">{greeting}</Text>
        </View>
        {data.intro ? <P>{data.intro}</P> : null}

        {/* La posición */}
        <LetterSection title="La posición">
          <View>
            <Text variant="base">
              Te invitamos a sumarte como{" "}
              <Text variant="base" weight="semibold" color="#0d3d3d">
                {data.jobTitle}
              </Text>
              .
            </Text>
          </View>
          {data.positionSummary ? <P style={{ marginTop: 8 }}>{data.positionSummary}</P> : null}
        </LetterSection>

        {/* Condiciones */}
        {conditions.length > 0 ? (
          <LetterSection title="Condiciones de la oferta">
            <KeyValue divided boldValue items={conditions} />
            {data.compensationDetail ? (
              <P style={{ marginTop: 8 }} variant="sm">
                <Text variant="sm" color="#5b6b69">
                  {data.compensationDetail}
                </Text>
              </P>
            ) : null}
          </LetterSection>
        ) : null}

        {/* Beneficios */}
        {data.benefits && data.benefits.length > 0 ? (
          <LetterSection title="Beneficios">
            <PdfList items={data.benefits.map((text) => ({ text }))} variant="bullet" />
          </LetterSection>
        ) : null}

        {/* Bonos */}
        {data.bonusDetails ? (
          <LetterSection title="Bonos e incentivos">
            <View>
              <Text variant="base" align="justify">
                {data.bonusDetails}
              </Text>
            </View>
          </LetterSection>
        ) : null}

        {/* Vigencia */}
        {data.offerValidUntil ? (
          <LetterSection title="Vigencia de la oferta">
            <View>
              <Text variant="base" align="justify">
                Esta oferta tiene vigencia hasta el {data.offerValidUntil}. Pasada esa fecha,
                requeriremos confirmación para seguir con el proceso.
              </Text>
            </View>
          </LetterSection>
        ) : null}

        {/* Condiciones adicionales */}
        {data.conditions ? (
          <LetterSection title="Condiciones adicionales y confidencialidad">
            <View>
              <Text variant="base" align="justify">
                {data.conditions}
              </Text>
            </View>
          </LetterSection>
        ) : null}

        {/* Cierre y aceptación */}
        {data.closing ? <P style={{ marginTop: 22 }}>{data.closing}</P> : null}
        {data.acceptanceNote ? (
          <P variant="sm">
            <Text variant="sm" color="#5b6b69">
              {data.acceptanceNote}
            </Text>
          </P>
        ) : null}

        {/* Firmas: empresa y candidato */}
        <Signature
          variant="double"
          label="Aceptación"
          style={{ marginTop: 26 }}
          signers={[
            {
              name: data.signerName || data.companyName,
              title: data.signerRole || "Por la empresa",
              date: data.issueDate || undefined,
            },
            {
              name: data.candidateName,
              title: "Candidato",
              date: data.issueDate || undefined,
            },
          ]}
        />

        {/* Contacto de RR.HH. */}
        {hasContact ? (
          <View style={{ marginTop: 22 }}>
            <Divider style={{ marginBottom: 10 }} />
            <Text variant="xs" weight="semibold" color="#5b6b69">
              Contacto de Recursos Humanos
            </Text>
            {data.hrContactName ? (
              <Text variant="xs" color="#5b6b69" style={{ marginTop: 4 }}>
                {data.hrContactName}
              </Text>
            ) : null}
            {data.hrContactEmail ? (
              <Text variant="xs" color="#5b6b69">
                {data.hrContactEmail}
              </Text>
            ) : null}
            {data.hrContactPhone ? (
              <Text variant="xs" color="#5b6b69">
                {data.hrContactPhone}
              </Text>
            ) : null}
          </View>
        ) : null}

        <Divider style={{ margin: "18px 0 8px" }} />
        <View>
          <Text variant="xs" color="#5b6b69">
            Este documento fue generado y enviado a través de Biovity (biovity.cl).
          </Text>
        </View>
      </main>
    </PdfcnThemeProvider>
  )
}
