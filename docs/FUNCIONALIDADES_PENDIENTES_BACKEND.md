# Funcionalidades pendientes de backend

## Propósito y alcance

Este documento registra exclusivamente carencias confirmadas mediante la inspección de routers, schemas, modelos, servicios y OpenAPI del backend de ConectaPueblos con corte **2026-07-20**. Las URLs son propuestas de diseño: **no existen todavía**, salvo cuando se indica expresamente que debe corregirse un endpoint actual.

Durante la auditoría no se modificó el backend ni PostgreSQL. No se ejecutaron mutaciones. Por tanto:

- “Existe” significa que se encontró el router y el contrato real.
- “Pendiente” significa que se revisaron código y OpenAPI y no existe soporte suficiente.
- Los contratos propuestos no deben conectarse en frontend hasta aparecer en el OpenAPI real y superar pruebas QA.
- El frontend debe mantener estados controlados y no simular persistencia.

## Clasificación obligatoria

| Categoría | Elementos confirmados | Acción |
|---|---|---|
| 1. Endpoint inexistente | Comentarios, compartir, colecciones guardadas/seguidas/inscritas, notificaciones, mensajes, uploads, password reset, refresh/revocación y búsqueda global. | Implementar backend y publicar contrato OpenAPI antes de conectar. |
| 2. Endpoint existente incompatible con modo mock | Like/save de posts; join/save de actividades; follow de pueblos; CRUD de las tres entidades cuando el GET devuelve fixtures. | Unificar fuente o exponer procedencia/capacidades. **Me gusta no es un endpoint faltante.** |
| 3. Endpoint existente sin uso frontend | PUT/DELETE posts; PUT/DELETE activities; perfil público; CRUD admin de pueblos sin UI completa. | Diseñar flujo, ownership y confirmación antes de conectar. |
| 4. Problema de configuración | `USE_MOCK_DATA=true` al validar persistencia; más de una variable API histórica. | API QA con mock false; frontend usa solo `NEXT_PUBLIC_API_BASE_URL`. |
| 5. Función futura | OAuth, mapa geográfico, recomendaciones personalizadas, follows entre usuarios y panel admin completo. | Priorizar en roadmap; no simular. |

## Capacidades ya existentes que no deben solicitarse otra vez

- Registro, login y consulta del usuario actual.
- Actualización parcial de perfil, con la excepción defectuosa de `favorite_village_id`.
- Listado y detalle de pueblos, actividades y posts.
- Creación de posts y actividades.
- CRUD backend de pueblos para admin.
- Update/delete backend de posts para autor/admin.
- Update/delete backend de actividades para organizador/admin.
- Follow/unfollow de pueblos.
- Join/leave y save/unsave de actividades.
- Like/unlike y save/unsave de posts.

Lo que falta en guardados, follows y joins son principalmente las **colecciones del usuario**, no los mutadores.

## Tabla resumen de trabajo backend

| ID | Prioridad | Módulo / componente frontend | Método | URL propuesta o contrato afectado | Estado |
|---|---|---|---|---|---|
| BACK-001 | P1 | Settings / `settings-view` | PUT existente | `/api/v1/users/me` (`favorite_village_id`) | CONTRATO EXISTENTE NO PERSISTE |
| BACK-002 | P1 | Perfil / `profile-view`, `profile-tabs` | GET | `/api/v1/users/me/followed-villages` | FALTA BACKEND |
| BACK-003 | P1 | Perfil / `profile-view`, `profile-tabs` | GET | `/api/v1/users/me/activities` | FALTA BACKEND |
| BACK-004 | P1 | Guardados / `app/saved/page.tsx` | GET | `/api/v1/users/me/saved-posts` | FALTA BACKEND |
| BACK-005 | P1 | Guardados / `app/saved/page.tsx` | GET | `/api/v1/users/me/saved-activities` | FALTA BACKEND |
| BACK-006 | P1/P2 | Perfil / `profile-header`, `profile-view` | GET | `/api/v1/users/{id_or_username}/stats` | FALTA BACKEND |
| BACK-007 | P1 | Comunidad / `social-post-actions` | GET/POST/PATCH/DELETE | Comments de posts | FALTA BACKEND |
| BACK-008 | P2 | Comunidad / `social-post-actions` | POST | `/api/v1/posts/{post_id}/shares` | FALTA BACKEND |
| BACK-009 | P2 | Bell y notificaciones / `notifications-view` | GET/PATCH | `/api/v1/notifications*` | FALTA BACKEND |
| BACK-010 | P2 | Mensajes / `app/messages/page.tsx`, navbar | GET/POST/PATCH | `/api/v1/conversations*` | FALTA BACKEND |
| BACK-011 | P1/P2 | Composer, actividad y settings | POST/DELETE | `/api/v1/uploads/images`, `/uploads/{id}` | FALTA BACKEND |
| BACK-012 | P1 | Login / `login-form` | POST | `/api/v1/auth/password-reset/*` | FALTA BACKEND |
| BACK-013 | P2 | Sesión / `session.ts`, user menu | POST | `/api/v1/auth/refresh`, `/auth/logout` | FALTA BACKEND |
| BACK-014 | P2 | Auth pública / `public-auth-shell` | GET/callback | `/api/v1/auth/oauth/{provider}/*` | FALTA BACKEND |
| BACK-015 | P2 | Navbar y `/explore` | GET | `/api/v1/search` | FALTA BACKEND |
| BACK-016 | P3 | Pueblos / `village-explorer` | GET | `/api/v1/villages/map` | FALTA BACKEND Y DATOS GEO |
| BACK-017 | P3 | Rails/recomendaciones | GET | `/api/v1/users/me/recommendations` | FALTA BACKEND |
| BACK-018 | P2/P3 | Perfil público / `profile-header` futuro | POST/DELETE/GET | Follow de usuarios | FALTA BACKEND |
| BACK-019 | P2 | Detalle actividad | GET | `/api/v1/activities/{id}/participants` | FALTA BACKEND |
| BACK-020 | P2 | Admin / `admin-dashboard` | GET/PATCH | `/api/v1/admin/*` | FALTA BACKEND |
| BACK-021 | P3 | Comunidad / `post-composer` | POST/vote | Tipos notice/poll/attachments | FALTA BACKEND |
| BACK-022 | P1 | Todos los servicios API | OpenAPI | Bearer y response models de interacciones | CONTRATO INCOMPLETO |
| BACK-023 | P1/P2 | Listados, perfil y admin | GET | Metadata paginada | CONTRATO INCOMPLETO |
| BACK-024 | P0/P1 | Auth y despliegue | Configuración | Secretos, seeds, rate limit y usuarios borrados | RIESGO BACKEND |
| BACK-025 | P1 | Mutaciones y fechas | Contrato/DB | Null, concurrencia, enums y UTC | RIESGO BACKEND |

