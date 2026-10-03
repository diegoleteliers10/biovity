# Auditoría SEO y AEO de Biovity

Fecha: 3 de octubre de 2026. Alcance: landing pública, recursos de aprendizaje y artículos. Auditoría, sin cambios de código ni despliegue.

## Resultado y límites

La base técnica permite rastrear las páginas evaluadas. Hay problemas concretos en canonicals de aprendizaje, coherencia de datos y contenido disponible para buscadores. Priorizar estas correcciones antes de ampliar keywords.

El rastreo procesó 49 solicitudes: 41 documentos con respuesta 200 y 8 rutas omitidas por robots. No alcanzó el límite de 100 páginas. El informe automático agrupó 66 observaciones en 11 hallazgos. Es una revisión acotada de las rutas descubiertas, no una garantía de cobertura de todas las URL posibles. El sitemap publicado tiene 20 entradas.

Search Console: propiedad verificada `sc-domain:biovity.cl`. Periodo: 2 de julio a 29 de septiembre de 2026. La serie diaria registra 91 clics y 4.021 impresiones. Las tablas agrupadas pueden omitir consultas privadas o de bajo volumen. La comparación de segmentos es parcial. Los valores ausentes no equivalen a cero. Las posiciones son medias, no posiciones fijas para cada usuario.

Analytics, conversiones, backlinks, volúmenes de mercado, Core Web Vitals de campo y pruebas de citas en ChatGPT o Claude no se midieron. Tampoco se ejecutó URL Inspection por página. Una respuesta 200 y un canonical correcto no prueban indexación. No atribuir cambios a una actualización de Google por coincidencia de fechas.

El primer resumen del CLI truncó las listas de páginas. Se recuperó el informe completo del almacenamiento local: 41 páginas, 66 observaciones y 49 solicitudes. `crawl-full.json` conserva ese contenido. No hay paginación pendiente en el inventario de rastreo.

Obscura mostró una pantalla de error al ejecutar JavaScript en la home. El navegador normal mostró la landing y sus datos estructurados. Esa diferencia aislada no prueba que el sitio falle para Googlebot.

## Prioridades con evidencia

