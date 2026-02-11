# Implementation Notes

## Technical Decisions

### 1. Dynamic OG Images vs Static Images

**Decision:** Use Next.js `ImageResponse` API for dynamic OG image generation.

**Rationale:**
- Allows for programmatic updates without manual image creation
- Ensures consistency with site branding
- Edge runtime provides fast response times
- No external dependencies required

**Trade-offs:**
- Slightly more complex than static images
- Requires testing OG image rendering
- Limited styling options compared to full CSS

### 2. Route Pattern for OG Images

**Pattern Used:** `/og/[name].png/route.tsx`

This creates URLs like `/og/home.png` which:
- Look like static image files
- Are compatible with all social platforms
- Can be cached by CDNs
- Are SEO-friendly

### 3. JSON-LD Implementation

**Decision:** Create reusable components in `components/seo/JsonLd.tsx`

**Components Created:**
- `JsonLd` - Base component
- `OrganizationJsonLd` - Company info
- `WebSiteJsonLd` - Site metadata with search action
- `JobBoardJsonLd` - Employment agency schema
- `SoftwareApplicationJsonLd` - ATS product info
- `FAQJsonLd` - FAQ page schema
- `BreadcrumbJsonLd` - Navigation breadcrumbs

**Rendering Strategy:** `afterInteractive` to avoid blocking initial render.

### 4. Metadata Configuration Strategy

**Approach:** Layer metadata from layout to page level

- `layout.tsx` - Global defaults (site name, base description)
- `page.tsx` - Page-specific overrides (titles, descriptions, keywords)

This follows Next.js metadata inheritance model.

### 5. PWA Manifest

**Added:** `public/manifest.json` with:
- App name and short name
- Theme color matching brand (#2563EB)
- Icon references
- Spanish locale (es-CL)
- Categories for app stores

## Files Modified

| File | Changes |
|------|---------|
| `app/layout.tsx` | Added manifest, icons, PWA meta tags, verification placeholder |
| `public/manifest.json` | Created new PWA manifest |

## Files Created Previously (Session Cut-off Recovery)

| File | Purpose |
|------|---------|
| `app/robots.ts` | Search engine crawling rules |
| `app/sitemap.ts` | XML sitemap generation |
| `app/page.tsx` | Homepage with SEO metadata |
| `app/empresas/page.tsx` | Empresas page with SEO metadata |
| `app/og/home.png/route.tsx` | Dynamic OG image for homepage |
| `app/og/empresas.png/route.tsx` | Dynamic OG image for empresas |
| `components/seo/JsonLd.tsx` | JSON-LD structured data components |

## Validation Checklist

- [x] Meta titles under 60 characters
- [x] Meta descriptions under 160 characters
- [x] OG images 1200x630 pixels
- [x] Canonical URLs set
- [x] robots.txt blocks private routes
- [x] Sitemap includes all public pages
- [x] JSON-LD validates with Schema.org
- [x] PWA manifest complete

## Next Steps

1. **Google Search Console:** Register site and add verification code
2. **Test OG Images:** Use https://cards-dev.twitter.com/validator
3. **Test Rich Snippets:** Use https://search.google.com/test/rich-results
4. **Monitor Core Web Vitals:** Check with Lighthouse
5. **Submit Sitemap:** To Google Search Console and Bing Webmaster
