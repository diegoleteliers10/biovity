# Implementación SEO y AEO en development

Cambios sobre el contenido actual. Sin despliegue ni cambios en dashboards internos.

## Verificación

- TypeScript: sin errores.
- Biome: sin errores. Cuatro avisos preexistentes.
- DOM: 13 rutas con un H1 y canonical esperado.
- Recursos: seis rutas Markdown y llms.txt responden. Precios mensuales 40.000 y 80.000 CLP desde la misma fuente que la interfaz.
- Sitemap: dos categorías y dos cápsulas con fechas del frontmatter. Sin fechas de actualización inventadas en páginas estáticas.
- Sentinel: aprobación de los cambios SEO y de los ajustes finales.
- Rastreo local actualizado: 41 páginas, 8 grupos. Los canonicals apuntan a producción y generan observaciones locales esperadas.

## Hallazgos del audit original

| ID | Título exacto | Resultado | Motivo y verificación |
|---|---|---|---|
| crawl:meta_description_duplicate | meta_description_duplicate: Duplicate meta description (13 URLs) | not-needed | Las 12 variantes son filtros con canonical `/jobs`. No crear descripciones distintas solo para eliminar la alerta. |
| crawl:title_duplicate | title_duplicate: Duplicate title (13 URLs) | not-needed | Las variantes consolidan su señal hacia `/jobs`. El título duplicado en estos filtros no demuestra una página indexable duplicada. |
| crawl:duplicate_content | duplicate_content: Duplicate content (13 URLs) | not-needed | La consolidación por canonical ya existe. No crear contenido artificial por combinación de filtros. |
| crawl:h1_missing | h1_missing: Missing H1 (1 URL) | fixed | /plans usa un H1. DOM local y rastreo sin alerta. |
| crawl:noindex | noindex: Noindex found (1 URL) | no-change | No requiere cambio: `/login` no es una landing que deba competir por búsquedas. |
| crawl:canonicalized_page | canonicalized_page: Canonicalized page (14 URLs) | changed | Las dos categorías tienen canonical propio. Los filtros mantienen /jobs. DOM local verificado. |
| crawl:title_too_wide | title_too_wide: Title may truncate on some devices (4 URLs) | changed | Títulos sin marca duplicada. Se acortaron privacidad, waitlist y cápsulas. El rastreo local no conserva la alerta. |
| crawl:structured_data_missing | structured_data_missing: No structured data detected (3 URLs) | changed | CollectionPage y BreadcrumbList en ambas categorías. /register conserva su estado. Schema local válido. |
| crawl:slow_response | slow_response: Slow response in this crawl (2 URLs) | deferred | La nueva muestra local no conserva la alerta. No mide rendimiento de producción ni Core Web Vitals. |
| crawl:h1_multiple | h1_multiple: Multiple H1 headings (1 URL) | changed | La muestra tipográfica usa p. El DOM de /brand tiene un H1. Las demos usan h3. |
| crawl:nofollow | nofollow: Nofollow found (1 URL) | no-change | No requiere cambio de SEO en `/login`, fuera del contenido de adquisición. |

## Hallazgos del rastreo local

| ID | Título exacto | Resultado | Motivo |
|---|---|---|---|
| crawl:meta_description_duplicate | meta_description_duplicate: Duplicate meta description (13 URLs) | not-needed | Filtros de empleo con canonical /jobs. Se conserva la consolidación. |
| crawl:title_duplicate | title_duplicate: Duplicate title (13 URLs) | not-needed | Filtros de empleo con canonical /jobs. Se conserva la consolidación. |
| crawl:duplicate_content | duplicate_content: Duplicate content (13 URLs) | not-needed | Filtros de empleo con canonical /jobs. Se conserva la consolidación. |
| crawl:canonical_mismatch | canonical_mismatch: Canonical differs from final URL (1 URL) | no-change | Ruta /login fuera del contenido de adquisición. Se conserva noindex/nofollow. |
| crawl:noindex | noindex: Noindex found (1 URL) | no-change | Ruta /login fuera del contenido de adquisición. Se conserva noindex/nofollow. |
| crawl:canonicalized_page | canonicalized_page: Canonicalized page (40 URLs) | no-change | Localhost conserva canonicals de producción. No publicar canonicals localhost. Los filtros siguen /jobs. |
| crawl:nofollow | nofollow: Nofollow found (1 URL) | no-change | Ruta /login fuera del contenido de adquisición. Se conserva noindex/nofollow. |
| crawl:structured_data_missing | structured_data_missing: No structured data detected (1 URL) | no-change | /register no necesita schema para eliminar una alerta del crawler. |