| Prioridad | Problema y evidencia | Acción propuesta | Verificación |
|---|---|---|---|
| P1 | `/learn/bioinformatica` y `/learn/ia-biotech` declaran canonical hacia `/`. Confirmado en rastreo y navegador. `app/learn/[category]/page.tsx` no define `alternates.canonical`. | Definir canonical propio por categoría y OG URL propio. | HTML y navegador deben mostrar la misma URL de categoría. Después, URL Inspection. |
| P1 | El sitemap omite `/learn`, categorías y cápsulas, además de `/brand` y `/share-salary`. `app/sitemap.ts` solo agrega páginas estáticas, posts y empleos. | Incluir recursos públicos que se quiera indexar. Decidir por separado marca y formularios. | Comparar rutas publicadas con sitemap. Confirmar status 200 y canonical propio. |
| P1 | `SoftwareApplicationJsonLd` declara tres planes antiguos. La UI muestra Free, Pro, Business y Enterprise, con Pro 40.000 CLP y Business 80.000 CLP mensuales. | Generar schema desde los mismos datos que Pricing. Indicar periodo y tratamiento de IVA. No inventar precio para Enterprise. | Comparar cada oferta con el texto visible. Validar JSON-LD y Rich Results Test. |
| P1 | `/plans` y `/salaries` incluyen FAQPage pero sus páginas no muestran esas preguntas. Los componentes de FAQ no aparecen en esos árboles. | Mostrar las preguntas reales o quitar ese schema. | Cada pregunta y respuesta marcada debe existir en el contenido visible. |
| P1 | `app/planes-md/route.ts` publica Profesional 149.000 CLP y Enterprise 449.000 CLP. Difiere de la UI y contiene texto mezclado con caracteres chinos. `llms.txt` enlaza estos recursos. | Usar la misma fuente de datos para HTML, Markdown y schema. Revisar los seis recursos Markdown. | Comparar precios, límites, fechas y URLs en cada representación. |
| P1 | La fuente de consejos declara 92 % de éxito, 10k+ personas capacitadas y 200 selecciones exitosas sin documentación de respaldo observada. La metodología salarial enumera fuentes sin enlaces a estudios concretos ni tamaño de muestra. | Publicar respaldo, fecha, muestra y método. Si no existe evidencia, retirar la cifra o describir su alcance real. | Revisar fuentes y aprobación editorial. No sustituir cifras por otras inventadas. |
| P2 | La home usa `ssr: false` en tres demos. El navegador monta H1 de demo como “Métricas” y “Bienvenido”, además del H1 principal. El crawl sin JS no los detecta. | Mantener contenido SEO importante en HTML inicial. Usar headings subordinados en demos. | Comparar HTML inicial y DOM final. Confirmar una jerarquía principal clara. |
| P2 | Varios títulos repiten `Biovity` por combinar el título de página con el template del layout. `/learn` tiene un título poco específico. | Usar título de página sin marca duplicada. Poner la intención principal primero. | Revisar título final del navegador, no solo el objeto Metadata. |
| P2 | La ruta histórica `https://www.biovity.cl/salarios` pasa por 307, 308 y 308 antes del 200 en `/salaries`. Search Console todavía atribuye 47 clics y 3.304 impresiones a `/salarios` en el periodo. | Conservar la migración y reducir saltos. Revisar redirección permanente de www y normalización de barra final. | Repetir redirect-trace. Destino 200, canonical `/salaries`, sin cadenas evitables. |
| P2 | Los artículos crean URLs de autor desde el nombre en `JsonLd.tsx`, pero no se encontró una ruta `/blog/author/[slug]`. “Equipo Biovity” se marca como Person. | Crear perfiles reales y revisados o usar la entidad correcta y una URL existente. | Cada autor debe tener identidad comprobable y URL válida. |
| P2 | El sitemap asigna `new Date()` a todas las páginas estáticas. Eso declara cambios que no están comprobados. | Usar fechas reales de actualización o quitar lastModified cuando no se conoce. | Publicar sin editar contenido no debe cambiar esas fechas. |
| P3 | `/plans` no tiene H1. `/brand` contiene un H1 adicional como muestra tipográfica. | Dar H1 propio a planes. Marcar la muestra de marca sin añadir otro heading principal. | Comprobar el DOM renderizado. |
| P3 | `llms.txt` describe datos salariales 2024-2025 y omite blog, consejos y aprendizaje. | Actualizar descripciones y recursos desde contenido vigente. Mantenerlo como archivo opcional. | Enlaces 200 y correspondencia con las páginas. |

## Keywords con señales reales

Estas son consultas observadas por Search Console. No son estimaciones de volumen de mercado. La tabla corresponde a consultas retenidas en ambas ventanas de comparación, ordenadas por impresiones recientes. Otras consultas pueden existir fuera de esta selección.

| Consulta | Impresiones | Clics | Posición media |
| cuanto gana un biotecnologo en chile | 87 | 1 | 7.41 |
| biovity | 75 | 16 | 4.87 |
| biotecnología carrera sueldo | 61 | 2 | 5.92 |
| biotecnología sueldo chile | 59 | 0 | 7.03 |
| biotecnología sueldo | 50 | 0 | 5.32 |
| ingeniería en biotecnología sueldo | 44 | 0 | 7.98 |
| cuanto gana un ingeniero en biotecnologia | 37 | 0 | 6.95 |
| ingeniería en biotecnología sueldo chile | 27 | 0 | 9.04 |
| técnico en biotecnología sueldo | 26 | 1 | 4.00 |
| ingeniero en biotecnología sueldo chile | 19 | 1 | 7.42 |
| bioinformática sueldo | 17 | 1 | 6.41 |
| biotecnología | 17 | 0 | 2.65 |

