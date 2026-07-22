# Matriz de integración full-stack

## Metadatos de la auditoría

- Proyecto: **ConectaPueblos**.
- Fecha de corte: **2026-07-20**.
- Frontend auditado: Next.js 16, React 19 y TypeScript, en este repositorio.
- Backend auditado en modo estrictamente de solo lectura: FastAPI, SQLAlchemy, PostgreSQL y JWT.
- Regla aplicada: no se modificaron código, configuración, migraciones ni datos backend.
- Operaciones runtime permitidas: `GET`/`HEAD` sobre health, OpenAPI y listados; consulta de la revisión Alembic.
- Operaciones runtime no ejecutadas: registro, login con credenciales, creación, edición, borrado e interacciones. Su integración se clasifica mediante inspección del frontend, routers, schemas, servicios y OpenAPI, no como prueba end-to-end.

## Niveles de evidencia

| Nivel | Significado |
|---|---|
| RUNTIME-REAL | Petición GET ejecutada con `USE_MOCK_DATA=false` contra PostgreSQL local. |
| RUNTIME-MOCK | Petición GET ejecutada con `USE_MOCK_DATA=true`. Sirve para validar forma y routing, no persistencia. |
| CONTRATO | Coincidencia comprobada entre servicio TypeScript, router FastAPI, schema Pydantic y OpenAPI. |
| CÓDIGO | Flujo revisado estáticamente, sin ejecutar la mutación. |
| NO PROBADO | No existe evidencia runtime suficiente para afirmar que el flujo persiste o actualiza correctamente. |

## Estados de integración

| Estado | Criterio |
|---|---|
| CONECTADO Y VALIDADO | Existe servicio y UI y se probó una operación segura contra el backend real. |
| CONECTADO SIN VALIDAR | Servicio, método, URL, token y contrato coinciden, pero no se ejecutó la operación completa. |
| CONECTADO CON LIMITACIÓN | Funciona dentro del contrato actual, pero falta paginación, colección o dato backend para ser completo. |
| CONECTADO CON ERROR | La UI llama al backend, pero el contrato backend no persiste o puede responder incorrectamente. |
| FRONTEND SIN CONECTAR | Existe endpoint backend, pero no hay consumo efectivo desde una pantalla. |
| ENDPOINT BACKEND SIN USO | Endpoint real deliberadamente no usado o sin caso de UI actual. |
| FALTA BACKEND | La experiencia existe o está prevista en frontend, pero no existe endpoint/persistencia. |
| MOCK | La respuesta procede de `app/mock_data` y no de PostgreSQL. |
| NO IMPLEMENTADO | No existe una implementación funcional en ninguna capa. |
| NO APLICA | La acción es exclusivamente cliente u operativa. |

## Advertencias transversales

1. El `.env` backend local estaba modificado antes de esta auditoría y tenía `USE_MOCK_DATA=true`; el `HEAD` del repositorio tenía `false`. No se modificó. Con mocks activos, los GET devuelven entidades mock, pero follow/join/save/like continúan escribiendo contra PostgreSQL. Los identificadores pueden no coincidir.
2. Los listados backend son arrays sin `total`, `next`, `has_more` ni cursor. El frontend solicita hasta 100 elementos, que es el máximo backend; no debe tratar `array.length` como total global.
3. Los endpoints públicos aceptan Authorization opcional. Un Bearer inválido fue probado y devolvió 200 público con flags personalizados falsos. La sesión debe validarse con `/api/v1/users/me`.
4. OpenAPI no declara `securitySchemes`; Authorization aparece opcional incluso en endpoints protegidos. Las respuestas de interacciones tampoco tienen schema OpenAPI.
5. Los timestamps backend no incluyen zona horaria. El frontend debe evitar asumir que contienen UTC hasta que el contrato se corrija.
6. Las mutaciones sociales reales retornan `followed`, `joined`, `saved`, `liked` y, para like, `likes_count`. Los adapters aceptan también aliases `is_*` para tolerancia.

## Matriz principal

