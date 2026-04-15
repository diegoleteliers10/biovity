# Biovity

**Biovity** es una plataforma chilena diseñada para conectar profesionales y estudiantes con oportunidades laborales en el sector científico. Especializada en biotecnología, bioquímica, química, ingeniería química y salud, facilitamos el encuentro entre el talento y las empresas del sector científico.

## Descripción del Proyecto

Biovity ayuda a profesionales y estudiantes a encontrar trabajo y oportunidades en el campo científico. La plataforma ofrece:

- **Búsqueda de empleo** especializada en ciencias
- **Perfiles profesionales** para candidatos
- **Panel de control** para empresas y profesionales
- **Proceso transparente** con ofertas verificadas
- **Recursos** para el desarrollo profesional
- **AI Features** para análisis de candidatos y matcheo

## Tecnologías

### Frontend

- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[Motion](https://motion.dev/)** - Animaciones
- **[GSAP](https://greensock.com/gsap/)** - Animaciones avanzadas
- **[HugeIcons](https://hugeicons.com/)** - Sistema de iconos
- **[Radix UI](https://www.radix-ui.com/)** + **[Base UI](https://base-ui.com/)** - Componentes accesibles
- **[Shadcn](https://ui.shadcn.com/)** - Componentes UI
- **[Recharts](https://recharts.org/)** - Visualización de datos

### Backend & Autenticación

- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticación
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos (Supabase)
- **[Zod v4](https://zod.dev/)** - Validación de esquemas
- **[AI SDK](https://ai-sdk.com/)** - Integración con modelos de IA

### Herramientas de Desarrollo

- **[Biome](https://biomejs.dev/)** - Linter y formateador (strict rules, line width: 100)
- **[Turbopack](https://turbo.build/pack)** - Bundler rápido

## Instalación

### Prerrequisitos

- Node.js 20+ o Bun
- PostgreSQL (Supabase para desarrollo)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd biovity
   ```

2. **Instalar dependencias**

   ```bash
   bun install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tus credenciales.

4. **Iniciar el servidor de desarrollo**

   ```bash
   bun dev
   ```

5. **Abrir en el navegador**

   ```
   http://localhost:3000
   ```

## Scripts Disponibles

```bash
# Desarrollo
bun dev              # Inicia el servidor de desarrollo con Turbopack
bun dev:portless    # Dev con Portless (shareable URLs)

# Producción
bun build           # Construye la aplicación para producción
bun start           # Inicia el servidor de producción

# Calidad de Código
bun lint            # Ejecuta Biome para verificar el código
bun format          # Formatea el código con Biome
bun check           # Ejecuta lint y aplica correcciones automáticas
bun typecheck       # Verifica los tipos de TypeScript
```

## Estructura del Proyecto

```
biovity/
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── api/               # API routes
│   │   ├── auth/[...all]/ # Better Auth endpoint
│   │   ├── admin/         # Admin API routes
│   │   ├── ai/            # AI endpoints (scoring, actions)
│   │   ├── chats/         # Chat API
│   │   ├── messages/       # Messages API
│   │   ├── jobs/          # Jobs API
│   │   ├── og/            # Dynamic OG images
│   │   └── cron/          # Cron jobs
│   ├── dashboard/         # Panel de control (Parallel Routes)
│   │   ├── @admin/        # Admin dashboard
│   │   ├── @user/         # Professional dashboard
│   │   └── @organization/  # Organization dashboard
│   ├── login/             # Páginas de login
│   ├── register/          # Páginas de registro
│   └── blog/              # Blog (MDX)
├── components/
│   ├── ai/               # AI components (AnalyzeButton, AIScoreBadge, etc.)
│   ├── ai-elements/      # AI UI elements (prompt-input, message, code-block)
│   ├── animate-ui/       # Animated Radix/UI primitives
│   ├── base/             # Base primitives (avatar, select, input)
│   ├── blog/             # Blog components
│   ├── common/           # Common components (Header, Footer, DatePicker)
│   ├── dashboard/        # Dashboard components
│   │   ├── employee/     # Employee dashboard tabs
│   │   └── organization/  # Organization dashboard tabs
│   ├── landing/          # Landing page sections
│   ├── layouts/          # Layout wrappers
│   ├── providers/        # Context providers
│   ├── seo/              # SEO components (JsonLd)
│   └── ui/               # Shadcn + charts
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api/              # API client functions (fetchJson pattern)
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client config
│   ├── data/             # Static data (jobs, categories, filters)
│   ├── db/              # Database connection + migrations
│   ├── errors.ts         # Typed error constructors (TaggedError)
│   ├── result.ts        # better-result helpers (fetchJson, etc.)
│   ├── types/           # TypeScript definitions
│   ├── utils.ts         # Utility functions (cn, formatCurrencyCLP)
│   └── validations/     # Zod schemas
├── content/blog/         # Blog posts (MDX)
└── docs/                # Plans, SECURITY, COMMITS
```

## Patrones de Código

### better-result Pattern

Usamos `better-result` con `Result.tryPromise()` en vez de try/catch:

```typescript
import { Result as R } from "better-result"
import { fetchJson } from "@/lib/result"

const getJobs = async () => {
  return fetchJson<Job[]>("/api/jobs")
}

const result = await getJobs()
if (result.isErr()) {
  console.error(result.error)
  return
}
const jobs = result.value
```

### TaggedError para Errores Estructurados

```typescript
import { TaggedError } from "better-result"

class DbError extends TaggedError<{ cause?: string }> {
  readonly _tag = "DbError"
}

class ApiError extends TaggedError<{ status: number }> {
  readonly _tag = "ApiError"
}
```

### No useEffect para Data Fetching

Evitamos `useEffect` para data fetching. Usamos:

- **TanStack Query** (`useQuery`, `useMutation`) para datos del servidor
- **better-auth** (`useSession`) para autenticación
- **`useLoaderData`** de Next.js para server components

### Interface → Type

Usamos `type` en vez de `interface`:

```typescript
// ❌ Evitar
interface Props { name: string }

// ✅ Preferir
type Props = { name: string }
```

## Configuración de Autenticación

Better Auth está configurado con:

- **Email/password provider** con validaciones
- **Rate limiting**: 10 requests/minute por IP
- **Session expiry**: 7 días
- **Custom user fields**: `type` (professional/organization), `profession`, `avatar`, `isActive`, `organizationId`

Variables de entorno requeridas:

- `DATABASE_URL` – PostgreSQL connection string
- `BETTER_AUTH_SECRET` – Auth secret
- `BETTER_AUTH_URL` – Auth URL
- `BETTER_AUTH_API_KEY` – Dash plugin API key
- `ADMIN_EMAILS` – Comma-separated admin emails (opcional)
- `NEXT_PUBLIC_APP_URL` – App URL

## Guía para Colaboradores

### Creación de Ramas

```
<tipo>/<descripción-corta>
```

Tipos: `feat/`, `fix/`, `hotfix/`, `design/`, `refactor/`, `docs/`, `test/`, `chore/`, `perf/`, `style/`, `ci/`

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

feat(auth): agregar autenticación con Google
fix(dashboard): corregir cálculo de métricas
refactor(api): usar better-result pattern
```

### Checklist antes de hacer PR

- [ ] El código sigue las convenciones del proyecto
- [ ] Los commits siguen la convención establecida
- [ ] `bun format` ejecuta sin errores
- [ ] `bun lint` pasa sin warnings
- [ ] `bun typecheck` pasa sin errores
- [ ] La funcionalidad funciona correctamente

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Better Auth](https://www.better-auth.com/docs)
- [Documentación de Zod](https://zod.dev)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Licencia

Este proyecto es privado y confidencial.