La mayor señal temática observada es salarios. La fila de página `/salaries` aporta 7 clics y 441 impresiones, además de la atribución histórica a `/salarios`. No sumar filas agrupadas como sustituto del total de propiedad. La home sin www tiene 32 clics y 217 impresiones. Un descenso en www puede reflejar consolidación de URL, no pérdida total del negocio.

## Mapa propuesto de keywords e intención

Las propuestas fuera de salarios y marca son hipótesis basadas en el producto. Validar demanda y conversiones antes de crear nuevas páginas. No ampliar meta keywords: Google no las usa para indexación ni ranking.

| Página | Intención principal | Keyword principal propuesta | Apoyo y contenido |
|---|---|---|---|
| `/` | Descubrir Biovity y el portal | empleo científico en Chile | Empleos en biotecnología, bioquímica y laboratorios. Explicar especialización y enlazar empleos y salarios. |
| `/jobs` | Encontrar ofertas activas | empleos en biotecnología Chile | Ofertas en bioquímica, laboratorio e I+D. HTML inicial con ofertas reales y ubicación. |
| `/companies` | Evaluar el producto B2B | ATS para reclutamiento científico | Contratar científicos y talento biotech. Mostrar funciones comprobadas. |
| `/recruiting` | Entender y mejorar un proceso | herramientas de reclutamiento científico | Diferenciar guía de proceso de la página comercial de ATS. |
| `/plans` | Evaluar precio y límites | precios ATS Biovity | Planes para empresas, publicación de ofertas y contratación. |
| `/salaries` | Consultar remuneración | sueldo biotecnología Chile | Cuánto gana un biotecnólogo, bioinformática sueldo y bioquímica sueldo. Separar cargo, experiencia, región y CLP. |
| `/career-tips` | Resolver pasos de carrera | consejos de carrera científica | CV científico ATS, entrevista I+D y transición academia industria. |
| `/blog` | Encontrar guías | guías de carrera en biotecnología | Organizar por CV, entrevistas, sueldos y transición. |
| `/learn` | Encontrar aprendizaje | cursos de bioinformática e IA para biotech | Usar “cápsulas” en la explicación. No afirmar acreditación que no existe. |
| `/learn/bioinformatica` | Aprender una disciplina | aprender bioinformática | Secuencias ADN, Python y análisis biológico. |
| `/learn/ia-biotech` | Aplicar IA | inteligencia artificial en biotecnología | Agentes IA y casos reales documentados. |
| `/about` | Comprobar identidad y confianza | qué es Biovity | Equipo real, experiencia, contacto y alcance del servicio. |
| `/brand` | Obtener recursos de marca | marca Biovity | Recursos oficiales. Sin competir por consultas de empleo. |
| `/share-salary` | Contribuir datos | compartir sueldo anónimo Biovity | Privacidad y método. Decidir indexación según valor público. |
| `/waitlist` | Registrarse para una novedad | lista de espera Biovity | Aclarar qué producto se espera. Revisar vigencia. |
| `/terms`, `/privacy`, `/cookies` | Consultar condiciones | condiciones y privacidad Biovity | Priorizar precisión legal y facilidad de acceso. |

No cambiar URLs inglesas solo para añadir keywords españolas. Ya hay migración y tráfico histórico. Para categorías de empleo, crear páginas permanentes solo cuando haya ofertas, contenido útil y demanda. Los filtros de búsqueda actuales pueden conservar canonical hacia `/jobs`.

Títulos propuestos: “Sueldos en biotecnología y bioinformática en Chile”, “Precios y planes de Biovity ATS”, “Aprende bioinformática e IA aplicada a biotecnología”. El layout añade la marca una sola vez. No tratar 60 caracteres como un límite absoluto. Comprobar legibilidad y texto importante al principio.

## AEO y búsqueda con IA

