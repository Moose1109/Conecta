# Endpoints backend existentes sin uso efectivo en frontend

## Alcance

Inventario con corte **2026-07-20**, obtenido de routers FastAPI, OpenAPI y búsqueda de consumidores en `app/`, `features/`, `components/` y `lib/api/`.

La auditoría backend fue de solo lectura. Los endpoints GET de catálogo se probaron por separado, pero los endpoints incluidos aquí no se marcaron como validados end-to-end si no fueron invocados. Ninguna mutación fue ejecutada.

## Definiciones

- **Servicio y UI:** existe función TypeScript y una pantalla/componente la llama.
- **Servicio sin UI:** existe función TypeScript, pero no hay consumidor efectivo.
- **Sin servicio:** no existe adapter/función frontend.
- **Operativo:** endpoint para health, documentación o monitorización; no debe conectarse a la experiencia de producto.
- **Seguro de conectar:** significa que el contrato se puede consumir sin ampliar backend, no que deba conectarse automáticamente.

## Resumen

| Grupo | Cantidad | Recomendación |
|---|---:|---|
| Producto, lectura, sin UI | 1 | Integrar cuando exista pantalla aprobada. |
| Producto, mutación, sin UI | 7 | Requiere diseño de permisos, confirmación y QA con DB descartable. |
| Operativos sin UI | 7 | Mantener fuera de la aplicación; usar en smoke/monitorización. |

## A. Endpoints de lectura de producto sin consumidor efectivo

| Método | URL | Propósito backend | Estado frontend | Servicio recomendado | Pantalla recomendada | Prioridad | ¿Seguro conectarlo? | Auth/rol | Respuesta / errores | Dependencias y observación |
|---|---|---|---|---|---|---|---|---|---|---|
| GET | `/api/v1/users/{id_or_username}` | Perfil público por UUID o username | Sin servicio ni ruta | `getUserProfile(idOrUsername)` en `auth.service` o servicio `users.service` | Futura `/profile/[username]` | P2 | Sí, tras decisión de privacidad | Público | 200 `UserResponse`; 404 | `UserResponse` expone `role` y `favorite_village_id`; revisar privacidad antes de integrarlo. No expone email/password_hash. |

### Criterios antes de conectarlos

1. Definir metadatos, loading, empty/error state y navegación de vuelta.
2. Diferenciar 404 de caída de API.
3. Rehidratar flags personalizados con bearer cuando corresponda.
4. No mostrar `role` o pueblo favorito sin una decisión explícita de privacidad.
5. El GET de post ya se usa para rehidratar interacciones con IDs procedentes del backend; una futura ruta de detalle debe validar cualquier ID recibido desde navegación libre.

## B. Mutaciones de producto existentes sin UI efectiva

### B.1 Pueblos

| Método | URL | Propósito | Estado frontend | Servicio recomendado | Pantalla | Prioridad | Auth/rol | Payload | Respuesta | Errores y riesgos | ¿Seguro conectarlo? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| POST | `/api/v1/villages` | Crear pueblo | `createVillage` existe, sin consumidor | Reutilizar `createVillage`; añadir validación/form state | `/admin/villages/new` | P2 | Bearer admin | name, slug, province, region; population/tagline/description/image/banner/highlights opcionales | 201 `VillageResponse` | 401, 403, 409 slug, 422; population negativa no está bloqueada backend | Sí, solo tras UI admin y QA |
| PUT | `/api/v1/villages/{id_or_slug}` | Actualización parcial | Sin servicio/UI | `updateVillage(id,payload,token)` | `/admin/villages/[id]/edit` | P2 | Bearer admin | `VillageUpdate`, omitir campos no cambiados | 200 `VillageResponse` | 401, 403, 404, 409, 422; null en campos obligatorios puede producir 500 | Condicionado |
| DELETE | `/api/v1/villages/{id_or_slug}` | Soft delete | Sin servicio/UI | `deleteVillage(id,token)` | Admin detalle/listado | P2 | Bearer admin | Path UUID/slug | 204 sin JSON | 401, 403, 404; impacto sobre contenido relacionado; slug no reutilizable | Condicionado, acción destructiva |

Dependencias frontend mínimas:

- `AuthGate` con rol confirmado por `/users/me`.
- Formulario con labels, errores 409/422 y bloqueo de doble envío.
- Confirmación explícita para delete y feedback tras 204.
- No enviar null para name/slug/province/region.
- Revalidar catálogo y detalle tras éxito.
- No presentar `villages.length` de una página como total administrativo.

### B.2 Actividades