| Módulo | Pantalla / componente | Acción | Servicio frontend | Método | Endpoint backend | Token / rol | Payload / params | Respuesta usada | Estado | Evidencia y observación |
|---|---|---|---|---|---|---|---|---|---|---|
| Sistema | App global | Configurar base API | `apiFetch` | — | `NEXT_PUBLIC_API_BASE_URL` + ruta | No | `RequestInit`, timeout | JSON tipado | CONECTADO Y VALIDADO | Es la única variable consumida; todas las llamadas pasan por `lib/api/client.ts`. |
| Sistema | Error/loading global | Mostrar fallo o carga | `app/error.tsx`, `app/loading.tsx` | — | — | No | Error React | Estado visual | NO APLICA | Mitigación frontend; no sustituye observabilidad backend. |
| Auth | `/register` | Registrar usuario | `registerUser` | POST | `/api/v1/auth/register` | Público | `{name,username,email,password}` | `{access_token,token_type,user}` | CONECTADO SIN VALIDAR | CONTRATO/CÓDIGO. No se hizo POST para no crear datos. Backend: name 2-120, username 3-80, password 8-128. |
| Auth | `/login` | Iniciar sesión | `loginUser` | POST | `/api/v1/auth/login` | Público | `{email,password}` | Token + usuario | CONECTADO SIN VALIDAR | CONTRATO/CÓDIGO. 401 de credenciales se trata contextualmente en frontend; no se probaron credenciales reales. |
| Auth | Landing, `AuthGate`, perfil y ajustes | Validar sesión | `getCurrentUser` | GET | `/api/v1/users/me` | Bearer / usuario | Header Authorization | `UserMeResponse` adaptado | CONECTADO SIN VALIDAR | El fallback a `/auth/me` se usa solo ante 404/405. Se limpia sesión ante 401 en vistas protegidas. |
| Auth | Mismos consumidores | Fallback de sesión | `getCurrentUser` | GET | `/api/v1/auth/me` | Bearer / usuario | Header Authorization | `UserMeResponse` | CONECTADO SIN VALIDAR | Endpoint duplicado pero utilizado como compatibilidad. |
| Auth | Menú de usuario | Logout local | `clearSession` | — | No existe logout backend | Cliente | Borra `conecta_token` y `conecta_user` | Evento de sesión | NO APLICA / FALTA BACKEND FUTURO | Funciona como cierre local. No revoca JWT ni refresh token porque el backend no los ofrece. |
| Auth | Login | Recuperar contraseña | No hay servicio | — | No existe | — | — | — | FALTA BACKEND | La UI no debe simular envío. Contrato en `FUNCIONALIDADES_PENDIENTES_BACKEND.md`. |
| Auth | Login/register | OAuth Google/Apple | No hay servicio | — | No existe | — | — | — | FALTA BACKEND | No hay provider, callback, state ni PKCE backend. |
| Comunidad | `/community` | Cargar feed | `getCommunityPostsStrict` | GET | `/api/v1/posts?limit=100` | Opcional | `limit`, opcional `author_id`/`village_id` | `CommunityPost[]` | CONECTADO Y VALIDADO | RUNTIME-REAL: 200 y 3 posts. RUNTIME-MOCK: 200. El provider cliente rehidrata con bearer. Sin metadata de paginación. |
| Comunidad | `SocialPostActions` en muro de pueblo | Rehidratar estado de un post | `getCommunityPostByIdStrict` | GET | `/api/v1/posts/{post_id}` | Bearer opcional | UUID backend en path | `CommunityPost` | CONECTADO SIN VALIDAR | Se usa para confirmar like/guardado en cards renderizadas inicialmente sin bearer. No existe una ruta independiente `/posts/[id]`; un futuro input libre debe validar UUID porque un ID malformado puede provocar 500 backend. |
| Comunidad | `PostComposer` | Crear publicación | `createCommunityPost` | POST | `/api/v1/posts` | Bearer / usuario | `{title|null,content,village_id|null,image_url|null}` | Post base | CONECTADO SIN VALIDAR | CÓDIGO/CONTRATO. Autor se deriva del token. UI valida content >=2, title <=180 e imagen opcional renderizable; no se hizo POST. |
| Comunidad | `SocialPostActions` | Dar/quitar me gusta | `likePost` / `unlikePost` | POST / DELETE | `/api/v1/posts/{id}/like` | Bearer / usuario | UUID path | `{liked,likes_count?,message}` | CONECTADO SIN VALIDAR | REGRESIÓN CORREGIDA por código: solo demo confirmado se bloquea; 404 real revierte sin reclasificar; doble clic bloqueado y respuesta reconciliada. OpenAPI no documenta el body real y no se mutó DB. Informe: `REGRESION_INTERACCIONES_SOCIALES.md`. |
| Comunidad | `SocialPostActions` | Guardar/quitar guardado | `savePost` / `unsavePost` | POST / DELETE | `/api/v1/posts/{id}/save` | Bearer / usuario | UUID path | `{saved,message}` | CONECTADO SIN VALIDAR | La mutación existe; no hay endpoint para recuperar la colección guardada. |
| Comunidad | `SocialPostActions` | Comentar | Sin servicio | — | No existe | — | — | — | FALTA BACKEND | Se evita incrementar `comments_count` localmente. |
| Comunidad | `SocialPostActions` | Compartir | Sin servicio | — | No existe | — | — | — | FALTA BACKEND | `shares_count` existe en el modelo, pero no hay tabla/acción REST. |
| Comunidad | `PostComposer` | Foto/vídeo | Sin servicio upload | — | No existe | — | Multipart requerido | — | FALTA BACKEND | La UI informa estado pendiente; el post actual solo admite una URL de imagen. |
| Comunidad | `PostComposer` | Aviso / encuesta | Sin servicio | — | No existe | — | Tipo de post/poll requerido | — | FALTA BACKEND | No hay columnas, schemas ni endpoints para tipos de contenido. |
| Comunidad | — | Editar post | Sin servicio/UI | PUT | `/api/v1/posts/{post_id}` | Bearer / autor o admin | `CommunityPostUpdate` parcial | Post base | FRONTEND SIN CONECTAR | Endpoint real. El frontend debe omitir null para title/content por riesgo de 500 backend. |
| Comunidad | — | Eliminar post | Sin servicio/UI | DELETE | `/api/v1/posts/{post_id}` | Bearer / autor o admin | UUID path | 204 vacío | FRONTEND SIN CONECTAR | Requiere confirmación destructiva, feedback y retirada del feed. |
| Pueblos | `/villages` | Listar pueblos | `getVillagesStrict` | GET | `/api/v1/villages?limit=100` | Opcional | Backend soporta search/province/region/offset/skip/limit | `Village[]` | CONECTADO Y VALIDADO | RUNTIME-REAL: 200 y 3 pueblos. Filtros visuales actuales son parcialmente cliente. |
| Pueblos | `/villages/[id]` | Abrir detalle | `getVillageByIdStrict` | GET | `/api/v1/villages/{id_or_slug}` | Opcional | UUID o slug | `Village` enriquecido | CONECTADO SIN VALIDAR | CÓDIGO/CONTRATO. El detalle conserva entidad principal si fallan posts/activities auxiliares. |
| Pueblos | Detalle y cards | Seguir/dejar de seguir | `followVillage` / `unfollowVillage` | POST / DELETE | `/api/v1/villages/{id_or_slug}/follow` | Bearer / usuario | UUID o slug | `{followed,message}` | CONECTADO SIN VALIDAR | Estado optimista se reconcilia y el detalle puede hidratar flags con bearer. No se mutó DB. |
| Pueblos | Perfil | Mostrar pueblos seguidos | `getVillagesStrict` + filtro `isFollowing` | GET | `/api/v1/villages?limit=100` | Bearer opcional | Primera colección, sin filtro follow | Array completo | CONECTADO CON LIMITACIÓN | No existe colección dedicada ni total. Correcto solo mientras todos los pueblos quepan en 100 y flags sean canónicos. |
| Pueblos | Ajustes | Pueblo favorito | Sin mutación frontend | PUT existente defectuoso | `/api/v1/users/me` | Bearer / usuario | El frontend no envía `favorite_village_id` | Aviso controlado | FALTA BACKEND | El schema lo acepta, pero el router descarta el campo y el modelo no tiene columna. La edición está retirada para no mostrar éxito ficticio. |
| Pueblos | Explorer | Ver mapa | Sin servicio | — | No existe geolocalización/mapa | — | bbox/lat/lng requeridos | — | FALTA BACKEND | `BackendPendingAlert` evita fingir un mapa funcional. |
| Pueblos | Admin | Crear pueblo | `createVillage` | POST | `/api/v1/villages` | Bearer / admin | `VillageCreate` | 201 Village | FRONTEND SIN CONECTAR | El servicio existe, pero ninguna pantalla lo invoca. |
| Pueblos | Admin | Editar/eliminar pueblo | Sin servicio/UI | PUT / DELETE | `/api/v1/villages/{id_or_slug}` | Bearer / admin | `VillageUpdate` / path | 200 / 204 | FRONTEND SIN CONECTAR | Requiere UI administrativa y protección; null en campos obligatorios puede causar 500. |
| Actividades | `/activities` | Listar actividades | `getActivitiesStrict` | GET | `/api/v1/activities?limit=100` | Opcional | Backend soporta search/category/village/date/status/offset/limit | `Activity[]` | CONECTADO Y VALIDADO | RUNTIME-REAL: 200 y 4 actividades; todas estaban pasadas en la fecha de auditoría. `date_from` real devolvió 0. |
| Actividades | `/activities/[id]` | Abrir detalle | `getActivityByIdStrict` | GET | `/api/v1/activities/{id_or_slug}` | Opcional | UUID o slug | Activity enriquecida | CONECTADO SIN VALIDAR | CÓDIGO/CONTRATO; fallo auxiliar del pueblo no derriba la entidad principal. |
| Actividades | `/activities/create` | Crear actividad | `createActivity` | POST | `/api/v1/activities` | Bearer / usuario | slug,title,description,village_id,category,image_url,starts_at,ends_at,capacity,location,status | 201 Activity base | CONECTADO SIN VALIDAR | Validaciones frontend alineadas en campos principales; backend no valida status enum ni relación temporal. No se hizo POST. |
| Actividades | Cards/detalle | Apuntarse/abandonar | `joinActivity` / `leaveActivity` | POST / DELETE | `/api/v1/activities/{id_or_slug}/join` | Bearer / usuario | UUID o slug | `{joined,message}` | CONECTADO SIN VALIDAR | Backend puede devolver 409 por aforo. No se probó persistencia ni recarga. |
| Actividades | Cards/detalle | Guardar/quitar guardado | `saveActivity` / `unsaveActivity` | POST / DELETE | `/api/v1/activities/{id_or_slug}/save` | Bearer / usuario | UUID o slug | `{saved,message}` | CONECTADO SIN VALIDAR | Mutador real, colección de guardados inexistente. |
| Actividades | Perfil | Mostrar inscritas | `getActivitiesStrict` + filtro `isJoined` | GET | `/api/v1/activities?limit=100` | Bearer opcional | Primera colección | Array completo | CONECTADO CON LIMITACIÓN | No existe `users/me/activities`; puede omitir inscritas fuera de la primera colección y mezcla catálogo con relación personal. |
| Actividades | — | Editar/eliminar actividad | Sin servicio/UI | PUT / DELETE | `/api/v1/activities/{id_or_slug}` | Bearer / organizador o admin | `ActivityUpdate` / path | 200 / 204 | FRONTEND SIN CONECTAR | Endpoint real; requiere ownership, confirmación y manejo de 403/409. |
| Perfil | `/profile` | Mostrar usuario real | `getCurrentUser` | GET | `/api/v1/users/me` | Bearer | — | Usuario autenticado | CONECTADO SIN VALIDAR | No usa un usuario demo silencioso. Ante fallo no-401 puede mostrar el usuario guardado en sesión con aviso. |
| Perfil | `/profile` | Publicaciones propias | `getCommunityPostsStrict` | GET | `/api/v1/posts?author_id={uuid}&limit=100` | Opcional | author_id UUID | Array posts | CONECTADO CON LIMITACIÓN | El filtro backend existe; falta total/paginación completa. |
| Perfil | `/profile` | Estadísticas | Derivadas de arrays | GET | No existe endpoint stats | Bearer para flags | — | Longitudes parciales | FALTA BACKEND | La UI muestra valores derivados o `—`; no deben considerarse métricas globales. |
| Perfil | `/settings` | Editar name/username/avatar/banner/bio | `updateCurrentUser` | PUT | `/api/v1/users/me` | Bearer / usuario | Solo campos definidos; omitir no modificados | Usuario actualizado | CONECTADO SIN VALIDAR | CÓDIGO/CONTRATO. Nunca enviar null para name/username. 409 username repetido. |
| Perfil público | No hay ruta específica | Consultar usuario por UUID/username | Sin servicio | GET | `/api/v1/users/{id_or_username}` | Público | path | `UserResponse` | ENDPOINT BACKEND SIN USO | Requiere decisión de privacidad: el response incluye role y favorite_village_id. |
| Guardados | `/saved` | Listar guardados | Sin servicio | GET | No existe colección | Bearer | offset/limit/type requeridos | — | FALTA BACKEND | La pantalla muestra un estado pendiente explícito; los mutadores sí existen. |
| Notificaciones | Bell y `/notifications` | Listar/no leídas/marcar | Sin servicio | — | No existen endpoints | Bearer | filtros/cursor requeridos | — | FALTA BACKEND | No se muestran avisos inventados ni badge ficticio. |
| Mensajes | `/messages` | Conversaciones y mensajes | Sin servicio | — | No existen endpoints | Bearer / participante | conversación, contenido, cursor | — | FALTA BACKEND | Vista controlada y accesible desde navegación; sin chat falso. |
| Explorar | `/explore` | Búsqueda/recomendaciones globales | Sin servicio global | — | No existe | Según alcance | q/types/limit | — | FALTA BACKEND | CTA redirige a listados reales. |
| Recomendaciones | Rails y detalle | Personalizar contenido | Sin servicio | — | No existe | Bearer | tipo/contexto/limit | — | FALTA BACKEND | Las secciones que usan catálogos reales se etiquetan como exploración, no como recomendación persistida. |
| Administración | `/admin` + `AuthGate` | Validar admin | `getCurrentUser` | GET | `/api/v1/users/me` | Bearer / role admin | — | Usuario con role | CONECTADO SIN VALIDAR | El rol se verifica contra API, no solo localStorage. |
| Administración | `/admin` | Ver catálogos | `getVillagesStrict`, `getActivitiesStrict` | GET | villages / activities | Bearer opcional | limit=100 | Arrays | CONECTADO CON LIMITACIÓN | Los tamaños son tamaño de colección cargada, no métricas globales. |
| Administración | `/admin` | Usuarios e inscripciones globales | Sin servicio | — | No existen endpoints admin | Bearer / admin | filtros/paginación | — | FALTA BACKEND | Las métricas aparecen como “Sin endpoint disponible”. |