1. Publicar respuestas breves a preguntas reales, seguidas de evidencia y detalle. Empezar por las consultas salariales observadas. No afirmar cifras sin fuente.
2. Mostrar tablas HTML legibles con cargo, experiencia, fecha, muestra, unidad salarial y enlaces de fuente. Explicar líquido o bruto y mensual o anual.
3. Dar identidad a autores y revisores. Indicar fecha real y método en informes de salarios.
4. Unificar HTML, schema, Markdown y `llms.txt`. La contradicción actual de precios puede causar respuestas incorrectas.
5. Mantener acceso a buscadores en robots y en CDN/WAF. OAI-SearchBot sirve a búsqueda. GPTBot corresponde a entrenamiento. Claude distingue Claude-SearchBot, Claude-User y ClaudeBot. Decidir entrenamiento por separado del acceso de búsqueda.
6. Mantener enlaces internos entre ofertas, salarios, guías y aprendizaje cuando respondan una necesidad del lector. Evitar repetir listas de keywords.
7. Medir citas con un conjunto fijo de preguntas, ubicación, fecha y modelo. Registrar URLs citadas y respuestas. Medir referidos y conversiones por separado. No se hizo esa prueba en esta auditoría.

Los bots evaluados tienen permiso en robots para el inicio del sitio. Eso no confirma que el CDN permita sus IP ni que hayan rastreado todas las páginas. No se requiere un schema especial para Google AI Overviews o AI Mode. `llms.txt` y archivos agent.json/MCP no prueban posicionamiento. No crear archivos vacíos solo para obtener una puntuación de auditoría. Codex no tiene un índice SEO separado documentado que esta auditoría pueda medir.

## Cierre de los 11 hallazgos automáticos

`deferred` significa pendiente de implementación o de evidencia adicional. Esta auditoría no modificó el sitio. `not-needed` y `no-change` se apoyan en la intención y el canonical observado, no en la ausencia de alertas.

| ID | Título exacto | Resultado | Motivo y respuesta | Verificación |
| `crawl:meta_description_duplicate` | meta_description_duplicate: Duplicate meta description (13 URLs) | `not-needed` | Las 12 variantes son filtros con canonical `/jobs`. No crear descripciones distintas solo para eliminar la alerta. | Confirmar canonical de las 12 variantes. Si se crean categorías indexables, auditar esas nuevas rutas. |
| `crawl:title_duplicate` | title_duplicate: Duplicate title (13 URLs) | `not-needed` | Las variantes consolidan su señal hacia `/jobs`. El título duplicado en estos filtros no demuestra una página indexable duplicada. | Revisar canonicals y URLs elegidas por Google en URL Inspection. |
| `crawl:duplicate_content` | duplicate_content: Duplicate content (13 URLs) | `not-needed` | La consolidación por canonical ya existe. No crear contenido artificial por combinación de filtros. | Conservar canonical `/jobs`. Revisar indexación antes de cambiar la política. |
| `crawl:h1_missing` | h1_missing: Missing H1 (1 URL) | `deferred` | Sí requiere cambio en `/plans`: su título visible es H2 y no existe H1. | Después de implementar, comprobar DOM y repetir el rastreo de `/plans`. |
| `crawl:noindex` | noindex: Noindex found (1 URL) | `no-change` | No requiere cambio: `/login` no es una landing que deba competir por búsquedas. | Conservar noindex en login. No aplicar esa política a páginas públicas útiles. |
| `crawl:canonicalized_page` | canonicalized_page: Canonicalized page (14 URLs) | `deferred` | Dos categorías de aprendizaje necesitan canonical propio. Las 12 variantes de empleo pueden conservar `/jobs`. | Repetir los 14 casos y comprobar cada destino. URL Inspection para categorías. |
| `crawl:title_too_wide` | title_too_wide: Title may truncate on some devices (4 URLs) | `deferred` | Revisar título final de cápsula, recruiting, privacidad y waitlist. La marca repetida es comprobable. La truncación es una estimación. | Revisar texto importante, marca única y medición de anchura después de editar. |
| `crawl:structured_data_missing` | structured_data_missing: No structured data detected (3 URLs) | `deferred` | CollectionPage y BreadcrumbList pueden describir categorías de aprendizaje. `/register` no necesita schema para eliminar la alerta. | Confirmar contenido visible, DOM y validación por cada categoría. No añadir schema genérico a registro. |
| `crawl:slow_response` | slow_response: Slow response in this crawl (2 URLs) | `deferred` | Dos respuestas lentas son observaciones aisladas. No prueban incumplimiento de Core Web Vitals. | Repetir tiempos y medir Lighthouse/CrUX antes de decidir un cambio. |
| `crawl:h1_multiple` | h1_multiple: Multiple H1 headings (1 URL) | `deferred` | El H1 extra de `/brand` es una muestra tipográfica. Se puede mantener el estilo con una etiqueta no principal. No es una penalización demostrada. | Comprobar estructura final y mantener la muestra visual. |
| `crawl:nofollow` | nofollow: Nofollow found (1 URL) | `no-change` | No requiere cambio de SEO en `/login`, fuera del contenido de adquisición. | Conservar la política de login y comprobar enlaces de las páginas públicas. |

