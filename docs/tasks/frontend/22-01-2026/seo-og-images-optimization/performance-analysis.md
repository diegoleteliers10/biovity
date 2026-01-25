# Performance Analysis

## Core Web Vitals Considerations

### LCP (Largest Contentful Paint)
**Target:** < 2.5s

**Current Optimizations:**
- Font preconnects for Google Fonts and Fontshare
- Edge runtime for OG image generation
- Next.js 16 with Turbopack for fast builds

**Recommendations:**
- Consider self-hosting fonts for faster loading
- Use `next/image` for any raster images
- Implement image lazy loading for below-fold content

### FID (First Input Delay) / INP (Interaction to Next Paint)
**Target:** < 100ms

**Current Optimizations:**
- Client components marked with `"use client"`
- GSAP animations run after initial paint
- No blocking scripts in head

**Recommendations:**
- Defer non-critical JavaScript
- Use React Suspense for heavy components
- Consider code splitting for dashboard routes

### CLS (Cumulative Layout Shift)
**Target:** < 0.1

**Current Optimizations:**
- Fixed heights on Hero sections
- Font display swap for web fonts
- Consistent layout structure

**Recommendations:**
- Add explicit dimensions to images
- Reserve space for dynamic content
- Avoid inserting content above existing content

## Font Loading Strategy

### Current Implementation
```html
<link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

**Fonts Used:**
- Satoshi (Fontshare) - Body text
- Instrument Serif (Google) - Headings
- Geist Mono (next/font) - Monospace

### Optimization Opportunities

1. **Self-host fonts:** Download and serve from `/public/fonts/`
2. **Use font-display: swap:** Already handled by providers
3. **Subset fonts:** Only include Latin characters

## Image Optimization

### OG Images
- **Size:** 1200x630 pixels (optimal)
- **Format:** PNG (generated dynamically)
- **Caching:** Can be cached at edge

### Static Images
- `/logoIcon.png` - 104KB
- `/logoIconBiovity.png` - 154KB

**Recommendation:** Convert to WebP and create multiple sizes:
```
/logoIcon.webp - 32KB (estimated 70% reduction)
/logoIconBiovity.webp - 50KB (estimated 70% reduction)
```

## JavaScript Bundle

### Current Setup
- Next.js 16 with Turbopack
- GSAP for animations
- Radix UI for accessible components
- Recharts for charts (dashboard)

### Code Splitting
```
app/
  page.tsx          -> Home bundle
  empresas/page.tsx -> Empresas bundle
  dashboard/        -> Dashboard bundle (separate)
  login/            -> Auth bundle
  register/         -> Auth bundle
```

**Recommendation:** Lazy load GSAP only for pages that use it.

## Server Response

### Edge Runtime
Used for:
- OG image generation (`/og/home.png`, `/og/empresas.png`)

### Node Runtime
Used for:
- All other routes (default)

## Caching Strategy

### Static Assets
```
public/
  manifest.json     -> Immutable, long cache
  favicon.ico       -> Immutable, long cache
  *.png             -> Immutable, long cache
```

### Dynamic Routes
```
/og/*.png           -> Cache for 1 hour, revalidate
/sitemap.xml        -> Cache for 1 day
/robots.txt         -> Cache for 1 week
```

### Recommended Headers (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/og/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }
        ]
      }
    ]
  }
}
```

## Performance Monitoring

### Recommended Tools
1. **Lighthouse:** Built into Chrome DevTools
2. **PageSpeed Insights:** https://pagespeed.web.dev/
3. **WebPageTest:** https://www.webpagetest.org/
4. **Vercel Analytics:** If deploying to Vercel

### Key Metrics to Track
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