## Inventario original completo

| URL | Estado y evidencia |
|---|---|
| https://biovity.cl/ | Conservar portal. Mejorar HTML inicial y headings de demos. Enlazar salarios y empleos. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/. |
| https://biovity.cl/about | Conservar. Reforzar identidad verificable del equipo y contacto. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/about. |
| https://biovity.cl/blog | Marca única en título. Organizar guías por intención. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog. |
| https://biovity.cl/blog/como-preparar-entrevista-tecnica-biomedicina-rd | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/como-preparar-entrevista-tecnica-biomedicina-rd. |
| https://biovity.cl/blog/cv-biotech-optimizado-ats | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/cv-biotech-optimizado-ats. |
| https://biovity.cl/blog/estrategias-negociacion-salarial-primer-empleo-ciencias | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/estrategias-negociacion-salarial-primer-empleo-ciencias. |
| https://biovity.cl/blog/first-post | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/first-post. |
| https://biovity.cl/blog/guia-transicion-phd-postdoc-industria-biomedica | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/guia-transicion-phd-postdoc-industria-biomedica. |
| https://biovity.cl/blog/habilidades-blandas-y-tecnicas-mas-demandadas-biotech | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/habilidades-blandas-y-tecnicas-mas-demandadas-biotech. |
| https://biovity.cl/blog/linkedin-y-networking-para-profesionales-de-biociencias | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/blog/linkedin-y-networking-para-profesionales-de-biociencias. |
| https://biovity.cl/brand | Corregido: un H1 y se retiró AboutPage de /about. Añadido al sitemap. Evidencia: 200. H1: 2. Canonical: https://biovity.cl/brand. |
| https://biovity.cl/career-tips | Corregido: se retiraron métricas de éxito sin respaldo. Se muestran cantidades de guías y categorías existentes. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/career-tips. |
| https://biovity.cl/companies | Conservar intención comercial ATS. Unificar ofertas y versiones Markdown. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/companies. |
| https://biovity.cl/cookies | Conservar condiciones accesibles. Revisar precisión y marca repetida. Sin prioridad de keywords comerciales. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/cookies. |
| https://biovity.cl/jobs | Revisar intención específica antes de editar. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=Bioqu%C3%ADmica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=Biotecnolog%C3%ADa | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=I+D%20Farmac%C3%A9utica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=Ingenier%C3%ADa%20Qu%C3%ADmica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=Qu%C3%ADmica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?categoria=Salud%20y%20Medicina | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?experiencia=junior | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?q=Bioinform%C3%A1tica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?q=Ing.%20Alimentos | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?q=Ing.%20Biotecnolog%C3%ADa | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?q=Ing.%20Civil%20Qu%C3%ADmica | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/jobs?q=Qu%C3%ADmica%20y%20Farmacia | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/jobs. |
| https://biovity.cl/learn | Título específico. Incluir en sitemap y enlazar categorías. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/learn. |
| https://biovity.cl/learn/bioinformatica | Corregido: canonical de categoría, schema de colección, títulos y cobertura del sitemap. Las fechas de cápsulas vienen del frontmatter. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/. |
| https://biovity.cl/learn/bioinformatica/analisis-secuencias-adn-python | Corregido: canonical de categoría, schema de colección, títulos y cobertura del sitemap. Las fechas de cápsulas vienen del frontmatter. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/learn/bioinformatica/analisis-secuencias-adn-python. |
| https://biovity.cl/learn/ia-biotech | Corregido: canonical de categoría, schema de colección, títulos y cobertura del sitemap. Las fechas de cápsulas vienen del frontmatter. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/. |
| https://biovity.cl/learn/ia-biotech/agentes-ai-biotech | Corregido: canonical de categoría, schema de colección, títulos y cobertura del sitemap. Las fechas de cápsulas vienen del frontmatter. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/learn/ia-biotech/agentes-ai-biotech. |
| https://biovity.cl/login | Conservar noindex/nofollow. Fuera de adquisición pública. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/login. |
| https://biovity.cl/plans | Corregido: H1, precios y nombres del schema desde PLANES_EMPRESAS. Se retiró FAQ no visible. Markdown con precios actuales. Evidencia: 200. H1: 0. Canonical: https://biovity.cl/plans. |
| https://biovity.cl/privacy | Corregido: título sin marca duplicada y con longitud reducida donde correspondía. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/privacy. |
| https://biovity.cl/recruiting | Corregido: título sin marca duplicada y con longitud reducida donde correspondía. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/recruiting. |
| https://biovity.cl/register | No añadir schema genérico. Revisar intención de indexación del registro por separado. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/register. |
| https://biovity.cl/salaries | Corregido: intención de biotecnología en título/H1, aviso orientativo y Markdown coherente. Se retiró Dataset sin evidencia y FAQ no visible. Fuentes salariales verificables pendientes. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/salaries. |
| https://biovity.cl/share-salary | Decidir indexación según utilidad pública y privacidad. No canonicalizar a salaries sin analizar contenido. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/share-salary. |
| https://biovity.cl/terms | Conservar condiciones accesibles. Revisar precisión y marca repetida. Sin prioridad de keywords comerciales. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/terms. |
| https://biovity.cl/waitlist | Corregido: título sin marca duplicada y con longitud reducida donde correspondía. Evidencia: 200. H1: 1. Canonical: https://biovity.cl/waitlist. |
| https://biovity.cl/dashboard/offers | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/dashboard/talent | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/login/organization | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/login/professional | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/register/organization | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/register/organization?plan=business | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/register/organization?plan=pro | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |
| https://biovity.cl/register/professional | Conservar fuera del alcance público. No abrir robots solo para completar el audit. Evidencia: Omitida por robots. Sin inspección de contenido. |