El informe `ai-readiness` devolvió cero hallazgos accionables. Su cobertura de adquisición figura como desconocida y sus límites no permiten declarar visibilidad en IA ni un aprobado general. No hay filas de hallazgos adicionales pendientes en ese informe.

## Inventario completo por URL

Cada fila conserva evidencia y una decisión propia. “Rastreable” no significa “indexada”. Las rutas privadas se incluyen solo para contabilizar la cobertura, sin auditar sus dashboards.

| URL | Evidencia | Disposición |
| https://biovity.cl/ | 200. H1: 1. Canonical: https://biovity.cl/. | Conservar portal. Mejorar HTML inicial y headings de demos. Enlazar salarios y empleos. |
| https://biovity.cl/about | 200. H1: 1. Canonical: https://biovity.cl/about. | Conservar. Reforzar identidad verificable del equipo y contacto. |
| https://biovity.cl/blog | 200. H1: 1. Canonical: https://biovity.cl/blog. | Marca única en título. Organizar guías por intención. |
| https://biovity.cl/blog/como-preparar-entrevista-tecnica-biomedicina-rd | 200. H1: 1. Canonical: https://biovity.cl/blog/como-preparar-entrevista-tecnica-biomedicina-rd. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/cv-biotech-optimizado-ats | 200. H1: 1. Canonical: https://biovity.cl/blog/cv-biotech-optimizado-ats. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/estrategias-negociacion-salarial-primer-empleo-ciencias | 200. H1: 1. Canonical: https://biovity.cl/blog/estrategias-negociacion-salarial-primer-empleo-ciencias. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/first-post | 200. H1: 1. Canonical: https://biovity.cl/blog/first-post. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/guia-transicion-phd-postdoc-industria-biomedica | 200. H1: 1. Canonical: https://biovity.cl/blog/guia-transicion-phd-postdoc-industria-biomedica. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/habilidades-blandas-y-tecnicas-mas-demandadas-biotech | 200. H1: 1. Canonical: https://biovity.cl/blog/habilidades-blandas-y-tecnicas-mas-demandadas-biotech. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/blog/linkedin-y-networking-para-profesionales-de-biociencias | 200. H1: 1. Canonical: https://biovity.cl/blog/linkedin-y-networking-para-profesionales-de-biociencias. | Conservar artículo. Revisar autor real, fuentes y enlaces. En first-post, corregir tipo de autor Equipo Biovity. |
| https://biovity.cl/brand | 200. H1: 2. Canonical: https://biovity.cl/brand. | Revisar heading de muestra. Decidir inclusión en sitemap como recurso de marca. |
| https://biovity.cl/career-tips | 200. H1: 1. Canonical: https://biovity.cl/career-tips. | Revisar métricas sin respaldo, fechas y autoría. Conectar guías y salarios. |
| https://biovity.cl/companies | 200. H1: 1. Canonical: https://biovity.cl/companies. | Conservar intención comercial ATS. Unificar ofertas y versiones Markdown. |
| https://biovity.cl/cookies | 200. H1: 1. Canonical: https://biovity.cl/cookies. | Conservar condiciones accesibles. Revisar precisión y marca repetida. Sin prioridad de keywords comerciales. |
| https://biovity.cl/jobs | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Revisar intención específica antes de editar. |
| https://biovity.cl/jobs?categoria=Bioqu%C3%ADmica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?categoria=Biotecnolog%C3%ADa | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?categoria=I+D%20Farmac%C3%A9utica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?categoria=Ingenier%C3%ADa%20Qu%C3%ADmica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?categoria=Qu%C3%ADmica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?categoria=Salud%20y%20Medicina | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?experiencia=junior | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?q=Bioinform%C3%A1tica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?q=Ing.%20Alimentos | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?q=Ing.%20Biotecnolog%C3%ADa | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?q=Ing.%20Civil%20Qu%C3%ADmica | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/jobs?q=Qu%C3%ADmica%20y%20Farmacia | 200. H1: 1. Canonical: https://biovity.cl/jobs. | Conservar como filtro. Canonical `/jobs`. No crear una landing por parámetro sin demanda y ofertas. |
| https://biovity.cl/learn | 200. H1: 1. Canonical: https://biovity.cl/learn. | Título específico. Incluir en sitemap y enlazar categorías. |
| https://biovity.cl/learn/bioinformatica | 200. H1: 1. Canonical: https://biovity.cl/. | Corregir canonical propio. Incluir en sitemap. Evaluar CollectionPage y breadcrumbs. |
| https://biovity.cl/learn/bioinformatica/analisis-secuencias-adn-python | 200. H1: 1. Canonical: https://biovity.cl/learn/bioinformatica/analisis-secuencias-adn-python. | Conservar recurso. Incluir en sitemap y revisar autoría, título y latencia. |
| https://biovity.cl/learn/ia-biotech | 200. H1: 1. Canonical: https://biovity.cl/. | Corregir canonical propio. Incluir en sitemap. Evaluar CollectionPage y breadcrumbs. |
| https://biovity.cl/learn/ia-biotech/agentes-ai-biotech | 200. H1: 1. Canonical: https://biovity.cl/learn/ia-biotech/agentes-ai-biotech. | Conservar recurso. Incluir en sitemap y revisar autoría, título y latencia. |
| https://biovity.cl/login | 200. H1: 1. Canonical: https://biovity.cl/login. | Conservar noindex/nofollow. Fuera de adquisición pública. |
| https://biovity.cl/plans | 200. H1: 0. Canonical: https://biovity.cl/plans. | Añadir H1. Unificar precios y schema. Quitar FAQ no visible. |
| https://biovity.cl/privacy | 200. H1: 1. Canonical: https://biovity.cl/privacy. | Conservar condiciones accesibles. Revisar precisión y marca repetida. Sin prioridad de keywords comerciales. |
| https://biovity.cl/recruiting | 200. H1: 1. Canonical: https://biovity.cl/recruiting. | Diferenciar guía de proceso de companies. Revisar título y schema de producto. |
| https://biovity.cl/register | 200. H1: 1. Canonical: https://biovity.cl/register. | No añadir schema genérico. Revisar intención de indexación del registro por separado. |
| https://biovity.cl/salaries | 200. H1: 1. Canonical: https://biovity.cl/salaries. | Prioridad de demanda real. Añadir respaldo de datos, respuestas y FAQ visible. Conservar migración. |
| https://biovity.cl/share-salary | 200. H1: 1. Canonical: https://biovity.cl/share-salary. | Decidir indexación según utilidad pública y privacidad. No canonicalizar a salaries sin analizar contenido. |
| https://biovity.cl/terms | 200. H1: 1. Canonical: https://biovity.cl/terms. | Conservar condiciones accesibles. Revisar precisión y marca repetida. Sin prioridad de keywords comerciales. |
| https://biovity.cl/waitlist | 200. H1: 1. Canonical: https://biovity.cl/waitlist. | Revisar vigencia y propósito de lista de espera. No retirar sin confirmar estado del producto. |
| https://biovity.cl/dashboard/offers | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/dashboard/talent | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/login/organization | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/login/professional | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/register/organization | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/register/organization?plan=business | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/register/organization?plan=pro | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |
| https://biovity.cl/register/professional | Omitida por robots. Sin inspección de contenido. | Conservar fuera del alcance público. No abrir robots solo para completar el audit. |