## Matriz de errores y mitigación frontend

| Condición backend | Evidencia backend | Tratamiento frontend requerido | Estado |
|---|---|---|---|
| API apagada / fallo de red | `apiFetch` no obtiene respuesta | Error de sección con retry; conservar datos válidos de otras secciones | IMPLEMENTADO EN FLUJOS PRINCIPALES |
| Timeout | Cliente aplica timeout | Mensaje “La solicitud tardó demasiado” mediante adapter | IMPLEMENTADO |
| 401 en login | `detail: Invalid email or password` | Mensaje inline de credenciales; no “sesión caducada” | IMPLEMENTADO |
| 401 en petición autenticada | Token ausente/inválido/caducado | Limpiar sesión, CTA de login, no bucle de redirección | IMPLEMENTADO EN GATES/PERFIL/AJUSTES/ADMIN |
| Bearer inválido en listado opcional | Runtime devolvió 200 público | Validar sesión aparte; no asumir que flags false equivalen a estado real | IMPLEMENTADO MEDIANTE REHIDRATACIÓN + `/me` |
| 403 | Permiso/rol/ownership | Mensaje de acceso denegado; no reintentar como error de red | PARCIAL; depende de activar UIs de edición |
| 404 detalle | Recurso inexistente | `notFound()` y página 404; fallo auxiliar como error de sección | IMPLEMENTADO EN DETALLES PRINCIPALES |
| 404 en interacción de entidad real | Recurso inexistente o incoherencia de entorno | Rollback, toast contextual y log seguro en desarrollo; nunca reclasificar como demo | IMPLEMENTADO EN POSTS; MISMA POLÍTICA EN ACTIVIDADES/PUEBLOS |
| 409 | Duplicado, aforo o slug | Mensaje específico junto a la acción/formulario | IMPLEMENTADO EN ADAPTER GENÉRICO; VALIDACIÓN E2E PENDIENTE |
| 422 | Pydantic | Asociar error a formulario; bloquear doble submit | IMPLEMENTADO EN FORMULARIOS PRINCIPALES |
| 500 | DB/null/UUID malformado | Mensaje estable, retry cuando sea seguro; nunca exponer stack | MITIGADO; corrección raíz requiere backend |
| Respuesta vacía | Array `[]` real | Empty state y CTA; no insertar mocks | IMPLEMENTADO |
| Función sin endpoint | OpenAPI/código sin ruta | `BackendPendingAlert`, botón interceptado o deshabilitado | IMPLEMENTADO EN MAPA, GUARDADOS, NOTIFICACIONES, MENSAJES Y EXPLORAR |