## Convenciones recomendadas para nuevos contratos

### Identificadores y nombres

- UUID en path/body, siempre validado antes de consultar PostgreSQL.
- JSON en `snake_case`, coherente con el backend actual.
- Fechas UTC ISO 8601 con `Z` u offset; columnas `DateTime(timezone=True)`.
- No aceptar IDs controlados por el cliente para author_id, organizer_id o user_id.

### Paginación

```json
{
  "items": [],
  "total": 0,
  "limit": 20,
  "offset": 0,
  "has_more": false
}
```

- `offset >= 0`.
- `1 <= limit <= 100`.
- Para conversaciones/notificaciones con alta escritura, preferir cursor estable.
- El orden debe ser determinista e incluir un segundo criterio por UUID.

### Error estable recomendado

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "No se ha encontrado el recurso.",
    "fields": {},
    "request_id": "uuid"
  }
}
```

El frontend actual seguirá aceptando `detail` durante la transición. Códigos mínimos: 400, 401, 403, 404, 409, 410, 413, 415, 422, 429 y 500.

### Seguridad común

- Bearer válido mediante un security scheme OpenAPI real.
- Ausencia de Authorization en endpoint público puede ser anónima; Authorization presente pero inválida debe devolver 401.
- Rate limit por IP/usuario en auth, mensajes, comentarios, shares y uploads.
- Ownership verificado en backend; nunca confiar en role/IDs de localStorage.
- Transacciones y manejo de `IntegrityError` con rollback y error de dominio.
- No exponer secretos, hashes, tokens, email privado ni detalles internos de DB.

---

## BACK-001 — Persistencia del pueblo favorito

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Perfil y `/settings`; selector de pueblo favorito. |
| Componente | `features/profile/settings-view.tsx`. |
| Acción | Elegir o eliminar el pueblo favorito y guardar el perfil. |
| Estado actual | `UserUpdate` y `UserResponse` declaran `favorite_village_id`, pero `User` no tiene columna y `PUT /users/me` elimina el campo antes de actualizar. |
| Problema | El backend puede responder 200 sin persistir el dato. Mostrar éxito sería engañoso. |
| Prioridad | **P1**, porque afecta una preferencia explícitamente editable. |
| Endpoint | Corregir el existente: `PUT /api/v1/users/me`. No crear una segunda fuente de verdad. |
| Auth / rol | Bearer; usuario actual. |
| Body | `{ "favorite_village_id": "uuid" }` o `{ "favorite_village_id": null }`. |
| Respuesta | `UserMeResponse` con el valor realmente persistido. |
| Errores | 401 token; 404 pueblo inexistente/soft-deleted; 422 UUID; 409 conflicto futuro. |
| Entidades/tablas | Añadir `users.favorite_village_id` nullable, FK `villages.id`, índice; política `ON DELETE SET NULL`. |
| Restricciones | Solo pueblo activo; null permitido; actualización transaccional. |
| Efecto en perfil | Permite mostrar preferencia real y restaurarla tras recarga. |
| Efecto en notificaciones | Ninguno inicialmente; podría alimentar recomendaciones futuras. |
| Dependencias | Migración Alembic, modelo, schema, servicio y tests. |
| Mitigación frontend | No afirmar persistencia; ocultar/deshabilitar la preferencia o señalarla como pendiente. |
| Criterios de aceptación | PUT persiste UUID/null; GET `/users/me` devuelve lo guardado tras una sesión nueva; 404 no cambia el valor; usuario A no modifica al B. |

## BACK-002 — Colección de pueblos seguidos

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/profile`, tab Pueblos; `/saved` si se agrupan favoritos. |
| Acción | Recuperar exclusivamente pueblos que sigue el usuario actual. |
| Estado actual | Follow/unfollow existe. El frontend descarga hasta 100 pueblos y filtra `is_following`. |
| Problema | Se pierden relaciones fuera de la primera colección y no hay total. |
| Prioridad | **P1**, porque la relación ya es persistente y el perfil debe recuperarla correctamente. |
| Endpoint | `GET /api/v1/users/me/followed-villages`. |
| Auth / rol | Bearer; usuario actual. |
| Query | `offset=0`, `limit=20`, opcional `search`, `province`, `region`. |
| Body | Ninguno. |
| Respuesta | Envelope paginado de `VillagePublicResponse`, siempre con `is_following=true`. |
| Errores | 401, 422, 500 controlado. |
| Entidades/tablas | `village_followers`, `villages`, contadores agregados. |
| Restricciones | Excluir pueblos soft-deleted; orden por follow.created_at desc + id. |
| Efecto en contadores | `total` es número de follows del usuario, no total de pueblos. |
| Efecto en perfil | Tab y métrica de pueblos seguidos pasan a ser exactas. |
| Efecto en notificaciones | Fuente para distribuir novedades de pueblos seguidos. |
| Dependencias | Índice compuesto ya existe; query paginada y response model. |
| Mitigación frontend | Filtro de catálogo con limit 100 y aviso/valor parcial; no declarar un total global. |
| Criterios de aceptación | Follow aparece una vez; unfollow desaparece; paginación estable; aislamiento entre usuarios; flags sobreviven recarga. |

