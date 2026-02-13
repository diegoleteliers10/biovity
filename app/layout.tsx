import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Biovity | Portal de Empleo en Biotecnología y Ciencias en Chile",
    template: "%s | Biovity",
  },
  description:
    "Conectamos profesionales y estudiantes con oportunidades laborales en biotecnología, bioquímica, química, ingeniería química y salud en Chile.",
  keywords: [
    "empleo biotecnología",
    "trabajo bioquímica",
    "ofertas química",
    "ingeniería química empleo",
    "empleo ciencias Chile",
    "portal empleo científico",
    "trabajo laboratorio",
    "empleo farmacéutica",
    "trabajo investigación",
    "talento científico",
  ],
  authors: [{ name: "Biovity" }],
  creator: "Biovity",
  publisher: "Biovity",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/logoIconBiovity.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: "Biovity",
    title: "Biovity | Portal de Empleo en Biotecnología y Ciencias",
    description:
      "Conectamos profesionales y estudiantes con oportunidades laborales en biotecnología, bioquímica, química, ingeniería química y salud en Chile.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Portal de Empleo en Biotecnología y Ciencias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biovity | Portal de Empleo en Biotecnología y Ciencias",
    description:
      "Conectamos profesionales y estudiantes con oportunidades laborales en biotecnología, bioquímica y ciencias en Chile.",
    images: ["/og/home.png"],
    creator: "@biovity",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  // Uncomment and add your verification codes when available
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Biovity" />
        <link rel="apple-touch-icon" href="/logoIconBiovity.png" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
