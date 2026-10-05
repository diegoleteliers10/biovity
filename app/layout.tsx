import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif, Rubik } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "sonner"
import { MotionProvider } from "@/components/providers/MotionProvider"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { themeScript } from "@/lib/theme"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
})

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Biovity | Portal de Empleo en Biotecnología, Bioquímica y Ciencias en Chile",
    template: "%s | Biovity",
  },
  description:
    "Portal de empleo en biotecnología, bioquímica, química, ingeniería química y salud en Chile. Encuentra trabajos en ciencias, laboratorios, I+D, farmacéutica y más.",
  keywords: [
    "empleos biotecnología chile",
    "empleos biociencias chile",
    "empleos bioquímica chile",
    "empleos química chile",
    "empleos ingeniería química chile",
    "empleos salud chile",
    "empleos laboratorio chile",
    "empleos farmacéutico chile",
    "empleos I+D chile",
    "empleos investigación chile",
    "empleos biotech chile",
    "empleos ciencias biológicas chile",
    "portal empleo biociencias",
    "portal empleo biotecnología",
    "portal empleo científico",
    "portal empleo ciencias chile",
    "trabajo ciencias chile",
    "trabajo biotecnología chile",
    "trabajo bioquímica chile",
    "bolsa trabajo biotecnología",
    "bolsa trabajo bioquímica",
    "bolsa trabajo ciencias",
    "bolsa trabajo laboratorio",
    "empleo científico chile",
    "empleo laboratorio chile",
    "empleo farmacéutico chile",
    "empleo investigación chile",
    "empleo biotech chile",
    "empleos food science chile",
    "empleos microbiología chile",
    "empleos bioquímica industrial chile",
  ],
  authors: [{ name: "Biovity" }],
  creator: "Biovity",
  publisher: "Biovity",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/favicon/favicon-16x16.webp", sizes: "16x16", type: "image/webp" },
      { url: "/images/favicon/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/images/favicon/favicon-48x48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/images/favicon/favicon-192x192.webp", sizes: "192x192", type: "image/webp" },
    ],
    shortcut: "/images/favicon/favicon-32x32.webp",
    apple: [
      { url: "/images/ios/180.webp", sizes: "180x180", type: "image/webp" },
      { url: "/images/ios/152.webp", sizes: "152x152", type: "image/webp" },
      { url: "/images/ios/144.webp", sizes: "144x144", type: "image/webp" },
      { url: "/images/ios/120.webp", sizes: "120x120", type: "image/webp" },
      { url: "/images/ios/114.webp", sizes: "114x114", type: "image/webp" },
      { url: "/images/ios/76.webp", sizes: "76x76", type: "image/webp" },
      { url: "/images/ios/72.webp", sizes: "72x72", type: "image/webp" },
      { url: "/images/ios/60.webp", sizes: "60x60", type: "image/webp" },
      { url: "/images/ios/57.webp", sizes: "57x57", type: "image/webp" },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "geo.region": "CL",
    "geo.placename": "Chile",
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
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Biovity - Portal de Empleo en Biotecnología y Ciencias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biovity | Portal de Empleo en Biotecnología y Ciencias",
    description:
      "Conectamos profesionales y estudiantes con oportunidades laborales en biotecnología, bioquímica y ciencias en Chile.",
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "Biovity - Portal de Empleo en Biotecnología y Ciencias",
      },
      {
        url: `${siteUrl}/api/og`,
        width: 400, // WhatsApp max 600KB
        height: 400,
        alt: "Biovity - Portal de Empleo en Biotecnología y Ciencias",
      },
    ],
    creator: "@biovity",
    site: "@biovity",
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
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Was #2563EB, a Tailwind blue this brand does not use. The theme script
            below rewrites this to the dark chrome once it knows the theme, so it
            has to be declared first. */}
        <meta name="theme-color" content="#00374a" />
        {/*
          Blocking, so the class is on <html> before the first paint. Without it
          the dashboard renders light and then flips, which reads as a flash on
          every navigation. Kept inline and dependency-free on purpose.
        */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: themeScript is a
            module-level constant with no interpolation, and the script has to be
            inline and blocking to run before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Biovity" />
        <link rel="apple-touch-icon" href="/images/ios/180.webp" sizes="180x180" />
      </head>
      <body className={`${rubik.variable} ${instrumentSerif.variable} antialiased`}>
        <NuqsAdapter>
          <QueryProvider>
            <MotionProvider>{children}</MotionProvider>
          </QueryProvider>
        </NuqsAdapter>
        {/*
          richColors paints the sonner default palette, which is the blue this
          product is not. Keep it for the semantic structure it provides and
          override every colour with a token, so all 69 call sites pick up the
          brand palette without changing one of them.
        */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "group rounded-[var(--radius)] border border-border bg-card text-card-foreground shadow-lg",
              title: "text-foreground",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground rounded-md",
              cancelButton: "bg-muted text-muted-foreground rounded-md",
              closeButton: "bg-card border-border text-muted-foreground hover:text-foreground",
              success: "bg-card text-card-foreground",
              error: "bg-card text-card-foreground",
              warning: "bg-card text-card-foreground",
              info: "bg-card text-card-foreground",
              loading: "bg-card text-card-foreground",
            },
          }}
        />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  )
}