## BACK-003 — Actividades del usuario: inscritas y organizadas

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/profile`, “Mis actividades”. |
| Acción | Separar actividades inscritas de actividades organizadas. |
| Estado actual | Join/leave existe; `GET /activities` no filtra por participante u organizer. Frontend descarga catálogo y filtra `is_joined`. |
| Problema | Datos incompletos, sin total, y semántica ambigua entre inscrita/organizada/recomendada. |
| Prioridad | **P1**. |
| Endpoint | `GET /api/v1/users/me/activities`. |
| Auth / rol | Bearer; usuario actual. |
| Query | `relation=joined|organized`, `status`, `date_from`, `date_to`, `offset`, `limit`. |
| Body | Ninguno. |
| Respuesta | Envelope de `ActivityPublicResponse`; añadir `relation` si se permite `all`. |
| Errores | 401, 422. |
| Entidades/tablas | `activity_participants`, `activities`, `users`, `villages`, `saved_activities`. |
| Restricciones | Excluir soft-deleted; política explícita para cancelled/draft; orden fecha + UUID. |
| Efecto en contadores | Totales separados joined/organized; no confundir con recomendaciones. |
| Efecto en perfil | Tabs y métricas exactas. |
| Efecto en notificaciones | Inscritas sirven para recordatorios/cancelaciones. |
| Dependencias | Política de statuses y timezone definida. |
| Mitigación frontend | Mostrar solo flags de la colección cargada; etiquetar como parcial o vacío, nunca inventar inscritas. |
| Criterios de aceptación | Join aparece; leave desaparece; organized usa organizer_id del token; draft solo visible según permiso; páginas sin duplicados. |

## BACK-004 — Listado de posts guardados

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/saved`. |
| Acción | Recuperar posts guardados tras recarga o en otro dispositivo. |
| Estado actual | POST/DELETE save existen; falta GET de colección. |
| Problema | La pantalla no puede representar persistencia real aunque la mutación funcione. |
| Prioridad | **P1**. |
| Endpoint | `GET /api/v1/users/me/saved-posts`. |
| Auth / rol | Bearer; usuario actual. |
| Query | offset, limit, opcional village_id/search. |
| Respuesta | Envelope de `CommunityPostPublicResponse`, `is_saved=true`, orden `saved_posts.created_at desc`. |
| Errores | 401, 422. |
| Entidades/tablas | `saved_posts`, `community_posts`, `users`, `villages`, `post_likes`. |
| Restricciones | Excluir posts soft-deleted; no revelar posts sin visibilidad futura. |
| Contadores/perfil | `total` alimenta Guardados; no cambia likes. |
| Notificaciones | Ningún evento por guardar salvo decisión de producto. |
| Dependencias | Paginación y política de visibilidad. |
| Mitigación frontend | `BackendPendingAlert` en `/saved`; no usar localStorage como colección canónica. |
| Criterios de aceptación | Save idempotente; item aparece tras login nuevo; unsave lo retira; páginas estables. |