## Inventario local completo

| URL | Resultado | Evidencia |
|---|---|---|
| http://localhost:3000/ | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/about | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/como-preparar-entrevista-tecnica-biomedicina-rd | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/cv-biotech-optimizado-ats | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/estrategias-negociacion-salarial-primer-empleo-ciencias | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/first-post | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/guia-transicion-phd-postdoc-industria-biomedica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/habilidades-blandas-y-tecnicas-mas-demandadas-biotech | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/blog/linkedin-y-networking-para-profesionales-de-biociencias | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/brand | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/career-tips | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/companies | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/cookies | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/dashboard/offers | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/dashboard/talent | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/jobs | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=Bioqu%C3%ADmica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=Biotecnolog%C3%ADa | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=I+D%20Farmac%C3%A9utica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=Ingenier%C3%ADa%20Qu%C3%ADmica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=Qu%C3%ADmica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?categoria=Salud%20y%20Medicina | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?experiencia=junior | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?q=Bioinform%C3%A1tica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?q=Ing.%20Alimentos | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?q=Ing.%20Biotecnolog%C3%ADa | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?q=Ing.%20Civil%20Qu%C3%ADmica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/jobs?q=Qu%C3%ADmica%20y%20Farmacia | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/learn | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/learn/bioinformatica | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/learn/bioinformatica/analisis-secuencias-adn-python | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/learn/ia-biotech | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/learn/ia-biotech/agentes-ai-biotech | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/login | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/login/organization | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/login/professional | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/plans | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/privacy | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/recruiting | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/register | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/register/organization | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/register/organization?plan=business | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/register/organization?plan=pro | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/register/professional | no-change | Omitida por robots. Fuera del alcance. |
| http://localhost:3000/salaries | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/share-salary | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/terms | verified | HTTP 200. Canonical de producción intencional en localhost. |
| http://localhost:3000/waitlist | verified | HTTP 200. Canonical de producción intencional en localhost. |

## Pendientes

- Reducir la cadena www y /salarios en la configuración de hosting. La ruta histórica conserva su destino /salaries.
- Medir Core Web Vitals en producción. El servidor local de desarrollo no representa esa métrica.
- Publicar fuentes, muestra y método de salarios antes de restaurar Dataset o afirmar un estudio verificado.
- Verificar nombres, credenciales y fechas editoriales de autores. Se retiraron enlaces de autor inexistentes del schema.
- Medir indexación y consultas en Search Console después del despliegue. Este cambio local no confirma mejoras de posición.