## Validaciones y restricciones que el frontend debe conservar

- Registro: name 2-120, username 3-80, email válido, password 8-128.
- Login: email válido; password no vacía y máximo 128.
- Post: content mínimo 2; title vacío o 2-180; village_id UUID o null; image_url opcional de origen configurado; no enviar author_id.
- Actividad: slug 2-160; title 2-180; description mínimo 10; village_id UUID; category 2-80; capacity >=1; location 2-255; no enviar organizer_id.
- Ajustes: name/username deben omitirse si no se actualizan y nunca enviarse como null.
- IDs de posts: validar UUID antes de detalle o mutación.
- Acciones autenticadas: bloquear doble envío, exigir token y reconciliar con respuesta backend.
- Fechas: serializar ISO; no afirmar zona horaria hasta que el backend la incluya.
- Paginación: respetar limit <=100 y no derivar totales globales de una sola página.

## QA pendiente para cambiar estados a “validado”

Se necesita un entorno QA descartable, nunca producción, y autorización para mutar datos. Casos mínimos:

1. Registrar `qa_audit_<timestamp>` y verificar 201, duplicados 409 y validaciones 422.
2. Login válido/inválido, `/users/me`, recarga, expiración y logout.
3. Crear post con/sin título y con/sin pueblo; verificar autor y persistencia tras recarga.
4. Like/unlike y save/unsave; comprobar contadores y estado tras GET autenticado.
5. Crear actividad; verificar organizer_id, fechas, aforo y pueblo.
6. Join/leave y save/unsave; comprobar 409 por aforo y persistencia.
7. Follow/unfollow pueblo; comprobar contador y flag autenticado.
8. Update/delete de post y actividad como propietario, tercero y admin.
9. CRUD de pueblos como usuario normal y admin.
10. Confirmar que `favorite_village_id` falla o no persiste hasta que backend lo implemente; la UI debe permanecer controlada.

## Criterio de cierre

Una fila solo puede pasar a `CONECTADO Y VALIDADO` cuando exista una prueba reproducible que confirme método, URL, auth, rol, payload, status, respuesta, persistencia, recarga y mensaje visible de error. La existencia de un botón, servicio TypeScript, endpoint u OpenAPI no basta.