## BACK-005 — Listado de actividades guardadas

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/saved`. |
| Acción | Recuperar actividades guardadas. |
| Estado actual | POST/DELETE save existen; falta GET de colección. |
| Prioridad | **P1**. |
| Endpoint | `GET /api/v1/users/me/saved-activities`. |
| Auth / rol | Bearer. |
| Query | offset, limit, status, date_from/date_to, village_id. |
| Respuesta | Envelope de `ActivityPublicResponse`, `is_saved=true`, orden por guardado desc. |
| Errores | 401, 422. |
| Entidades/tablas | `saved_activities`, `activities`, participants, villages, users. |
| Restricciones | Excluir soft-deleted; política explícita para actividades pasadas/canceladas. |
| Efecto en perfil | Puede alimentar una sección Guardados separada de Inscritas. |
| Efecto en notificaciones | Una actividad guardada no implica inscripción; no enviar recordatorio de participante. |
| Dependencias | Status/timezone y paginación. |
| Mitigación frontend | Estado pendiente y CTA a catálogo real. |
| Criterios de aceptación | Save/unsave se refleja tras recarga; joined y saved permanecen relaciones independientes. |

## BACK-006 — Estadísticas de perfil reales

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Cabecera de `/profile` y perfil público futuro. |
| Acción | Mostrar métricas sin contar una página parcial. |
| Estado actual | Se derivan longitudes de arrays con límite 100; followers de usuario no existe. |
| Prioridad | **P1** si las métricas continúan visibles; P2 si se ocultan. |
| Endpoint | `GET /api/v1/users/{id_or_username}/stats`; opcional `/users/me/stats` para métricas privadas. |
| Auth / rol | Público para counts aprobados; Bearer para saved/joined privados. |
| Respuesta pública | `{posts_count,organized_activities_count,followers_count,following_users_count}`. |
| Respuesta privada | Añadir `{joined_activities_count,followed_villages_count,saved_posts_count,saved_activities_count}`. |
| Errores | 401 en privado, 404 usuario. |
| Entidades/tablas | users, posts, activities, participants, village_followers, saved_*, user_followers futura. |
| Restricciones | Contar solo recursos visibles/no soft-deleted; queries agregadas e indexadas. |
| Efecto en perfil | Métricas exactas, distinguibles y no hardcodeadas. |
| Notificaciones | Ninguno directo. |
| Dependencias | BACK-018 para followers de usuario. |
| Mitigación frontend | Mostrar `—` o conteo explícitamente derivado; no usar una página como total. |
| Criterios de aceptación | Counts coinciden con queries de control; privacidad separada; rendimiento acotado. |

## BACK-007 — Comentarios de publicaciones

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/community`, tarjeta/detalle de post. |
| Componente | `SocialPostActions` y futura lista/formulario de comentarios. |
| Acción | Listar, crear, editar y eliminar comentarios. |
| Estado actual | Solo existe `comments_count`; no hay tabla ni endpoint. |
| Problema | El contador puede mostrar valores, pero el usuario no puede inspeccionarlos ni comentar. |
| Prioridad | **P1**, experiencia social principal. |
| Endpoints | `GET/POST /api/v1/posts/{post_id}/comments`; `PATCH/DELETE /api/v1/comments/{comment_id}`. |
| Auth / rol | GET según visibilidad del post; POST Bearer; PATCH/DELETE autor o admin. |
| Query | GET offset/limit o cursor. |
| Body | POST/PATCH `{ "content": "texto" }`, recomendado 1-2000 caracteres. |
| Respuesta | Comment `{id,post_id,author,content,created_at,updated_at}`; DELETE 204. |
| Errores | 401, 403, 404 post/comment, 409 recurso cerrado, 422, 429. |
| Entidades/tablas | Nueva `post_comments`; FK post/user; created_at/updated_at/deleted_at; índices post+created. |
| Restricciones | Contenido normalizado; soft delete; sanitización/output escaping; transacción de count. |
| Efecto en contadores | `comments_count` debe derivarse o actualizarse atómicamente y excluir borrados. |
| Efecto en perfil | Opcional actividad reciente; no contar como post. |
| Efecto en notificaciones | Notificar al autor salvo auto-comentario; agrupar spam. |
| Dependencias | Notificaciones y rate limit recomendados. |
| Mitigación frontend | Acción interceptada como pendiente; jamás incrementar el contador en memoria. |
| Criterios de aceptación | CRUD/ownership; count consistente bajo concurrencia; paginación estable; persistencia tras recarga; 429 probado. |

## BACK-008 — Compartir y contador de compartidos

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Comunidad, acción Compartir. |
| Estado actual | `shares_count` existe sin tabla/servicio/router. |
| Prioridad | **P2**. |
| Endpoint | `POST /api/v1/posts/{post_id}/shares`. |
| Auth / rol | Definir: Bearer recomendado para métrica confiable; compartir URL nativo puede ocurrir sin registrar. |
| Body | `{ "channel": "copy_link|native|external" }`; nunca recibir user_id. |
| Respuesta | `{ "shared": true, "post_id": "uuid", "shares_count": 1 }`. |
| Errores | 401 si aplica, 404, 409 si hay idempotency key, 422, 429. |
| Entidades/tablas | Nueva `post_shares` o eventos analíticos; índice post/created/user. |
| Restricciones | Definir si múltiples shares por usuario cuentan; idempotency key para retries. |
| Efecto en contadores | Actualización atómica o count derivado; nunca aceptar count del cliente. |
| Efecto en perfil/notificaciones | No cambia perfil; notificación opcional al autor con agregación. |
| Dependencias | Observabilidad/eventos y política de privacidad. |
| Mitigación frontend | Permitir Web Share/portapapeles solo como acción local claramente separada; no alterar contador. |
| Criterios de aceptación | Retry no duplica involuntariamente; contador consistente; canal validado. |

