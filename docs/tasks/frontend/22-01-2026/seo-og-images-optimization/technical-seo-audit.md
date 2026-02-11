# Technical SEO Audit

## Meta Tags Implementation

### Global Layout (`app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://biovity.cl"),
  title: {
    default: "Biovity | Portal de Empleo en Biotecnologia y Ciencias en Chile",
    template: "%s | Biovity",
  },
  description: "Conectamos profesionales y estudiantes con oportunidades laborales...",
  keywords: ["empleo biotecnologia", "trabajo bioquimica", ...],
  authors: [{ name: "Biovity" }],
  creator: "Biovity",
  publisher: "Biovity",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/logoIconBiovity.png" },
  // ... full configuration
}
```

### Homepage (`app/page.tsx`)
- **Title:** "Biovity | Encuentra Trabajo en Biotecnologia, Bioquimica y Ciencias en Chile"
- **Description:** Optimized for job search keywords
- **OG Image:** `/og/home.png` (dynamic generation)
- **Canonical:** `/`

### Empresas Page (`app/empresas/page.tsx`)
- **Title:** "Para Empresas | Recluta Talento Cientifico con Biovity"
- **Description:** Focused on B2B recruitment keywords
- **OG Image:** `/og/empresas.png` (dynamic generation)
- **Canonical:** `/empresas`

## Structured Data (JSON-LD)

### Schemas Implemented

| Schema Type | Page | Description |
|-------------|------|-------------|
| Organization | All | Company information, logo, contact |
| WebSite | Home | Site name, search action |
| EmploymentAgency | Home | Job board metadata |
| SoftwareApplication | Empresas | ATS product information |
| FAQPage | Empresas | 8 FAQ items for rich snippets |
| BreadcrumbList | Empresas | Navigation hierarchy |

### Example: Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Biovity",
  "url": "https://biovity.cl",
  "logo": "https://biovity.cl/logoIconBiovity.png",
  "description": "Portal de empleo especializado...",
  "areaServed": { "@type": "Country", "name": "Chile" }
}
```

## Dynamic OG Image Generation

Using Next.js `ImageResponse` API (edge runtime):

- **Route Pattern:** `/og/[image-name].png/route.tsx`
- **Dimensions:** 1200x630 (optimal for social sharing)
- **Styling:** Gradient backgrounds, branded colors, typography

### Home OG Image Features:
- Biovity logo with gradient
- Tagline: "Donde el talento y la ciencia se encuentran"
- Subtitle with specializations
- Site URL footer

### Empresas OG Image Features:
- "Para Empresas" badge
- Value proposition
- Stats display (+500 professionals, +50 specialties)
- B2B-focused messaging

## robots.ts Configuration

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login/", "/register/"],
      },
    ],
    sitemap: "https://biovity.cl/sitemap.xml",
  }
}
```

## sitemap.ts Configuration

Includes:
- Homepage (priority: 1.0)
- /empresas (priority: 0.9)
- Login pages (priority: 0.5)
- Registration pages (priority: 0.6)

## PWA Manifest

```json
{
  "name": "Biovity - Portal de Empleo en Biotecnologia y Ciencias",
  "short_name": "Biovity",
  "theme_color": "#2563EB",
  "background_color": "#ffffff",
  "display": "standalone",
  "lang": "es-CL"
}
```

## Verification Tags

Placeholder added for:
- Google Search Console
- Yandex Webmaster

**Action Required:** Add verification codes when registering with search engines.
