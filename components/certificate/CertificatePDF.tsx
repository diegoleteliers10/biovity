"use client"

import { Document, Page, PDFDownloadLink, StyleSheet, Text, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
  },
  border: {
    border: "2 solid #059669",
    borderRadius: 8,
    padding: 40,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#059669",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 32,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
    marginBottom: 8,
  },
  capsule: {
    fontSize: 16,
    textAlign: "center",
    color: "#374151",
    marginBottom: 32,
  },
  detail: {
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#9ca3af",
  },
})

type Props = {
  userName: string
  capsuleTitle: string
  issuedAt: string
  certificateId: string
}

function CertificateDocument({ userName, capsuleTitle, issuedAt, certificateId }: Props) {
  const date = new Date(issuedAt).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.title}>Certificado de Aprendizaje</Text>
          <Text style={styles.subtitle}>Biovity</Text>

          <Text style={{ fontSize: 14, textAlign: "center", color: "#374151", marginBottom: 16 }}>
            Otorga a
          </Text>

          <Text style={styles.name}>{userName}</Text>

          <Text style={{ fontSize: 14, textAlign: "center", color: "#374151", marginBottom: 16 }}>
            por completar exitosamente la cápsula
          </Text>

          <Text style={styles.capsule}>{capsuleTitle}</Text>

          <Text style={styles.detail}>Fecha de emisión: {date}</Text>
          <Text style={styles.detail}>ID de verificación: {certificateId}</Text>
        </View>

        <View style={styles.footer}>
          <Text>biovity.cl</Text>
          <Text>Certificado verificable</Text>
        </View>
      </Page>
    </Document>
  )
}

type DownloadLinkProps = Props

export function CertificateDownload({
  userName,
  capsuleTitle,
  issuedAt,
  certificateId,
}: DownloadLinkProps) {
  const fileName = `certificado-${capsuleTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`

  return (
    <PDFDownloadLink
      document={
        <CertificateDocument
          userName={userName}
          capsuleTitle={capsuleTitle}
          issuedAt={issuedAt}
          certificateId={certificateId}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
          {loading ? "Generando PDF..." : "Descargar certificado PDF"}
        </span>
      )}
    </PDFDownloadLink>
  )
}