## BACK-009 — Notificaciones

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Bell global y `/notifications`. |
| Acción | Listar, contar no leídas, marcar una/todas como leídas. |
| Estado actual | No hay modelo ni endpoint; frontend muestra vacío controlado, sin badge falso. |
| Prioridad | **P2**, necesaria al madurar interacciones sociales. |
| Endpoints | `GET /api/v1/notifications`; `GET /notifications/unread-count`; `PATCH /notifications/{id}/read`; `PATCH /notifications/read-all`. |
| Auth / rol | Bearer; solo destinatario. |
| Query | `cursor`, `limit`, `read=true|false`, `type`. |
| Respuesta | Items `{id,type,title,body,actor,resource,is_read,created_at,read_at}`, `next_cursor`; count `{unread_count}`. |
| Errores | 401, 403, 404, 422, 429. |
| Entidades/tablas | `notifications`; recipient_id, actor_id nullable, type, resource_type/id, read_at, dedupe_key. |
| Restricciones | No permitir leer notificación ajena; deduplicación; retención; contenido sin datos sensibles. |
| Efecto en contadores | unread_count transaccional/consultable. |
| Efecto en perfil | Ninguno directo. |
| Dependencias | Comentarios, follows, actividad y jobs/event bus según escala. |
| Mitigación frontend | Bell sin contador y estado pendiente/empty. |
| Criterios de aceptación | Aislamiento; count cambia al leer; read-all idempotente; cursor sin duplicados; evento real genera una notificación. |

