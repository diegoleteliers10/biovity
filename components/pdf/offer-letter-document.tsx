import { Divider } from "@/components/pdf/divider/divider"
import { Heading } from "@/components/pdf/heading/heading"
import { KeyValue } from "@/components/pdf/key-value/key-value"
import { PdfList } from "@/components/pdf/list/list"
import { PdfSignatureBlock as Signature } from "@/components/pdf/signature/signature"
import { Text } from "@/components/pdf/text/text"
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider"
import type { OfferLetterData } from "@/lib/api/offer-letters"
import { View } from "@/lib/pdf-primitives"

export const defaultOfferLetterData = (data: Partial<OfferLetterData> = {}): OfferLetterData => ({
  companyName: data.companyName ?? "",
  candidateName: data.candidateName ?? "",
  jobTitle: data.jobTitle ?? "",
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
  conditions: data.conditions ?? "",
  closing:
    data.closing ??
    "Para hacer efectiva esta oferta, responde este mensaje aceptando o rechazando desde tu dashboard de Biovity. Quedamos atentos a tu confirmación.",
  signerName: data.signerName ?? "",
  signerRole: data.signerRole ?? "",
  companyAddress: data.companyAddress ?? "",
})

/** Paragraph: pdfcn Text renders inline (<span>), so block it with a View. */
function P({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={{ marginTop: 10, ...style }}>
      <Text variant="base" align="justify">
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
  const hasKeyValue =
    Boolean(data.startDate) || Boolean(data.workMode) || Boolean(data.compensation)

  return (
    <PdfcnThemeProvider>
      <main style={{ padding: "48px 56px", color: "#1c2726" }}>
        {/* Encabezado */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          <View style={{ maxWidth: 160 }}>
            <Text variant="xs" color="#5b6b69" align="right">
              Emitida vía Biovity
            </Text>
          </View>
        </View>

        <Divider style={{ margin: "20px 0 24px" }} />

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
        {hasKeyValue ? (
          <LetterSection title="Condiciones de la oferta">
            <KeyValue
              divided
              boldValue
              items={[
                data.compensation ? { key: "Compensación", value: data.compensation } : null,
                data.startDate ? { key: "Fecha de inicio", value: data.startDate } : null,
                data.workMode ? { key: "Modalidad", value: data.workMode } : null,
              ].filter((entry): entry is { key: string; value: string } => Boolean(entry))}
            />
            {data.compensationDetail ? (
              <P style={{ marginTop: 8 }}>
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

        {/* Condiciones adicionales */}
        {data.conditions ? (
          <LetterSection title="Condiciones adicionales">
            <View>
              <Text variant="base" align="justify">
                {data.conditions}
              </Text>
            </View>
          </LetterSection>
        ) : null}

        {/* Cierre */}
        <P style={{ marginTop: 22 }}>{data.closing}</P>

        <Signature
          label="Firma responsable de contratación"
          name={data.signerName || data.companyName}
          title={data.signerRole}
          style={{ marginTop: 26 }}
        />

        <Divider style={{ margin: "22px 0 10px" }} />
        <View>
          <Text variant="xs" color="#5b6b69">
            Este documento fue generado y enviado a través de Biovity (biovity.cl).
          </Text>
        </View>
      </main>
    </PdfcnThemeProvider>
  )
}