Las 20 entradas del sitemap publicado corresponden a las filas públicas del inventario. No incluyen las rutas de aprendizaje señaladas. Los recursos Markdown y llms.txt son representaciones adicionales, no páginas para posicionar como duplicados del HTML.

## Plan de ejecución y medición

1. Corregir canonicals de aprendizaje, H1 de planes y coherencia de schema, FAQ y Markdown. Verificar antes y después con la misma lista de URLs.
2. Completar sitemap y fechas reales. Validar destinos históricos con redirects permanentes y sin saltos evitables. Mantener la URL final actual.
3. Documentar salarios, autores y métricas. Resolver cada afirmación sin respaldo antes de publicar nuevas respuestas AEO.
4. Ajustar títulos y contenido al mapa de intención. Empezar por salarios, con señales reales de demanda. Evitar cambios globales por alertas de filtros.
5. Medir Core Web Vitals y conversiones. Registrar fecha de despliegue y comparar ventanas equivalentes de Search Console. Separar consultas de marca y sin marca.
6. Medir preguntas de IA con una lista fija: dónde encontrar empleo biotech en Chile, cuánto gana un biotecnólogo, sueldo de bioinformática, ATS para laboratorio y CV científico. Registrar proveedor, fecha, modelo y cita. No confundir una cita aislada con cobertura estable.