## BACK-010 — Mensajes y conversaciones

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/messages`, icono de mensajes desktop y menú móvil. |
| Acción | Crear/listar conversaciones, listar/enviar mensajes y marcar lectura. |
| Estado actual | Ruta visual controlada; no hay backend. |
| Prioridad | **P2**; no bloquea comunidad pública, pero sí comunicación directa. |
| Endpoints | `GET/POST /api/v1/conversations`; `GET/POST /conversations/{id}/messages`; `PATCH /conversations/{id}/read`. |
| Auth / rol | Bearer; solo participantes; admin no debe leer por defecto sin política/auditoría. |
| Query | Cursor/limit, search opcional; mensajes por cursor cronológico. |
| Body conversación | `{ "participant_ids": ["uuid"] }`; validar que no contenga al emisor duplicado. |
| Body mensaje | `{ "content": "texto", "attachment_ids": [] }`. |
| Respuesta | ConversationSummary y Message con sender, timestamps, read state y next_cursor. |
| Errores | 401, 403 no participante, 404, 409 duplicada/bloqueada, 413, 422, 429. |
| Entidades/tablas | conversations, conversation_participants, messages, message_receipts; attachments opcional. |
| Restricciones | Longitud, rate limit, bloqueo/reportes, idempotency key, privacidad y retención. |
| Efecto en contadores | unread por conversación y global. |
| Efecto en perfil/notificaciones | Acceso desde perfil futuro; notificación de mensaje según preferencias. |
| Dependencias | Uploads, notificaciones, moderación y quizá WebSocket/SSE futuro. |
| Mitigación frontend | No mostrar conversaciones demo ni permitir enviar; explicar dependencia backend. |
| Criterios de aceptación | Solo participantes acceden; retry no duplica; lectura consistente; paginación; pruebas de abuso y aislamiento. |

## BACK-011 — Subida y gestión de imágenes

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Composer, actividad, avatar, portada y pueblos admin. |
| Acción | Seleccionar fichero y obtener URL persistente segura. |
| Estado actual | Schemas aceptan strings `image_url`/`avatar_url`; no existe upload. |
| Prioridad | **P1/P2**: P1 si el botón Foto continúa visible; P2 para edición avanzada. |
| Endpoint | `POST /api/v1/uploads/images` multipart; opcional `DELETE /uploads/{id}` con ownership. |
| Auth / rol | Bearer; scopes por uso; admin para assets de pueblo si aplica. |
| Body | `file`, `purpose=post|activity|avatar|banner|village`; no aceptar URL arbitraria como sustituto sin validación. |
| Respuesta | 201 `{id,url,width,height,mime_type,size_bytes}`. |
| Errores | 401, 403, 413 tamaño, 415 MIME, 422 dimensiones, 429, 503 storage. |
| Entidades/tablas | `media_assets` + storage S3/R2/Cloudinary; owner_id, status, checksum, timestamps. |
| Restricciones | MIME real, antivirus si procede, límites, stripping EXIF, variantes, URLs HTTPS. |
| Efecto en contadores/perfil | Ninguno; actualiza avatar/banner tras PUT. |
| Notificaciones | Ninguna. |
| Dependencias | Proveedor de storage, CDN, lifecycle y secretos de despliegue. |
| Mitigación frontend | Foto/vídeo interceptado como pendiente; solo enviar URLs existentes válidas. |
| Criterios de aceptación | Fichero válido visible tras recarga; archivo inválido rechazado; usuario no borra asset ajeno; limpieza de huérfanos. |

## BACK-012 — Recuperación de contraseña

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Login, enlace “¿Has olvidado tu contraseña?”. |
| Estado actual | Sin endpoint ni email provider. |
| Prioridad | **P1**, recuperación básica de cuenta. |
| Endpoints | `POST /api/v1/auth/password-reset/request`; `POST /auth/password-reset/confirm`. |
| Auth / rol | Público, con rate limit y anti-enumeración. |
| Body request | `{ "email": "usuario@example.test" }`. |
| Respuesta request | 202 genérico, exista o no la cuenta. |
| Body confirm | `{ "token": "opaque-single-use", "new_password": "..." }`. |
| Respuesta confirm | 204; revocar sesiones existentes según política. |
| Errores | 400 token inválido, 410 expirado/usado, 422 password, 429. |
| Entidades/tablas | password_reset_tokens hasheados, user_id, expires_at, used_at. |
| Restricciones | Token aleatorio, corto TTL, un uso, no JWT reutilizable, email normalizado. |
| Efecto en perfil/notificaciones | Aviso de seguridad por email; no exponer existencia. |
| Dependencias | Proveedor email, templates y observabilidad. |
| Mitigación frontend | No prometer correo; mostrar función pendiente o retirar enlace activo. |
| Criterios de aceptación | Anti-enumeración; expiración/un solo uso; nueva contraseña funciona; anterior falla; rate limit probado. |

## BACK-013 — Refresh token, logout y revocación

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Sesión global y logout. |
| Estado actual | Solo access JWT de 60 minutos; logout borra localStorage y el token sigue válido hasta expirar. |
| Prioridad | **P2**, elevada a P1 antes de producción sensible. |
| Endpoints | `POST /api/v1/auth/refresh`; `POST /api/v1/auth/logout`; opcional `DELETE /auth/sessions/{id}`. |
| Auth / rol | Refresh cookie HttpOnly Secure SameSite o token rotatorio; access Bearer para listar sesiones. |
| Body | Preferible ninguno si cookie; nunca guardar refresh en localStorage. |
| Respuesta | Refresh: access token y expiración; logout: 204. |
| Errores | 401, 409 token reutilizado, 429. |
| Entidades/tablas | auth_sessions/refresh_tokens hasheados, family_id, expires_at, revoked_at, device metadata mínima. |
| Restricciones | Rotación, detección de reuse, revocación al cambiar password, CSRF si cookie. |
| Efecto en perfil/notificaciones | Gestión de dispositivos y alertas de seguridad futuras. |
| Dependencias | Política de sesión y cookies/CORS. |
| Mitigación frontend | Limpiar sesión local ante 401; no afirmar revocación remota. |
| Criterios de aceptación | Token rotado no se reutiliza; logout invalida refresh; access expira; sesiones aisladas y testeadas. |

## BACK-014 — OAuth Google/Apple

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Login/register social. |
| Estado actual | Botones visuales sin provider backend. |
| Prioridad | **P2**. |
| Endpoints | `GET /api/v1/auth/oauth/{provider}/start`; `GET /auth/oauth/{provider}/callback`; endpoint de intercambio seguro si arquitectura SPA lo exige. |
| Auth / rol | Público; state, nonce y PKCE obligatorios. |
| Respuesta | Redirect controlado; sesión propia backend, no token del provider en URL frontend. |
| Errores | 400 state/callback, 409 conflicto de vinculación, 422 provider, 429. |
| Entidades/tablas | oauth_identities provider+subject unique, user_id, metadata mínima. |
| Restricciones | Account linking explícito, email verification, redirect allowlist. |
| Efecto en perfil | Cuenta unificada; no sobrescribir nombre/avatar sin consentimiento. |
| Dependencias | Credenciales provider por entorno, secrets manager y refresh/logout. |
| Mitigación frontend | Botones deshabilitados o mensaje pendiente; no simular OAuth. |
| Criterios de aceptación | State/PKCE, cancelación, callback inválido, cuenta existente, logout y no exposición de tokens. |

## BACK-015 — Búsqueda global

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Buscador global y `/explore`. |
| Estado actual | Cada catálogo tiene filtros separados; no hay búsqueda unificada. |
| Prioridad | **P2**. |
| Endpoint | `GET /api/v1/search`. |
| Auth / rol | Público; bearer opcional para personalización. |
| Query | `q`, `types=posts,activities,villages,users`, `limit_per_type`, cursor/offset. |
| Respuesta | `{query,results:{posts,activities,villages,users},counts,next}`. |
| Errores | 400 query demasiado corta, 422, 429, 503 índice. |
| Entidades/tablas | Índices PostgreSQL trigram/full-text inicialmente; motor externo solo si escala. |
| Restricciones | Min/max q, ranking estable, solo recursos públicos, sanitización. |
| Efecto en perfil/notificaciones | Usuarios públicos según política; ninguno en notificaciones. |
| Dependencias | Política de visibilidad, índices y paginación. |
| Mitigación frontend | Buscar dentro del listado real o redirigir; no mezclar arrays hardcodeados. |
| Criterios de aceptación | Resultados por tipo, typo/case, exclusión de borrados/drafts, latencia objetivo y páginas estables. |

## BACK-016 — Mapa y geolocalización de pueblos

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/villages`, sección “Ver en mapa”. |
| Estado actual | Village no contiene latitud/longitud; no hay endpoint espacial. |
| Prioridad | **P3**. |
| Endpoint | `GET /api/v1/villages/map`; alternativamente extender `/villages` con campos de coordenadas. |
| Auth / rol | Público. |
| Query | `bbox=west,south,east,north`, `zoom`, filtros; límites estrictos. |
| Respuesta | GeoJSON FeatureCollection con id, slug, name y propiedades mínimas. |
| Errores | 400 bbox, 422, 429. |
| Entidades/tablas | village latitude/longitude o PostGIS geography(Point); índice espacial. |
| Restricciones | Coordenadas válidas, no geolocalizar domicilios personales, clustering. |
| Efecto en perfil/notificaciones | Ninguno. |
| Dependencias | Migración, proveedor de mapas y licencia/atribución. |
| Mitigación frontend | Panel topográfico editorial + aviso pendiente; no pins ficticios interactivos. |
| Criterios de aceptación | Bounding box correcto, coordenadas reales, accesibilidad alternativa en lista y rendimiento por zoom. |

