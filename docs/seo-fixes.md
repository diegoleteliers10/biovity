# SEO Fixes — biovity.cl

Diagnóstico y remediación de los errores reportados en Google Search Console.

## Cambios aplicados (código)

| Archivo | Cambio | GSC issue resuelto |
|---------|--------|--------------------|
| `vercel.json` | Redirect 301 `www.biovity.cl/*` → `https://biovity.cl/*` | "Página con redirección" en `http(s)://biovity.cl` y `www.biovity.cl` |
| `vercel.json` | Consolidación de security headers en una sola regla | Conflictos con headers duplicados |
| `public/robots.txt` (eliminado) | Borrado por conflicto con `app/robots.ts` | Comportamiento impredecible de robots.txt |
| `app/robots.ts` | Añadido `host: siteUrl` (directiva Host oficial) | Canonical host ambiguo |
| `app/robots.ts` | Añadido `/*-md` a disallow para todos los bots SEO | Duplicate content con rutas `*-md` |
| `app/robots.ts` | Bots AI (GPTBot, ClaudeBot, PerplexityBot, etc.) pueden acceder a `/*-md` | Mantiene feed para LLMs |
| `app/{planes,nosotros,empresas,salarios,trabajos,index}-md/route.ts` | Header `X-Robots-Tag: noindex, nofollow` | Duplicate content detectado por Google |
| `app/register/page.tsx` | Removido `robots: noindex, nofollow` (indexable) | "Sin indexar" en `/register` |
| `app/register/professional/layout.tsx` | Añadido `robots: { index: false, follow: false }` | Inconsistencia con bloqueado en robots.txt |
| `app/register/organization/layout.tsx` | Añadido `robots: { index: false, follow: false }` | Inconsistencia con bloqueado en robots.txt |
| `app/register/professional/page.tsx` | Removida metadata duplicada (movida al layout) | Limpieza |
| `app/register/organization/page.tsx` | Restaurado como `"use client"` (refactor previo roto) | Build fix |
| `content/blog/first-post.mdx` | Traducido de inglés a español | "Descubierto, actualmente sin indexar" por mismatch de idioma |

## Cambios manuales requeridos (fuera de código)

### 1. Configurar `api.biovity.cl` en Vercel + DNS

`api.biovity.cl` aparece como 404 porque el subdominio no está asignado al proyecto.

**Opción A — Eliminar la propiedad de GSC (recomendado si no usas ese subdominio):**
1. Google Search Console → Settings → Property → `api.biovity.cl`
2. Verify ownership first, luego "Remove property"
3. Sin propiedad, Google deja de reportar el 404

**Opción B — Redirigir `api.biovity.cl` al apex (si querés mantener la propiedad):**
1. Vercel Dashboard → Domains → Add `api.biovity.cl`
2. Configura como **Redirect** → `https://biovity.cl`
3. Configura el CNAME en tu proveedor DNS:
   - `api.biovity.cl` → `cname.vercel-dns.com`

### 2. Verificar dominio canonical en Vercel

1. Vercel Dashboard → Settings → Domains
2. Confirma que `biovity.cl` está marcado como **primary domain**
3. Si `www.biovity.cl` está asignado (no redirigido), elimínalo o márcalo como redirect
4. El redirect de `vercel.json` cubre el caso defensivo, pero el dashboard es la fuente primaria de verdad

### 3. Validar canonical en Search Console

Después de deploy:

1. **Inspección de URLs** → testea cada URL problemática con "Test live URL"
2. **Indexing → Pages** → "Validate Fix" en cada issue
3. Las URLs `*-md` deberían pasar a "Excluded by 'noindex' tag"
4. Las URLs `www.biovity.cl/*` deberían pasar a "Alternate page with proper canonical tag" → eventualmente "Indexed"

### 4. Sitemap y reindexación

El sitemap actual incluye URLs válidas. Después de deploy:

1. Search Console → Sitemaps → re-submit `sitemap.xml`
2. Revisa Coverage → "Excluded" pages para verificar que las `*-md` están correctamente excluidas

## Notas sobre `Trabajos` con filtros

`https://www.biovity.cl/trabajos?categoria=biotecnolog-a` se reporta como "página alternativa con etiqueta canónica adecuada". **Esto es comportamiento correcto, no un error.**

El canonical en `app/trabajos/page.tsx` apunta a `/trabajos` (sin query string), por lo que Google indexa `/trabajos` como la página principal y trata las URLs filtradas como variantes. Esto es la práctica recomendada para listados con filtros: evita thin/duplicate content.

**Mejora futura opcional:** Crear landing pages dedicadas por categoría (ej. `/trabajos/biotecnologia`) con contenido único en vez de query strings. Esto permitiría indexar cada categoría por separado, pero requiere refactor mayor del routing.

## Notas sobre `first-post.mdx`

Era el único post del blog y estaba completamente en inglés en un sitio 100% en español. Google lo detectaba como "thin content / language mismatch" y no lo indexaba. La traducción debería resolver el issue en el próximo crawl.

Recomendación: añadir 2-3 posts más en español con contenido original (~500+ palabras cada uno) para dar señales de freshness y topical authority.

## Verificación

Después del deploy, ejecuta:

```bash
# Robots.txt debe servir el contenido de app/robots.ts (no public/)
curl -I https://biovity.cl/robots.txt

# www → non-www redirect
curl -I https://www.biovity.cl/ | head -5

# -md routes con noindex header
curl -I https://biovity.cl/planes-md | head -5
curl -I https://biovity.cl/index-md | head -5

# /register indexable
curl -I https://biovity.cl/register | head -5

# /register/professional sigue noindex
curl -I https://biovity.cl/register/professional | head -5
```

Resultados esperados:
- `www.biovity.cl/*` → 301 → `https://biovity.cl/*`
- `planes-md` → 200 con `X-Robots-Tag: noindex, nofollow`
- `register` → 200 sin `X-Robots-Tag`
- `register/professional` → 200 con `X-Robots-Tag: noindex, nofollow`
- `robots.txt` contiene `Disallow: /*-md` y `Host: https://biovity.cl`