No se ejecutaron builds ni se inició otro servidor. No hay correcciones declaradas como verificadas después de despliegue porque el alcance de este trabajo fue una auditoría.

## Fuentes y evidencia

- `live-report.json`: 11 hallazgos y verificaciones originales.
- `crawl-full.json`: 41 páginas, 66 observaciones y 49 solicitudes, recuperadas del informe guardado por el CLI.
- `affected-urls.json`: 66 filas de observación, sin truncación de salida.
- `ai-readiness.json`: controles técnicos y límites de AEO.
- `search-performance.json`: Search Console, diagnóstico parcial y fechas del periodo.
- `queries.json`: 59 consultas comparables y 100 filas no comparables retenidas. Quedaron 153 filas no comparables fuera de esa selección. No se usan como cero.
- `redirect-salaries.json`: tres saltos desde www/salarios hasta salaries.
- `sitemap-live.xml` y `llms-live.txt`: contenido publicado.
- Código fuente revisado: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/learn/[category]/page.tsx`, `components/seo/JsonLd.tsx`, `app/planes-md/route.ts`, `components/landing/home/LazySections.tsx`, `lib/data/consejos-carrera-data.ts`, `components/landing/salarios/SalariosMetodologia.tsx`.
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): mantiene los fundamentos SEO y no exige archivos o schema especiales para AI Overviews/AI Mode.
- [Google: etiquetas admitidas](https://developers.google.com/search/docs/crawling-indexing/special-tags): meta keywords no influye en indexación ni ranking.
- [OpenAI: bots](https://developers.openai.com/api/docs/bots): distingue búsqueda, entrenamiento y solicitudes de usuarios.
- [Anthropic: crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): distingue Claude-SearchBot, Claude-User y ClaudeBot.