| Método | URL | Propósito | Estado frontend | Servicio recomendado | Pantalla | Prioridad | Auth/rol | Payload | Respuesta | Errores y riesgos | ¿Seguro conectarlo? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PUT | `/api/v1/activities/{id_or_slug}` | Editar actividad | Sin servicio/UI | `updateActivity(id,payload,token)` | Futura `/activities/[id]/edit` | P2 | Organizador o admin | `ActivityUpdate` parcial | 200 `ActivityResponse` | 401, 403 ownership, 404, 409 slug, 422; null en campos NOT NULL puede causar 500 | Sí, condicionado a ownership/QA |
| DELETE | `/api/v1/activities/{id_or_slug}` | Soft delete de actividad | Sin servicio/UI | `deleteActivity(id,token)` | Detalle/gestión del organizador | P2 | Organizador o admin | Path | 204 sin JSON | 401, 403, 404; definir efecto en participantes/notificaciones | Condicionado, destructivo |

Dependencias frontend mínimas:

- Mostrar Editar/Eliminar solo si el usuario actual es organizer o admin; el backend sigue siendo la autoridad.
- Reutilizar validaciones de `create-activity-form`.
- No enviar null para slug/title/description/village_id/category/starts_at/capacity/location/status.
- Tratar 403 sin borrar sesión.
- Confirmar delete y volver a `/activities` tras 204.
- Antes de activar delete, producto debe decidir cómo avisar a participantes; el backend aún no tiene notificaciones.

### B.3 Publicaciones

| Método | URL | Propósito | Estado frontend | Servicio recomendado | Pantalla | Prioridad | Auth/rol | Payload | Respuesta | Errores y riesgos | ¿Seguro conectarlo? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PUT | `/api/v1/posts/{post_id}` | Editar post | Sin servicio/UI | `updateCommunityPost(id,payload,token)` | Menú contextual de `SocialPostCard` o detalle | P2 | Autor o admin | `CommunityPostUpdate` parcial | 200 `CommunityPostResponse` | 401, 403, 404, 422; title/content null puede producir 500 | Sí, con validación |
| DELETE | `/api/v1/posts/{post_id}` | Soft delete | Sin servicio/UI | `deleteCommunityPost(id,token)` | Menú contextual | P2 | Autor o admin | UUID path | 204 sin JSON | 401, 403, 404; invalidación de feed/perfil/guardados | Condicionado, destructivo |

Dependencias frontend mínimas:

- Validar UUID, title vacío o 2-180 y content >=2.
- En update, omitir propiedades no cambiadas; nunca enviar title/content null.
- Resolver ownership con current user, pero aceptar que backend devuelva 403.
- Diálogo de confirmación accesible, Escape/focus return y estado submitting.
- Tras 204, retirar el post de feed/perfil sin falsificar otros contadores.

## C. Endpoints operativos sin uso en la UI

| Método | URL | Uso correcto | Estado runtime de auditoría | ¿Conectar a UI? | Riesgo / recomendación |
|---|---|---|---|---|---|
| GET | `/` | Descubrimiento básico del servicio | 200 | No | Puede usarse manualmente; no aporta estado funcional del producto. |
| GET | `/health` | Liveness | 200 | No | Adecuado para plataforma/monitor; actualmente expone environment y HEAD devuelve 405. |
| GET | `/api/v1/health` | Liveness versionado | 200 | No | Devuelve environment hardcodeado a `development`; corregir backend antes de fiarse de ese campo. |
| GET | `/api/v1/db-check` | Readiness de PostgreSQL | 200 | No, especialmente no desde navegador | Es público y revela conectividad; limitar respuesta/acceso en despliegue. |
| GET | `/docs` | Swagger para desarrollo/QA | 200 | No | OpenAPI no declara Bearer correctamente; restringir o decidir exposición en producción. |
| GET | `/openapi.json` | Contrato/SDK/smoke | 200, 20 paths y 35 operaciones | No como feature | Fuente de contrato; apto para CI. No contiene securitySchemes. |
| GET | `/redoc` | Documentación generada por FastAPI | Inspeccionado por configuración, no consultado | No | Misma política que Swagger. |

El frontend puede añadir un smoke test de health/OpenAPI en tooling o CI, pero no una llamada periódica desde cada sesión de usuario.

## D. Endpoints existentes y ya conectados

Esta tabla evita clasificar como “sin uso” endpoints que sí tienen consumidor.

