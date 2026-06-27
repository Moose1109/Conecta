# ConectaPueblos — Resumen de Fase 1

## 1. Visión general del proyecto

ConectaPueblos es una plataforma web social y comunitaria diseñada para conectar pueblos, personas, actividades locales y conversaciones de la comunidad. La experiencia del producto se centra en descubrir pueblos, apuntarse a actividades, leer y compartir publicaciones locales, explorar perfiles y sentirse parte de una comunidad rural viva.

El frontend de la Fase 1 establece ConectaPueblos como una red social rural/comunitaria cálida, moderna y visual. Actualmente es una aplicación solo frontend, utiliza datos mock locales y queda preparada para una futura integración con un backend FastAPI.

## 2. URL pública actual

https://conecta-pueblos.vercel.app

## 3. Stack tecnológico usado en Fase 1

- Next.js App Router
- TypeScript
- TailwindCSS
- Datos mock locales
- Interacciones en cliente con `useState` y `localStorage`
- Despliegue en Vercel

## 4. Alcance completado en Fase 1

### Fase 1.0 — MVP inicial del frontend

- Proyecto frontend creado desde cero.
- Rutas principales de la aplicación creadas.
- Diseño visual inicial cálido, rural y comunitario implementado.
- Datos mock locales añadidos para pueblos, actividades y publicaciones comunitarias.

### Fase 1.1 — Estructura frontend preparada para API

- Capa `lib/api/` preparada.
- Services creados para villages, activities, community y auth.
- Los datos siguen viniendo desde mocks locales.
- Estructura preparada para reemplazar más adelante los mocks por respuestas de FastAPI.

### Fase 1.2 — Experiencia de app social

- Layout social creado con navbar, sidebar, right rail y navegación inferior mobile.
- Feed comunitario mejorado con una experiencia social más visual.
- Dashboard rediseñado como home social del usuario.
- Perfil rediseñado con apariencia de perfil social.
- Pueblos y actividades rediseñados con un enfoque más fuerte de descubrimiento.

### Fase 1.3 — Interacciones listas para demo

- Filtros reales en cliente añadidos.
- Likes mock persistidos con `localStorage`.
- Estados de guardado mock persistidos con `localStorage`.
- Estado de apuntarse a actividades gestionado localmente.
- Estado de seguir pueblos gestionado localmente.
- Rutas futuras mock creadas:
  - `/explore`
  - `/notifications`
  - `/messages`
  - `/settings`

### Fase 1.4 — Pulido visual

- Layout responsive pulido.
- Textos UX mejorados.
- Metadata mejorada.
- Estados visuales mock añadidos con `LoadingState`, `ErrorState` y `EmptyState`.
- Espaciado y usabilidad de la navegación inferior mobile mejorados.
- Landing aclarada como red social comunitaria rural.

### Fase 1.5 — Despliegue en Vercel

- Despliegue completado en Vercel.
- Verificación mobile completada.
- URL pública activa.

## 5. Rutas principales

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/community`
- `/activities`
- `/activities/[id]`
- `/activities/create`
- `/villages`
- `/villages/[id]`
- `/profile`
- `/admin`
- `/explore`
- `/notifications`
- `/messages`
- `/settings`

## 6. Carpetas principales

- `app/` — Páginas y segmentos de ruta de Next.js App Router.
- `components/` — Componentes compartidos de UI, layout y experiencia social.
- `features/` — Componentes específicos de funcionalidades para actividades, pueblos y comunidad.
- `data/` — Datos mock locales usados durante la Fase 1.
- `lib/` — Tipos compartidos, utilidades y helpers de la aplicación.
- `lib/api/` — Capa de services preparada para API, actualmente respaldada por datos mock locales.

## 7. Componentes importantes creados

- `mobile-bottom-nav.tsx`
- `social-layout.tsx`
- `sidebar-nav.tsx`
- `right-rail.tsx`
- `navbar.tsx`
- `page-header.tsx`
- `search-input.tsx`
- `notification-bell.tsx`
- `loading-state.tsx`
- `error-state.tsx`
- `future-page.tsx`
- `follow-button.tsx`
- `join-activity-button.tsx`
- `save-button.tsx`
- `social-post-actions.tsx`
- `social-post-card.tsx`
- `activity-card.tsx`
- `village-card.tsx`

## 8. Datos mock

Todavía no existe un backend real. La Fase 1 usa datos mock locales desde:

- `data/villages.ts`
- `data/activities.ts`
- `data/community.ts`

Los services de `lib/api/*` actúan como una capa intermedia entre la UI y los datos mock actuales. Esto mantiene el frontend preparado para una futura integración con FastAPI: cuando el backend esté listo, las funciones actualmente respaldadas por mocks podrán reemplazarse gradualmente por llamadas reales a la API sin reescribir las pantallas.

## 9. Estado de validación

- `npm run lint` pasa.
- `npm run build` pasa.
- El despliegue en Vercel funciona correctamente.
- La verificación mobile está completada.

## 10. Limitaciones actuales

- No hay backend real.
- No hay autenticación real.
- No hay base de datos.
- Likes, guardados, follows e inscripciones a actividades son interacciones mock almacenadas localmente con `localStorage`.
- No hay subida real de imágenes.
- Los mensajes y notificaciones todavía no son reales.

## 11. Roadmap recomendado para Fase 2

### Fase 2.0 — Base backend con FastAPI

- Crear carpeta `backend/`.
- Configurar FastAPI.
- Configurar CORS.
- Crear endpoint de health check.
- Establecer una estructura backend limpia.

### Fase 2.1 — PostgreSQL Neon + SQLAlchemy + Alembic

- Conectar PostgreSQL Neon.
- Crear modelos iniciales de base de datos.
- Configurar migraciones con Alembic.

### Fase 2.2 — Autenticación

- Implementar registro.
- Implementar login.
- Añadir autenticación JWT.
- Añadir `/auth/me`.

### Fase 2.3 — Recursos principales de API

- Pueblos.
- Actividades.
- Publicaciones comunitarias.
- Usuarios.

### Fase 2.4 — Interacciones sociales

- Likes.
- Publicaciones guardadas.
- Follows.
- Participantes de actividades.

### Fase 2.5 — Integración frontend

- Reemplazar gradualmente los datos mock usando `lib/api/*`.
- Mantener fallback de datos mock si resulta útil durante la transición.

## 12. Siguiente paso inmediato

El siguiente paso recomendado es crear primero la base del backend FastAPI, sin conectar todas las pantallas del frontend de golpe. Empezar por estructura del proyecto, CORS, endpoint de health check, configuración de entorno y setup de base de datos. Cuando la base del backend esté estable, reemplazar gradualmente los services de `lib/api/*` que actualmente usan mocks.
