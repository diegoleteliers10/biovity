import { NextResponse } from "next/server"

const content = `# Planes y Precios para Empresas - Biovity

Planes simples y透明的 para empresas que buscan talento científico en biotecnología, bioquímica, química e ingeniería química.

## Filosofía de Precios

Creemos en la transparencia total. Sin costos ocultos, sin comisiones por contratación, sin sorpresas.

## Planes Disponibles

### Plan Gratuito

Para empresas que inician en el reclutamiento científico.

**Precio**: $0 / mes

**Incluye**:
- Hasta 3 ofertas activas simultáneas
- Acceso básico a candidatos
- Dashboard de postulaciones
- Perfil de empresa básico
- Soporte por email

**Ideal para**: Startups, laboratorios pequeños, empresas con necesidades de reclutamiento ocasionales.

### Plan Profesional

Para empresas en crecimiento que necesitan acceso constante a talento.

**Precio**: $149.000 CLP / mes

**Incluye**:
- Ofertas ilimitadas
- Posición destacada en resultados de búsqueda
- Acceso completo a base de candidatos
- Analytics avanzado de reclutamiento
- Mensajería ilimitada con candidatos
- Portal de marca personalizada
- Soporte prioritario
- Acceso a datos salariales para ofertas

**Ideal para**: Empresas medianas, laboratorios, empresas farmacéuticas en expansión.

### Plan Enterprise

Para organizaciones que requieren soluciones de reclutamiento a medida.

**Precio**: $449.000 CLP / mes

**Incluye**:
- Todo lo de Profesional
- Integraciones API personalizadas
- Onboarding dedicado con nuestro equipo
- Account manager exclusivo
- SLA con garantias de uptime
- Capacitación equipo de reclutamiento
- Reports personalizados
- Multi-user con roles y permisos
- SSO/SAML support
- White label option disponible

**Ideal para**: Grandes corporaciones, multinacionales, empresas con alto volumen de contratación.

## Comparación de Planes

| Característica | Gratuito | Profesional | Enterprise |
|----------------|----------|-------------|------------|
| Ofertas activas | 3 | Ilimitadas | Ilimitadas |
| Acceso candidatos | Básico | Completo | Completo |
| Posición destacada | No | Sí | Sí |
| Analytics | Limitado | Avanzado | Custom |
| Mensajería | Básica | Ilimitada | Ilimitada |
| Soporte | Email | Prioritario | Dedicado |
| API | No | No | Sí |
| Onboarding | No | No | Sí |
| SSO/SAML | No | No | Sí |

## Complementos Opcionales

### Gestión de Marca Empleadora

- $49.000 CLP / mes adicionales
- Página de empresa personalizada
- Blog de contenido científico
- Newsletter a candidatos

### Acceso a Base de Datos

- $99.000 CLP / mes adicionales
- Búsqueda directa en CV database
- Contacto proactivo a candidatos
- Alertas de candidatos matching

## Preguntas Frecuentes sobre Precios

**Hay costo por contratar a través de Biovity?**

No. Una vez que tienes un plan activo, no hay comisiones por contratación ni costos adicionales por contratar candidatos de la plataforma.

**Puedo cambiar de plan?**

Sí, puedes upgrade o downgrade en cualquier momento. Los cambios se aplican al siguiente ciclo de facturación.

**Hay descuento por pago anual?**

Sí, ofrecemos 2 meses gratis si pagas anualmente.

**Qué métodos de pago aceptan?**

Tarjeta de crédito, débito, transferencia bancaria y facturas electrónicas.

**Puedo probar antes de comprar?**

Sí, ofrecemos 14 días de prueba gratis para el Plan Profesional.

**Qué pasa si excedo el límite de ofertas (Plan Gratuito)?**

Te notifyicamos y te damos la opción de hacer upgrade o esperar a que una oferta expire.

## Facturación

- Facturación mensual o anual
- Facturación electrónica disponible
- RUT empresarial requerido para faktura

## ROI Esperado

Empresas que usan Biovity reportan:
- 50 por ciento reducción en tiempo de contratación
- 35 por ciento mejora en calidad de candidatos
- 40 por ciento reducción en costo por hire vs portales genéricos
- 25 por ciento aumento en retention de nuevos hires

## Testimonios

"Before Biovity, reclutamos un científico tomaba 4 meses promedio. Ahora tenemos candidatos qualificados en semanas." - Lab Manager, Pharma Chile

"El matching por IA nos ayuda a filtrar candidatos cualificados sin perder tiempo en aplicaciones no relevantes." - HR Director, Biotech Startup

## Empiece Hoy

1. **Crea tu cuenta** de empresa en Biovity
2. **Selecciona tu plan** según tus necesidades
3. **Publica tu primera oferta** y comienza a recibir postulaciones
4. **Convierte candidatos** en empleados

## Contacto

- Sitio web: https://biovity.cl/planes
- Región: Chile
- Sector: Software de reclutamiento científico

## Términos de Búsqueda

planes empresas biotecnología, precios ATS científico, suscripción reclutamiento ciencias, planes empresas chemistry Chile, precios software reclutamiento, talento científico planes, pricing Biovity Chile, costos reclutamiento biotech`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
