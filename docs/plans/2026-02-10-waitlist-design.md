# Waitlist Page Design

**Date:** 2026-02-10  
**Status:** Implemented

## Overview

Página de lista de espera que se muestra exclusivamente en producción cuando el software aún no está listo. En desarrollo, el equipo sigue viendo la app completa.

## Requirements

- **Trigger:** `NODE_ENV === "production"` → mostrar solo lista de espera
- **Trigger:** `NODE_ENV === "development"` → app normal
- **Form fields:** Email + Rol (Profesional / Empresa)
- **Email labels:** Profesional → "Correo personal", Empresa → "Correo corporativo"
- **Storage:** CSV en `data/waitlist.csv`

## Architecture

### Proxy (Next.js 16)

- **File:** `proxy.ts` (reemplaza middleware en Next.js 16)
- **Production:** Redirige todas las rutas excepto `/lista-espera` y `/api/waitlist` a `/lista-espera`
- **Development:** Solo aplica lógica de auth para `/dashboard`

### Routes

| Route | Production | Development |
|-------|------------|-------------|
| `/lista-espera` | Página waitlist | Página waitlist |
| `/api/waitlist` | POST guarda CSV | POST guarda CSV |
| Otras rutas | Redirect → `/lista-espera` | App normal |

### Storage

Supabase (PostgreSQL) via `lib/db/waitlist.ts`. Pool dedicado para la waitlist.

Tabla: `waitlist` con columnas `id`, `email`, `role`, `created_at`.

## Components

- **Page:** `app/lista-espera/page.tsx` — Formulario con rol selector y email
- **API:** `app/api/waitlist/route.ts` — POST, valida y guarda en CSV

## Design

- Paleta: blue-50/indigo-50/green-50, gradientes soft, gray-900 para botones
- Tipografía: Rubik (headings), Satoshi (body)
- Estilo: Minimal, cards con backdrop-blur, animaciones con motion/react

## Deployment

Compatible con Vercel. Usa Supabase/PostgreSQL.