| Módulo | Endpoints conectados | Consumidor principal | Nivel de validación |
|---|---|---|---|
| Auth | POST `/auth/register`, POST `/auth/login` | Formularios register/login | Contrato/código; mutaciones no ejecutadas |
| Sesión | GET `/users/me`, fallback GET `/auth/me` | Auth landing, gate, perfil, settings, admin | Contrato/código |
| Perfil | PUT `/users/me` | Settings | Contrato/código; mutación no ejecutada; favorite defectuoso |
| Pueblos | GET lista/detalle | Explorer, detalle, community/provider, perfil, admin | Lista RUNTIME-REAL; detalle contrato |
| Pueblos | POST/DELETE follow | FollowButton | Contrato/código; mutación no ejecutada |
| Actividades | GET lista/detalle | Explorer, community, perfil, admin, detalles | Lista RUNTIME-REAL; detalle contrato |
| Actividades | POST create | CreateActivityForm | Contrato/código; mutación no ejecutada |
| Actividades | POST/DELETE join | JoinActivityButton | Contrato/código; mutación no ejecutada |
| Actividades | POST/DELETE save | SaveButton | Contrato/código; mutación no ejecutada |
| Posts | GET lista y detalle | Community provider/feed, perfil, detalle de pueblo y rehidratación de interacciones | Lista RUNTIME-REAL; detalle contrato/código |
| Posts | POST create | PostComposer | Contrato/código; mutación no ejecutada |
| Posts | POST/DELETE like | SocialPostActions | Contrato/código; mutación no ejecutada |
| Posts | POST/DELETE save | SocialPostActions | Contrato/código; mutación no ejecutada |

## E. Respuestas de mutación que debe respetar cualquier integración futura

| Operación | Status éxito | Body real |
|---|---:|---|
| Crear pueblo | 201 | `VillageResponse` |
| Editar pueblo | 200 | `VillageResponse` |
| Eliminar pueblo | 204 | Sin body |
| Editar actividad | 200 | `ActivityResponse` base, no el enriquecido público |
| Eliminar actividad | 204 | Sin body |
| Editar post | 200 | `CommunityPostResponse` base |
| Eliminar post | 204 | Sin body |
| Follow/unfollow | 200 | `{status,message,followed}` |
| Join/leave | 200 | `{status,message,joined}`; join puede 409 por aforo |
| Save/unsave | 200 | `{status,message,saved}` |
| Like/unlike | 200 | `{status,message,liked,likes_count}` |

OpenAPI no especifica schemas de las cinco respuestas de interacción. Los servicios frontend pueden aceptar aliases de transición, pero el backend debe formalizar un contrato único.

## F. Priorización de conexión

### P1 — solo si entra en alcance inmediato

- Ningún endpoint sin uso listado es necesario para mantener los flujos principales ya existentes.
- El detalle de post puede elevarse a P1 si comentarios o deep links pasan al siguiente sprint.

### P2 — siguiente sprint administrativo/social

1. Perfil público, después de decidir campos públicos.
2. Detalle de post.
3. Editar/eliminar posts propios.
4. Editar/eliminar actividades propias.
5. CRUD administrativo de pueblos.

### No conectar a producto

- Root, health, db-check, docs, OpenAPI y ReDoc. Deben pertenecer a monitorización, QA o CI.

## G. Plan de QA para activar endpoints actualmente sin uso

Debe ejecutarse en una base QA descartable con usuarios creados para la prueba:

1. Usuario normal recibe 403 en CRUD de pueblos.
2. Admin crea/edita/elimina pueblo; 409 slug y 422 validados.
3. Organizador edita/elimina su actividad; tercero recibe 403; admin puede intervenir.
4. Autor edita/elimina su post; tercero recibe 403; admin puede intervenir.
5. Cada DELETE confirma 204 sin intentar parsear JSON.
6. Tras cada mutación, listado y detalle reflejan el cambio después de recarga.
7. Null explícito en campos obligatorios se bloquea en frontend; el defecto backend queda en test pendiente.
8. IDs/slug inexistentes muestran 404 visible.
9. Token ausente/caducado limpia sesión únicamente cuando corresponde; 403 no se trata como 401.
10. Cualquier contador o métrica se vuelve a consultar; no se inventa.

## H. Criterio para retirar un endpoint de este documento

Solo se marca como conectado cuando:

- existe un consumidor UI real, no solo una función sin importar;
- método, URL, token, payload y respuesta coinciden con OpenAPI/código backend;
- se manejan loading, empty, success, 401, 403, 404, 409, 422 y red;
- la mutación se prueba con PostgreSQL QA y persiste tras recarga;
- el permiso se prueba con usuario autorizado y no autorizado;
- no se muestran mocks, hardcodes ni éxito optimista permanente ante error;
- lint, TypeScript y build continúan correctos.
