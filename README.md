# Biovity

**Biovity** es una plataforma diseñada para conectar profesionales y estudiantes con oportunidades laborales en el sector científico. Especializada en biotecnología, bioquímica, química, ingeniería química y salud, facilitamos el encuentro entre el talento y las empresas del sector científico.

## 🚀 Descripción del Proyecto

Biovity ayuda a profesionales y estudiantes a encontrar trabajo y oportunidades en el campo científico. La plataforma ofrece:

- **Búsqueda de empleo** especializada en ciencias
- **Perfiles profesionales** para candidatos
- **Panel de control** para empresas y profesionales
- **Proceso transparente** con ofertas verificadas
- **Recursos** para el desarrollo profesional

## 🛠️ Tecnologías

Este proyecto está construido con las siguientes tecnologías:

### Frontend

- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[GSAP](https://greensock.com/gsap/)** - Animaciones avanzadas
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos

### Backend & Autenticación

- **[Better Auth](https://www.better-auth.com/)** - Sistema de autenticación
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos

### Herramientas de Desarrollo

- **[Biome](https://biomejs.dev/)** - Linter y formateador
- **[Turbopack](https://turbo.build/pack)** - Bundler rápido

## 📦 Instalación

### Prerrequisitos

- Node.js 20+ o Bun
- PostgreSQL (para desarrollo local)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd biovity
   ```

2. **Instalar dependencias**

   ```bash
   bun install
   # o
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tus credenciales de base de datos y otras configuraciones necesarias.

4. **Ejecutar migraciones de base de datos** (si aplica)

   ```bash
   bun run db:migrate
   ```

5. **Iniciar el servidor de desarrollo**

   ```bash
   bun dev
   # o
   npm run dev
   ```

6. **Abrir en el navegador**

   ```
   http://localhost:3000
   ```

## 📜 Scripts Disponibles

```bash
# Desarrollo
bun dev              # Inicia el servidor de desarrollo con Turbopack

# Producción
bun build           # Construye la aplicación para producción
bun start           # Inicia el servidor de producción

# Calidad de Código
bun lint            # Ejecuta Biome para verificar el código
bun format          # Formatea el código con Biome
bun check           # Ejecuta lint y aplica correcciones automáticas
bun typecheck       # Verifica los tipos de TypeScript
```

## 📁 Estructura del Proyecto

```
biovity/
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── api/               # API routes
│   ├── dashboard/         # Panel de control
│   ├── login/             # Páginas de login
│   └── register/          # Páginas de registro
├── components/            # Componentes React
│   ├── LandingComponents/ # Componentes de la landing page
│   ├── DashboardComponents/# Componentes del dashboard
│   ├── Layouts/           # Layouts reutilizables
│   ├── common/            # Componentes comunes (Header, Footer)
│   └── ui/                # Componentes UI base
├── hooks/                 # Custom React hooks
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts           # Configuración de autenticación
│   └── utils.ts          # Funciones utilitarias
├── public/                # Archivos estáticos
└── styles/               # Estilos globales
```

## 👥 Guía para Colaboradores

### 🌿 Creación de Ramas

Utilizamos un sistema de ramas basado en el tipo de trabajo que se está realizando. Todas las ramas deben crearse desde `main` o `develop`.

#### Convención de Nombres

Las ramas deben seguir el siguiente formato:

```
<tipo>/<descripción-corta>
```

#### Tipos de Ramas

- **`feat/`** - Nueva funcionalidad

  ```bash
  git checkout -b feat/user-profile-page
  git checkout -b feat/job-search-filters
  ```

- **`fix/`** - Corrección de bugs

  ```bash
  git checkout -b fix/login-validation-error
  git checkout -b fix/mobile-responsive-header
  ```

- **`hotfix/`** - Corrección urgente en producción

  ```bash
  git checkout -b hotfix/critical-security-patch
  git checkout -b hotfix/payment-processing-error
  ```

- **`design/`** - Cambios de diseño/UI/UX

  ```bash
  git checkout -b design/landing-page-redesign
  git checkout -b design/dashboard-sidebar-improvement
  ```

- **`refactor/`** - Refactorización de código

  ```bash
  git checkout -b refactor/auth-service-modularization
  git checkout -b refactor/component-structure-reorganization
  ```

- **`docs/`** - Documentación

  ```bash
  git checkout -b docs/api-documentation
  git checkout -b docs/setup-guide-update
  ```

- **`test/`** - Pruebas

  ```bash
  git checkout -b test/add-unit-tests-auth
  git checkout -b test/integration-tests-job-search
  ```

- **`chore/`** - Tareas de mantenimiento

  ```bash
  git checkout -b chore/update-dependencies
  git checkout -b chore/ci-cd-pipeline-setup
  ```

#### Ejemplos de Buenas Prácticas

✅ **Buenos nombres de ramas:**

```bash
feat/user-dashboard-metrics
fix/header-scroll-behavior
design/landing-hero-section-animation
refactor/auth-middleware-cleanup
```

❌ **Nombres a evitar:**

```bash
feature                    # Muy genérico
fix-bug                   # Sin prefijo de tipo
new-feature               # No sigue la convención
mi-cambio                 # No descriptivo
```

### 💬 Convención de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial de commits limpio y fácil de entender.

#### Formato de Commits

```
<tipo>(<alcance>): <descripción>

[descripción opcional más detallada]

[footer opcional]
```

#### Tipos de Commits

- **`feat:`** - Nueva funcionalidad

  ```bash
  git commit -m "feat: agregar filtro de búsqueda por ubicación"
  git commit -m "feat(dashboard): implementar gráfico de métricas de usuario"
  ```

- **`fix:`** - Corrección de bugs

  ```bash
  git commit -m "fix: corregir validación de email en registro"
  git commit -m "fix(auth): resolver problema de sesión expirada"
  ```

- **`hotfix:`** - Corrección urgente

  ```bash
  git commit -m "hotfix: corregir vulnerabilidad de seguridad crítica"
  git commit -m "hotfix(payment): resolver error en procesamiento de pagos"
  ```

- **`design:`** - Cambios de diseño/UI

  ```bash
  git commit -m "design: mejorar responsive del header en móviles"
  git commit -m "design(landing): actualizar animaciones del hero section"
  ```

- **`refactor:`** - Refactorización sin cambiar funcionalidad

  ```bash
  git commit -m "refactor: reorganizar estructura de componentes"
  git commit -m "refactor(auth): modularizar servicio de autenticación"
  ```

- **`docs:`** - Cambios en documentación

  ```bash
  git commit -m "docs: actualizar guía de instalación"
  git commit -m "docs(api): agregar documentación de endpoints"
  ```

- **`test:`** - Agregar o modificar tests

  ```bash
  git commit -m "test: agregar tests unitarios para componente Button"
  git commit -m "test(auth): agregar tests de integración para login"
  ```

- **`chore:`** - Tareas de mantenimiento

  ```bash
  git commit -m "chore: actualizar dependencias a última versión"
  git commit -m "chore(ci): configurar pipeline de CI/CD"
  ```

- **`perf:`** - Mejoras de rendimiento

  ```bash
  git commit -m "perf: optimizar carga de imágenes con next/image"
  git commit -m "perf(dashboard): reducir tiempo de carga de métricas"
  ```

- **`style:`** - Cambios de formato (espacios, comas, etc.)

  ```bash
  git commit -m "style: corregir formato según Biome"
  ```

- **`ci:`** - Cambios en CI/CD

  ```bash
  git commit -m "ci: agregar test de build en GitHub Actions"
  ```

#### Alcance (Opcional)

El alcance indica qué parte del código se ve afectada:

```bash
feat(auth): agregar autenticación con Google
fix(dashboard): corregir cálculo de métricas
design(landing): mejorar hero section
refactor(components): reorganizar estructura
```

#### Ejemplos de Commits Completos

✅ **Buenos commits:**

```bash
feat(search): agregar filtro por rango salarial

Implementa filtro avanzado que permite a los usuarios buscar
empleos por rango salarial mínimo y máximo.

Closes #123

---

fix(auth): corregir redirección después de login

El usuario ahora es redirigido correctamente al dashboard después
de iniciar sesión, en lugar de quedarse en la página de login.

Fixes #456

---

design(landing): mejorar responsive del hero en móviles

- Ajustar tamaño de fuente para pantallas pequeñas
- Optimizar espaciado de elementos
- Mejorar contraste de texto sobre fondo degradado

---

refactor(components): extraer lógica de animación a hook personalizado

Crea useScrollAnimation hook para reutilizar lógica de animaciones
basadas en scroll en múltiples componentes.

BREAKING CHANGE: Los componentes ahora requieren pasar ref al hook
```

❌ **Commits a evitar:**

```bash
git commit -m "cambios"                    # Muy vago
git commit -m "fix bug"                    # Sin contexto
git commit -m "WIP"                        # Work in progress
git commit -m "asdf"                       # Sin sentido
git commit -m "actualizar cosas"          # No descriptivo
```

#### Reglas Importantes

1. **Usa el modo imperativo** ("agregar" no "agregué" o "agregando")
2. **Sé específico** en la descripción
3. **Mantén el mensaje corto** en la primera línea (máximo 72 caracteres)
4. **Usa el cuerpo** para explicar el "qué" y "por qué", no el "cómo"
5. **Menciona issues** relacionados con `Closes #123` o `Fixes #456`
6. **Marca breaking changes** con `BREAKING CHANGE:` en el footer

### 🔄 Proceso de Pull Request

1. **Crear la rama** siguiendo la convención de nombres
2. **Hacer commits** siguiendo la convención de commits
3. **Push de la rama** al repositorio remoto
4. **Crear Pull Request** con:
   - Título descriptivo
   - Descripción detallada de los cambios
   - Screenshots (si aplica para cambios de UI)
   - Referencias a issues relacionados
5. **Esperar revisión** y responder a comentarios
6. **Merge** después de aprobación

### 📝 Checklist antes de hacer PR

- [ ] El código sigue las convenciones del proyecto
- [ ] Los commits siguen la convención establecida
- [ ] El código está formateado (`bun format`)
- [ ] No hay errores de lint (`bun lint`)
- [ ] Los tipos de TypeScript están correctos (`bun typecheck`)
- [ ] La funcionalidad funciona correctamente
- [ ] Se probó en diferentes navegadores/dispositivos (si aplica)
- [ ] La documentación está actualizada (si aplica)

## 🎨 Guías de Estilo

### Código

- Usamos **Biome** para linting y formateo
- Seguimos las convenciones de **TypeScript** estrictas
- Preferimos **const** sobre funciones cuando sea posible
- Usamos **TailwindCSS** para todos los estilos (evitar CSS modules cuando sea posible)

### Componentes

- Componentes funcionales con TypeScript
- Nombres descriptivos para funciones y variables
- Event handlers con prefijo `handle` (ej: `handleClick`, `handleSubmit`)
- Accesibilidad: usar atributos `aria-*` y `tabindex` cuando sea necesario

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Documentación de GSAP](https://greensock.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**¿Tienes preguntas?** Abre un issue o contacta al equipo de desarrollo.
