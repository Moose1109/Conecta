# Checkpoint post-corrección de integración

Fecha: **2026-07-20**.

## Problema original y causa raíz

El feed mostraba entidades producidas por `USE_MOCK_DATA=true`, pero like/save/join/follow y CRUD buscaban esas identidades en PostgreSQL. La UI aplicaba optimismo y recibía 404. El backend no expone procedencia ni capacidades.

## Comportamiento anterior / nuevo

| Antes | Ahora |
|---|---|
| URL API aceptaba dos variables. | Única fuente: `NEXT_PUBLIC_API_BASE_URL`; error claro si falta. |
| `ApiError` solo llevaba status/detail. | Tipo, status, code, fields, path seguro, red y timeout. |
| Algunos servicios convertían fallos en `[]`/`undefined`. | Propagan el fallo; las vistas diferencian fallo y vacío. |
| Like/save/join/follow intentaban mutar fixtures. | Demo visible pero acción no persistente; 404 adicional con rollback. |
| Doble clic dependía del rerender. | Lock síncrono por acción y botón pending. |
| Crear podía relacionar un pueblo demo. | Opciones demo no se envían como FK persistente. |
| Crear con feed mock parecía aparecer en la lista. | Confirmación de creación y aviso de catálogo demo. |
| Validación FastAPI era ad hoc. | `fieldErrors` centralizados y error inline reusable. |
| Fallos esperables llegaban a `console.error` cliente. | UI controlada y diagnóstico dev resumido. |

## Archivos frontend modificados

- `lib/api/client.ts`, `error-message.ts`, `entity-capabilities.ts`
- servicios de posts, actividades y pueblos; `lib/types.ts`
- acciones sociales, cards, detalles, rail y composer
- `components/ui/inline-field-error.tsx`
- formularios de auth y creación de actividad
- providers/explorers/perfil/settings/admin para logging controlado
- README y documentación de auditoría

## Endpoints conectados

Registro, login, usuario actual, actualización de perfil, GET de posts/activities/villages, creación de posts/activities, like/unlike, save/unsave de posts/activities, join/leave y follow/unfollow. Ver matriz completa.

## Pendientes y configuración

- Faltantes: comentarios, compartir, colecciones personales, notificaciones, mensajes y uploads.
- Existentes sin UI: editar/eliminar post y actividad, perfil público y administración completa de pueblos.
- `USE_MOCK_DATA=false` es necesario para QA de persistencia real.

## Pruebas

- `npx tsc --noEmit`: **PASS**.
- `npm run lint -- --max-warnings=0`: **PASS**.
- Pruebas aisladas de `apiFetch`: **PASS** para 204, 422/fieldErrors, red, timeout, path seguro y URL ausente.
- Smoke backend read-only contra `http://127.0.0.1:8000`: **0 PASS / 8 FAIL / 1 SKIP**, porque la API no estaba accesible. No se levantó ni modificó el backend.
- `npm run build`: **PASS**, Next.js 16.2.9; 18 rutas generadas.
- Mutaciones E2E: **NO EJECUTADAS**; modificarían PostgreSQL y no hay DB QA descartable autorizada.

## Riesgos y siguiente paso

El registro central de fixtures es temporal; los listados carecen de total y las colecciones personales no existen. Se recomienda levantar una API QA descartable con `USE_MOCK_DATA=false`, autorizar el smoke con mutaciones y, después, exponer `data_source`/capacidades o eliminar el split-brain.