## BACK-017 — Recomendaciones personalizadas

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/explore`, rail de perfil, detalle de actividad/pueblo. |
| Estado actual | No existe endpoint; algunos bloques reutilizan catálogos reales, sin personalización confirmada. |
| Prioridad | **P3**. |
| Endpoint | `GET /api/v1/users/me/recommendations`. |
| Auth / rol | Bearer para personalización; fallback público editorial separado. |
| Query | `type=village|activity|post`, `context_id`, `limit`, cursor. |
| Respuesta | `{items:[{resource,reason,score?}],generated_at}`; score puede omitirse públicamente. |
| Errores | 401, 422, 429, 503. |
| Entidades/tablas | Follows, joins, saves, favorite village, categorías; tabla de eventos solo con consentimiento. |
| Restricciones | Privacidad, explicabilidad, exclusión de bloqueados/borrados, no inferir ubicación sensible. |
| Efecto en perfil | Rail realmente personalizado. |
| Efecto en notificaciones | No enviar recomendaciones como notificación sin preferencia. |
| Dependencias | BACK-001/002/003/004/005 y analítica consentida. |
| Mitigación frontend | Etiquetar listas como exploración; mostrar aviso donde se promete personalización. |
| Criterios de aceptación | Razón coherente, sin recursos seguidos/guardados duplicados cuando no procede, opt-out y fallback vacío. |

## BACK-018 — Seguimiento entre usuarios

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Perfil público y métrica Seguidores. |
| Estado actual | Solo existe seguimiento de pueblos; no hay user_followers. |
| Prioridad | **P2/P3**, según decisión de producto. |
| Endpoints | `POST/DELETE /api/v1/users/{id_or_username}/follow`; `GET /users/{id}/followers`; `GET /users/{id}/following`. |
| Auth / rol | Mutaciones Bearer; listados según privacidad. |
| Respuesta acción | `{following,user_id,followers_count}`. Listas paginadas de UserSummary. |
| Errores | 401, 404, 409 auto-follow/bloqueo, 422, 429. |
| Entidades/tablas | user_followers unique follower/followed; bloqueos futuros. |
| Restricciones | Prohibir auto-follow; idempotencia; privacidad/bloqueos. |
| Efecto en contadores/perfil | Followers/following exactos. |
| Efecto en notificaciones | Evento follow con deduplicación. |
| Dependencias | Perfil público, notificaciones y moderación. |
| Mitigación frontend | No mostrar contador hardcodeado ni botón de follow de usuario. |
| Criterios de aceptación | Idempotencia, aislamiento, auto-follow 409, counts consistentes y bloqueo respetado. |

## BACK-019 — Participantes de una actividad

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Detalle/gestión de actividad. |
| Estado actual | Solo participants_count y spots_left. |
| Prioridad | **P2** para organizadores; P3 para exposición pública. |
| Endpoint | `GET /api/v1/activities/{id_or_slug}/participants`. |
| Auth / rol | Organizador/admin para datos completos; público solo si producto y consentimiento lo permiten. |
| Query | offset/limit, search opcional, status futuro. |
| Respuesta | Envelope de UserSummary mínima y joined_at. |
| Errores | 401, 403, 404, 422. |
| Entidades/tablas | activity_participants, users. |
| Restricciones | Minimización de datos; excluir email; respetar cuentas borradas. |
| Efecto en contadores | `total` debe coincidir con participants_count. |
| Efecto en perfil/notificaciones | Gestión del organizador; avisos por cancelación. |
| Dependencias | Política de privacidad y notificaciones. |
| Mitigación frontend | Mostrar solo count/plazas; no inventar avatares de asistentes. |
| Criterios de aceptación | Solo rol permitido obtiene lista; total coincide; paginación y privacidad probadas. |

## BACK-020 — Administración: usuarios, métricas y moderación

| Campo | Especificación |
|---|---|
| Módulo / pantalla | `/admin`. |
| Estado actual | Solo CRUD de pueblos y permisos organizer/author; no hay router admin para users/métricas. |
| Prioridad | **P2**, antes de operar el producto a escala. |
| Endpoints | `GET /api/v1/admin/stats`; `GET /admin/users`; `PATCH /admin/users/{id}/status`; endpoints de reportes/moderación futuros. |
| Auth / rol | Bearer + admin validado en DB. |
| Query | date range, status, search, role, offset/limit. |
| Body status | `{ "status": "active|suspended", "reason": "..." }`. |
| Respuesta | Stats con periodo y definición; UserAdminSummary paginado; audit_event_id en mutaciones. |
| Errores | 401, 403, 404, 409 último admin/política, 422, 429. |
| Entidades/tablas | users + nuevas audit_logs/moderation_actions/reports. |
| Restricciones | Auditoría inmutable, mínimo privilegio, no exponer hashes/tokens, motivo obligatorio. |
| Efecto en contadores/perfil | Métricas globales reales; suspensión bloquea auth/acciones. |
| Efecto en notificaciones | Aviso de moderación según política. |
| Dependencias | Roles robustos, logging y política legal. |
| Mitigación frontend | Métricas ausentes como “Sin endpoint”; no usar `array.length` como total. |
| Criterios de aceptación | 403 usuario normal; audit trail; filtros/paginación; suspensión y reactivación probadas. |

## BACK-021 — Avisos, encuestas y adjuntos múltiples

| Campo | Especificación |
|---|---|
| Módulo / pantalla | Composer de comunidad. |
| Estado actual | Post solo tiene title/content/image_url; botones Aviso/Encuesta no tienen contrato. |
| Prioridad | **P3**; Foto puede adelantarse mediante BACK-011. |
| Diseño | Extender post con `type=post|notice|poll`, attachments y poll separado. |
| Endpoints | POST existente `/posts` con schema discriminado; `POST /posts/{id}/poll-votes`; GET resultados. |
| Auth / rol | Bearer; restricciones adicionales para avisos oficiales si aplica. |
| Body poll | `{type:"poll",content,options:[{text}],closes_at,allow_multiple:false}`. |
| Respuesta | Post público con `poll`, `viewer_vote_ids`, counts. |
| Errores | 401, 403 rol para aviso, 409 voto/cierre, 422, 429. |
| Entidades/tablas | post_attachments, polls, poll_options, poll_votes; unique voter/option según modo. |
| Restricciones | 2-10 opciones, cierre futuro, inmutabilidad de opciones con votos, timezone UTC. |
| Efecto en contadores | Votos independientes de likes/comments/shares. |
| Efecto en notificaciones | Opcional cierre/aviso oficial. |
| Dependencias | Uploads, notificaciones y moderación. |
| Mitigación frontend | Botones interceptados con mensaje pendiente. |
| Criterios de aceptación | Validación discriminada, voto idempotente, cierre, permisos de aviso y persistencia tras recarga. |

---

## Requisitos backend transversales antes de ampliar funcionalidad

### BACK-022 — Contratos OpenAPI y respuestas de interacción

- Registrar `HTTPBearer`/OAuth2 en OpenAPI.
- Marcar seguridad por operación y documentar 401/403/404/409.
- Aplicar los schemas ya existentes `FollowResponse`, `JoinResponse`, `SaveResponse` y `LikeResponse` como `response_model`.
- Elegir una única convención (`followed`, `joined`, `saved`, `liked`) y mantener aliases solo durante migración versionada.
- Incluir IDs afectados y counts actualizados cuando corresponda.
- Cuando Authorization esté presente pero sea inválido, devolver 401 en vez de degradar silenciosamente a público.

### BACK-023 — Paginación y totales

- Añadir metadata o una versión v2 sin romper consumidores del array actual.
- Permitir filtros personales dedicados en vez de descargar catálogos completos.
- Garantizar orden estable y pruebas de páginas concurrentes.
- No calcular stats mediante el tamaño de una página.

### BACK-024 — Seguridad de configuración y credenciales

- Retirar `.env` del versionado y rotar cualquier valor que haya estado expuesto.
- Bloquear arranque no-local con secreto default, corto o ausente.
- Separar seeds/test de producción mediante guard de entorno obligatorio.
- Eliminar credenciales administrativas deterministas de seeds.
- Validar el claim `sub` como UUID antes de consultar DB.
- Rechazar tokens de usuarios soft-deleted/suspendidos.
- Rate limit de auth y registro; normalización case-insensitive de email/username.

### BACK-025 — Integridad, concurrencia y fechas

- Evitar null en columnas NOT NULL mediante schemas de patch que distingan omisión de null.
- Capturar `IntegrityError`, ejecutar rollback y mapear a 409/422.
- Join con control transaccional de aforo; comprobar primero si el usuario ya participa.
- Like counts atómicos o derivados; evitar drift frente a `post_likes`.
- Enums/check constraints para status y valores no negativos.
- Validar `ends_at >= starts_at` y definir política para pasado/cancelled/draft.
- Migrar timestamps a UTC aware.

## Orden recomendado

1. **Inmediato:** BACK-024 y BACK-025; desactivar mock en el entorno real; documentar Bearer y respuestas (BACK-022).
2. **Siguiente sprint:** BACK-001 a BACK-007 y recuperación de contraseña.
3. **Después:** notificaciones, mensajes, uploads y administración.
4. **Medio plazo:** búsqueda global, followers de usuario y participantes.
5. **Evolución:** mapa, recomendaciones, encuestas y adjuntos avanzados.

## Criterio global de aceptación

Una funcionalidad pendiente solo puede marcarse terminada cuando:

1. Modelo, migración, schema, servicio y router existen.
2. OpenAPI declara auth, body, response y errores.
3. Hay tests unitarios, de integración y permisos.
4. Se prueba contra PostgreSQL QA con datos descartables.
5. Se verifica idempotencia/concurrencia cuando aplica.
6. El frontend elimina el estado “pendiente” y consume el endpoint sin mocks ni hardcodes.
7. La acción persiste, sobrevive recarga y se refleja en contadores/listados.
8. 401, 403, 404, 409, 422 y fallos de red producen mensajes visibles y comprensibles.
9. No se exponen secretos, credenciales ni información privada.
