# Checkpoint post-auditoría

Fecha de corte: **2026-07-20**  
Proyecto: **ConectaPueblos**

## Semáforo usado

| Estado | Significado |
|---|---|
| `VALIDADO RUNTIME` | Se ejecutó una comprobación reproducible con el resultado indicado. |
| `CONECTADO — CONTRATO` | Frontend y backend coinciden en método/URL/auth/payload/respuesta, sin mutación E2E. |
| `CORREGIDO — ESTÁTICO` | La corrección frontend está implementada y revisada; falta o puede faltar ejecución final. |
| `PENDIENTE QA` | Necesita navegador, credenciales o DB QA descartable. |
| `PENDIENTE BACKEND` | No existe soporte o la corrección corresponde al backend, que no se modificó. |
| `NO EJECUTADO` | No hay evidencia runtime y no debe interpretarse como aprobado. |

Este checkpoint distingue deliberadamente lectura segura de mutaciones. **No se ejecutaron mutaciones end-to-end ni se modificó PostgreSQL durante esta auditoría.**

## 1. Estado del frontend

**Estado: build, TypeScript y lint aprobados; QA de navegador pendiente.**

- Next.js 16.2.9, React 19.2.4, TypeScript 5 y Tailwind CSS 4.
- La integración REST se concentra en `lib/api/*`; no se detectaron fetch funcionales paralelos fuera del cliente común.
- Se corrigieron sesión, formularios, errores, reconciliación social, datos parciales y estados de funciones sin backend.
- Las rutas principales están presentes: `/`, `/login`, `/register`, `/community`, `/activities`, `/activities/[id]`, `/activities/create`, `/villages`, `/villages/[id]`, `/profile`, `/settings`, `/saved`, `/notifications`, `/messages`, `/explore`, `/admin` y `/dashboard`.
- El worktree frontend permanece deliberadamente con cambios sin commit del rediseño y de esta auditoría. No se hizo reset, commit, push ni deploy.
- TypeScript, lint, build y pruebas definitivas están registrados en los puntos 22–24.

## 2. Estado del backend

**Estado: disponible durante la comprobación final y protegido en solo lectura.**

- FastAPI expuso `/health`, `/api/v1/health`, `/api/v1/db-check`, `/docs` y `/openapi.json`.
- OpenAPI contiene 20 paths y 35 operaciones auditadas, incluyendo sistema, auth, users, villages, activities y posts.
- El estado Git backend anterior a la auditoría ya contenía `M .env`, `?? .env.backup` y `?? venv/`; la comprobación posterior conservó exactamente esos mismos elementos.
- No se editó ningún archivo backend, no se instaló ninguna dependencia allí, no se creó migración y no se alteró configuración.
- Riesgos abiertos: mock híbrido, seguridad de secretos/seeds, OpenAPI sin Bearer formal, tests vacíos y defectos de integridad/contrato descritos en BACK-022 a BACK-025.
- La disponibilidad del proceso debe comprobarse de nuevo al comenzar una sesión; el hecho de que respondiera durante la auditoría no garantiza que siga levantado.
- La primera comprobación confirmó que el proceso servía los UUID exactos de `app/mock_data/posts.py` con `USE_MOCK_DATA=true`. Con autorización posterior se cambió exclusivamente esa bandera a `false` y se reinició Uvicorn; el proceso actual devuelve tres posts `cccc…` desde PostgreSQL y 4 actividades.

## 3. Estado de PostgreSQL

**Estado: VALIDADO RUNTIME para conectividad y lectura; sin mutaciones de auditoría.**

- `/api/v1/db-check` respondió 200 y confirmó conexión.
- Revisión Alembic observada: `f1c3a8d9b120 (head)`.
- Lectura real con mocks desactivados: 3 pueblos, 4 actividades y 3 posts en el momento de la comprobación.
- No se crearon usuarios QA, posts, actividades, likes, follows, joins ni saves.
- No se ejecutaron DELETE ni cleanup; no se modificaron tablas, relaciones, seeds o datos.
- La instancia local preexistente en el puerto habitual tenía `USE_MOCK_DATA=true`; no debe utilizarse para afirmar persistencia porque combina GET mock con mutadores contra DB.

## 4. Estado de autenticación

**Estado: CONECTADO — CONTRATO / CORREGIDO — ESTÁTICO / PENDIENTE QA.**

- POST `/api/v1/auth/login` y GET `/api/v1/users/me` están conectados.
- GET `/api/v1/auth/me` se conserva como fallback solo ante 404/405 del endpoint principal.
- `AuthGate` verifica el token contra API antes de mostrar cualquier ruta protegida y valida el rol admin con el usuario real.
- Un 401 limpia sesión; un fallo de red conserva una salida recuperable y no se trata como permiso denegado.
- La landing de auth ya no redirige por la mera existencia de un token local.
- Logout actual elimina estado local; no revoca el JWT porque no existe endpoint backend.
- Login válido, expiración, persistencia tras recarga y logout no se probaron E2E con credenciales reales.

## 5. Estado de registro

**Estado: CONECTADO — CONTRATO / CORREGIDO — ESTÁTICO / PENDIENTE QA.**

- POST `/api/v1/auth/register` recibe `{name, username, email, password}`.
- Formulario: name 2–120, username 3–80 visible, email requerido/válido, password 8–128 y confirmación.
- Doble envío bloqueado y errores de campo/formulario visibles.
- Se mapearon duplicados de email/username a mensajes seguros.
- No se registró `qa_audit_<timestamp>`; 201, 409 y 422 de registro quedan pendientes de QA mutable.

## 6. Estado de comunidad

**Estado: GET VALIDADO RUNTIME; personalización y mutaciones PENDIENTE QA.**

- GET `/api/v1/posts?limit=100` consumió datos reales en la comprobación sin mocks.
- Posts, pueblos y actividades se cargan con `Promise.allSettled`; un fallo auxiliar no derriba todo el feed.
- Con sesión, el provider vuelve a consultar con bearer para hidratar flags personalizados.
- La búsqueda/orden/filtros actuales se aplican al máximo de 100 elementos cargados; no son paginación global.
- “Avisos” y “Actividades” siguen siendo clasificación textual, no tipos persistidos.
- Crear post dispara invalidación del feed/perfil, pero el POST y la persistencia tras recarga no se ejecutaron.

## 7. Estado de publicaciones

**Estado: listado VALIDADO RUNTIME; creación/interacciones CONECTADO — CONTRATO; PENDIENTE QA.**

- GET listado y filtros `author_id`/`village_id` existen y se usan donde corresponde.
- POST `/api/v1/posts` está conectado con título opcional, contenido, pueblo opcional, URL de imagen opcional y autor derivado del JWT.
- El frontend valida content >=2 y title vacío o 2–180.
- GET detalle se usa para rehidratar like/guardado de cards con IDs del backend; no hay deep link. PUT y DELETE no tienen consumidor UI efectivo y se documentan sin forzar su integración.
- El DELETE real devuelve 204; el cliente común ya tolera respuestas vacías.
- No se creó, editó ni eliminó ninguna publicación en QA.

## 8. Estado de Me gusta

**Estado: CONECTADO — CONTRATO / CORREGIDO — ESTÁTICO / PENDIENTE QA.**

- POST y DELETE `/api/v1/posts/{post_id}/like` están conectados.
- Optimismo con rollback, contador no negativo, bloqueo de doble acción y 401 visible.
- La UI reconcilia el estado `liked` y el contador exacto `likes_count` cuando backend lo devuelve.
- `getPostCapabilities` permite like/save para cualquier post persistente con UUID válido y bloquea únicamente demo confirmado o una entidad incompleta.
- Un 404 real ya no activa un bloqueo local ni reclasifica el post: revierte corazón/contador, muestra el mensaje acordado y registra datos seguros solo en desarrollo.
- La investigación Git determinó que `80b50ff` conectó el endpoint real y ningún commit posterior lo eliminó. La condición regresiva `interactionUnavailable` existía solo en el working tree sin commit sobre `cd983e0`; fue retirada.
- OpenAPI no tipa todavía esta respuesta; el adapter acepta aliases de transición.
- Like/unlike, concurrencia, contador tras recarga y persistencia no fueron ejecutados.
- Evidencia detallada: `docs/REGRESION_INTERACCIONES_SOCIALES.md`.

## 9. Estado de comentarios

**Estado: PENDIENTE BACKEND.**

- No existe tabla/router/endpoint de comentarios, aunque el post expone `comments_count`.
- El botón no incrementa contadores ni guarda en memoria; muestra un estado controlado.
- Contrato propuesto: GET/POST `/api/v1/posts/{post_id}/comments` y PATCH/DELETE `/api/v1/comments/{comment_id}`.
- Detalle y criterios de aceptación: BACK-007.

## 10. Estado de actividades

**Estado: listado VALIDADO RUNTIME; detalle/creación/join/save CONECTADO — CONTRATO; PENDIENTE QA.**

- GET `/api/v1/activities` devolvió 4 actividades reales en la comprobación; todas estaban en el pasado a la fecha de corte.
- `capacity` y `spots_left` están separados; la UI muestra aforo o plazas disponibles correctamente.
- Crear actividad reproduce longitudes, capacidad entera positiva, fecha futura, URL HTTP(S) de origen configurado y slug <=160.
- Si falla el catálogo de pueblos, el formulario no envía datos y muestra error de sección.
- Join/leave y save/unsave están conectados con optimismo, rollback y rehidratación en detalle.
- No se creó actividad ni se ejecutaron join/leave/save/unsave; aforo 409 y permisos quedan pendientes.

## 11. Estado de pueblos

**Estado: listado VALIDADO RUNTIME; detalle/follow CONECTADO — CONTRATO; PENDIENTE QA.**

- GET `/api/v1/villages` devolvió 3 pueblos reales en la comprobación.
- Detalle acepta UUID o slug y conserva la ficha aunque fallen posts/actividades relacionados.
- Follow/unfollow está conectado y el catálogo/detalle rehidratan `is_following` con bearer.
- Pueblo favorito permanece deshabilitado: el contrato lo acepta, pero backend lo descarta y no tiene columna.
- El mapa muestra estado pendiente; no hay coordenadas ni GeoJSON backend.
- Follow/unfollow y contador tras recarga no fueron ejecutados.

## 12. Estado de perfil

**Estado: CONECTADO — CONTRATO / CORREGIDO — ESTÁTICO; colecciones exactas PENDIENTE BACKEND.**

- El usuario se obtiene de `/users/me`; no se usa una cuenta demo funcional.
- Publicaciones propias usan `author_id` cuando existe UUID del usuario.
- Actividades inscritas y pueblos seguidos se derivan de flags dentro de catálogos de hasta 100 elementos.
- Fallos parciales muestran avisos por sección y conservan datos válidos.
- Edición usa PUT `/users/me` para name, username, avatar, banner y bio; email es read-only.
- Stats exactas, followed villages, joined/organized activities y saved collections requieren BACK-002 a BACK-006.
- PUT de perfil y persistencia tras una nueva sesión no fueron ejecutados.

## 13. Estado de notificaciones

**Estado: PENDIENTE BACKEND.**

- No existen endpoints de lista, unread count, read o read-all.
- La campana no muestra un badge inventado.
- `/notifications` presenta un estado controlado, sin notificaciones demo.
- Contrato completo propuesto en BACK-009.

## 14. Funciones conectadas

`CONECTADO` aquí significa que existe un consumidor UI y el contrato coincide; no implica que una mutación haya sido ejecutada.

| Módulo | Funciones conectadas |
|---|---|
| Auth | Registro, login, `/users/me`, fallback `/auth/me`, actualización de perfil, logout local. |
| Posts | Listar, crear, like/unlike, save/unsave, filtros por autor/pueblo. |
| Actividades | Listar, detalle, crear, join/leave, save/unsave, filtros de catálogo. |
| Pueblos | Listar, detalle, follow/unfollow, búsqueda y filtros de catálogo. |
| Perfil | Usuario actual, posts propios, flags de actividades/pueblos, update parcial. |
| Admin | Verificación de rol y catálogos existentes; no users/stats globales. |
| Sistema | Cliente API, health/OpenAPI mediante tooling, errores/loading/not-found globales. |

## 15. Funciones corregidas

1. Validación real del token en todas las rutas protegidas y rol admin.
2. Recuperación ante token inválido/caducado sin bucle desde login.
3. Limpieza de usuario anterior al guardar un token sin payload de usuario.
4. Username explícito y confirmación de contraseña en registro.
5. Mensaje contextual de credenciales incorrectas.
6. Base API única, timeout, `isTimeout`, abort y soporte de 204/body vacío en el cliente API.
7. Mapeo central de errores 400/401/403/404/409/422/429/500/red/timeout.
8. Validaciones backend-equivalentes en posts y actividades.
9. Invalidación de community/profile tras crear o mutar contenido social.
10. Reconciliación con `likes_count` y flags canónicos/aliases.
11. Separación `capacity` frente a `spots_left`.
12. Carga parcial con `Promise.allSettled` y errores por sección.
13. Categoría desconocida representada como `Otra`.
14. Pueblo favorito retirado del payload editable y explicado como pendiente.
15. Estados controlados de mensajes, notificaciones, guardados, mapa, uploads, comentarios, shares y recomendaciones.
16. Tabs de perfil con roles/teclado y mensajes asociados; controles con estados `aria-*` en flujos principales.
17. URLs dinámicas incompatibles con la política de imágenes de Next se descartan de forma segura; el avatar conserva iniciales si una imagen falla.
18. Build desacoplado de la descarga de `next/font/google`; Webpack se usa como opt-out soportado de Turbopack en el entorno restringido.
19. Clasificación central real/demo con prioridad para `data_source` futuro y registro temporal exclusivo de UUID de fixtures confirmados.
20. Eliminación del bloqueo/reclasificación implícita tras 404 en posts, actividades y pueblos.
21. Toast accesible y descartable para errores de acciones; mensajes exactos de sesión, permisos, 404, red, timeout y datos demo.

## 16. Funciones pendientes de backend

| Grupo | IDs | Funciones |
|---|---|---|
| Cuenta y colecciones P1 | BACK-001–007, BACK-012 | Favorito real, followed villages, actividades del usuario, saved posts/activities, stats, comentarios, reset password. |
| Social/operación P2 | BACK-008–015, BACK-018–020 | Shares, notificaciones, mensajes, upload, refresh/logout, OAuth, búsqueda, follow de usuarios, participantes, admin. |
| Evolución P3 | BACK-016, BACK-017, BACK-021 | Mapa, recomendaciones, avisos/encuestas/adjuntos. |
| Transversal P0/P1 | BACK-022–025 | OpenAPI/auth, paginación, secretos/seeds/rate limit, integridad/concurrencia/UTC. |

El detalle de body, respuesta, errores, entidades, dependencias y aceptación está en `FUNCIONALIDADES_PENDIENTES_BACKEND.md`.

## 17. Lista resumida de endpoints faltantes

Estas URLs son **propuestas** y no deben consumirse hasta existir en OpenAPI y QA.

| Prioridad | Método | URL propuesta o contrato a corregir |
|---|---|---|
| P1 | PUT existente | `/api/v1/users/me` — persistir `favorite_village_id` |
| P1 | GET | `/api/v1/users/me/followed-villages` |
| P1 | GET | `/api/v1/users/me/activities` |
| P1 | GET | `/api/v1/users/me/saved-posts` |
| P1 | GET | `/api/v1/users/me/saved-activities` |
| P1/P2 | GET | `/api/v1/users/{id_or_username}/stats` |
| P1 | GET, POST | `/api/v1/posts/{post_id}/comments` |
| P1 | PATCH, DELETE | `/api/v1/comments/{comment_id}` |
| P2 | POST | `/api/v1/posts/{post_id}/shares` |
| P2 | GET | `/api/v1/notifications` |
| P2 | GET | `/api/v1/notifications/unread-count` |
| P2 | PATCH | `/api/v1/notifications/{id}/read` |
| P2 | PATCH | `/api/v1/notifications/read-all` |
| P2 | GET, POST | `/api/v1/conversations` |
| P2 | GET, POST | `/api/v1/conversations/{id}/messages` |
| P2 | PATCH | `/api/v1/conversations/{id}/read` |
| P1/P2 | POST | `/api/v1/uploads/images` |
| P2 | DELETE | `/api/v1/uploads/{id}` |
| P1 | POST | `/api/v1/auth/password-reset/request` |
| P1 | POST | `/api/v1/auth/password-reset/confirm` |
| P2 | POST | `/api/v1/auth/refresh` |
| P2 | POST | `/api/v1/auth/logout` |
| P2 | GET | `/api/v1/auth/oauth/{provider}/start` |
| P2 | GET | `/api/v1/auth/oauth/{provider}/callback` |
| P2 | GET | `/api/v1/search` |
| P3 | GET | `/api/v1/villages/map` |
| P3 | GET | `/api/v1/users/me/recommendations` |
| P2/P3 | POST, DELETE | `/api/v1/users/{id_or_username}/follow` |
| P2/P3 | GET | `/api/v1/users/{id}/followers` y `/following` |
| P2 | GET | `/api/v1/activities/{id_or_slug}/participants` |
| P2 | GET | `/api/v1/admin/stats`, `/api/v1/admin/users` |
| P2 | PATCH | `/api/v1/admin/users/{id}/status` |
| P3 | POST | `/api/v1/posts/{id}/poll-votes` y extensión discriminada de POST `/posts` |

## 18. Observaciones pendientes

- Resolver antes de release: secretos/seeds, mock híbrido, Bearer/OpenAPI, integridad/concurrencia y tests backend.
- Los listados max 100 no proporcionan totales; perfil/admin pueden ser parciales.
- Los timestamps no incluyen zona horaria.
- Favorite village responde contractualmente pero no persiste.
- ID malformado en GET post puede provocar 500 backend.
- Join puede devolver 409 a un usuario ya inscrito cuando la actividad está llena.
- Ediciones con null en columnas obligatorias pueden provocar 500.
- Faltan colecciones de guardados/follows/joins aunque los mutadores existan.
- Detalle/update/delete de post y update/delete de actividad/pueblo existen pero carecen de UI efectiva y QA de permisos.
- Falta ejecutar navegador, teclado, axe y matriz responsive posterior a los últimos cambios.
- No hay scripts frontend `test` o `test:e2e`; deben añadirse antes de escalar el producto.
- Los logs técnicos encontrados están condicionados a desarrollo; mantener esa regla en nuevas integraciones.
- Manrope/Fraunces se solicitan en runtime con fallback local; autoalojarlas eliminaría la dependencia externa y facilitaría una CSP estricta.

## 19. Comandos de ejecución

### Frontend

```bash
npm install
npm run dev
npx tsc --noEmit
npm run lint
npm run build
npm start
```

Para una instalación CI sobre lockfile limpio se puede usar `npm ci`; en un worktree con cambios de dependencias, confirmar primero que `package.json` y `package-lock.json` están sincronizados.

### Backend local

Ejecutar desde el repositorio backend, con su entorno virtual ya preparado:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Smoke backend de solo lectura funcional

```bash
npm run smoke:backend -- --base-url http://127.0.0.1:8000
```

El modo por defecto comprueba health, OpenAPI, listados, validación 422, token inválido y credenciales inexistentes. No crea recursos. Aun así, debe apuntar a local/QA, no usarse como monitor de producción.

### Smoke mutable — solo con autorización posterior

```bash
QA_ALLOW_MUTATIONS=true npm run smoke:backend -- --base-url http://127.0.0.1:8000 --mutations
```

Advertencia: este modo crea un usuario, post y actividad QA, ejecuta relaciones y hace soft-delete de los recursos que puede limpiar. El backend no ofrece delete de usuario, por lo que **deja datos QA** y requiere una DB local descartable/reset posterior. Está bloqueado para hosts no loopback. **No fue ejecutado en esta auditoría y nunca debe ejecutarse contra producción.**

## 20. Variables necesarias

No incluir valores secretos en documentación, terminal compartida o capturas.

| Capa | Variable | Uso / ejemplo seguro |
|---|---|---|
| Frontend | `NEXT_PUBLIC_API_BASE_URL` | Preferida. Local: `http://127.0.0.1:8000`. Es pública por diseño. |
| Backend | `DATABASE_URL` | Secreta. PostgreSQL del entorno correspondiente; no documentar valor. |
| Backend | `JWT_SECRET_KEY` | Secreta y fuerte; no usar fallback/default ni versionarla. |
| Backend | `JWT_ALGORITHM` | Algoritmo permitido explícitamente. |
| Backend | `ACCESS_TOKEN_EXPIRE_MINUTES` | Política de expiración. |
| Backend | `USE_MOCK_DATA` | Debe ser `false` para QA real y producción; mocks solo en entorno aislado. |
| Tooling QA | `QA_ALLOW_MUTATIONS` | Guard explícito del smoke mutable; usar solo `true` con DB local descartable. |

Los orígenes CORS deben configurarse mediante la variable real definida por el backend; no se inventa aquí un nombre de variable no confirmado.

## 21. Archivos modificados

El worktree ya contenía la reforma visual y se preservó completo. La auditoría/corrección frontend abarca:

- Rutas: `app/page.tsx`, auth, community, activities, villages, profile, settings, saved, messages, notifications, explore, admin, estados globales `error/loading/not-found` y estilos globales.
- Layout y navegación: `components/layout/*`, incluida la entrada desktop de mensajes junto a notificaciones y sus variantes responsive.
- Social/UI: `components/social/*`, `components/ui/*`; se sustituyó el hook local persistente por `use-keyed-optimistic-boolean.ts` y se creó `app-toast.tsx`.
- Features: módulos de auth, community, activities, villages, profile, notifications y admin.
- Integración: `lib/api/client.ts`, `auth.service.ts`, `community.service.ts`, `activities.service.ts`, `villages.service.ts`, `session.ts`, `entity-capabilities.ts`, `error-message.ts`, `image-url.ts` y `lib/types.ts`.
- Configuración/tooling frontend: `next.config.ts`, `package.json`, `package-lock.json`, `scripts/smoke-backend.mjs` y assets editoriales bajo `public/images/`.
- Documentación: índice, contratos frontend existentes y todos los informes de auditoría, matrices, pendientes backend, endpoints sin uso, roadmap, checkpoints e informe de regresión bajo `docs/`.
- Retirados: `components/social/use-local-storage-boolean.ts` y `features/auth/auth-icons.tsx`, sustituidos por implementaciones actuales.

No se incluye ningún archivo del repositorio backend: sus cambios preexistentes se conservaron sin edición.

## 22. Pruebas ejecutadas

| Prueba | Resultado | Tipo de evidencia |
|---|---|---|
| GET `/health` | 200 durante auditoría | RUNTIME seguro |
| GET `/api/v1/health` | 200 durante auditoría | RUNTIME seguro |
| GET `/api/v1/db-check` | 200, PostgreSQL conectado | RUNTIME seguro |
| GET `/openapi.json` | 200, 20 paths / 35 operaciones | RUNTIME seguro |
| GET villages/activities/posts con mocks desactivados | 3 / 4 / 3 | RUNTIME-REAL seguro |
| GET de la instancia preexistente con mocks activos | 200 | RUNTIME-MOCK; no valida persistencia |
| Revisión de routers/schemas/modelos/permisos | Completada sin cambios | ESTÁTICO-BE |
| Contraste de servicios/adapters/UI | Completado | ESTÁTICO-FE / CONTRATO |
| `npx tsc --noEmit` intermedio | OK en una revisión focal; debe repetirse al final | Ejecución frontend intermedia |
| `git diff --check` intermedio | OK en una revisión focal; debe repetirse al final | Ejecución frontend intermedia |
| `npm install` | OK; dependencias ya estaban al día | Ejecución frontend final |
| `npx tsc --noEmit` final | OK | Ejecución frontend final |
| `npm run lint -- --max-warnings=0` final | OK, 0 errores y 0 warnings | Ejecución frontend final |
| `npm run build` final | OK con `next build --webpack`; 18 páginas generadas, TypeScript incluido | Build de producción reproducible sin descarga de fuentes |
| `node --check scripts/smoke-backend.mjs` | OK | Sintaxis del smoke reproducible |
| `git diff --check` final | OK | Integridad de parches |
| Cliente API aislado: URL, Bearer, 204, 422, red y timeout | PASS 7/7 | Runtime aislado, sin backend ni DB |
| Capabilities: demo, real, metadata explícita e ID incompleto | PASS 4/4 | Runtime aislado, sin backend ni DB |
| Capability con ID PostgreSQL real `cccc…` | PASS | El formato canónico aceptado por FastAPI permite like/save sin confundirlo con fixtures |
| `npm run smoke:backend -- --base-url http://127.0.0.1:8000` final | 8 PASS / 0 FAIL / 1 SKIP | Health, OpenAPI, tres catálogos, validación 422, token inválido 401 y credenciales incorrectas 401 aprobados |
| Identidad del feed antes/después | `777…`/`888…`/`999…` → tres IDs `cccc…` | Confirma el cambio de fixtures mock a consultas PostgreSQL tras `USE_MOCK_DATA=false` |
| `npm run dev` | No pudo escuchar en `0.0.0.0:3000`: sandbox devolvió EPERM | Limitación del entorno; no contradice el build |
| Registro/login válido/creación/interacciones | **NO EJECUTADO** | Requiere DB QA mutable |
| Browser E2E, matriz responsive y axe | **NO EJECUTADO** | PENDIENTE QA |
| Tests backend | **NO EJECUTADO / no disponibles** | Archivo test vacío; pytest no declarado |
| Tests frontend | **NO EJECUTADO / scripts no disponibles** | No hay `test`/`test:e2e` en package.json |

> **RESULTADO_SMOKE READ-ONLY FINAL: 8 PASS / 0 FAIL / 1 SKIP.** La API respondió en `127.0.0.1:8000` después del reinicio. Los tres posts actuales ya no son los fixtures conocidos y las actividades pasaron de 3 a 4, confirmando lectura PostgreSQL. El único caso omitido corresponde a mutaciones, desactivadas deliberadamente.

> **RESULTADO_SMOKE_MUTABLE: NO EJECUTADO — requiere autorización y DB local descartable**

No se afirma persistencia, recarga, ownership ni actualización de contadores sin estas pruebas.

## 23. Resultado de lint

> **RESULTADO_LINT: OK (2026-07-20).** `npm run lint -- --max-warnings=0` terminó con código 0, sin errores ni warnings. `npx tsc --noEmit` también terminó con código 0.

## 24. Resultado de build

> **RESULTADO_BUILD: OK (2026-07-20).** `npm run build` (`next build --webpack`) con Next.js 16.2.9 compiló, ejecutó TypeScript y generó las 18 rutas sin errores. Webpack es el opt-out documentado por Next 16; se eligió porque Turbopack intenta abrir un puerto auxiliar bloqueado por este sandbox.

## 25. Próximos pasos

1. Ejecutar el smoke read-only desde un entorno que permita red local, contra un backend homogéneo con `USE_MOCK_DATA=false`, y anexar su salida.
2. Ejecutar navegación manual en 375, 430, 768, 1024, 1280 y 1440 px, teclado y axe en auth/community/activities/villages/profile/estados pendientes.
3. Crear un entorno QA descartable y obtener autorización específica antes de cualquier smoke mutable.
4. En backend, priorizar BACK-024, BACK-025 y BACK-022; después colecciones BACK-001–007 y reset password.
5. Tras implementar backend, ejecutar el smoke mutable, verificar persistencia tras recarga y actualizar `MATRIZ_INTEGRACION_FULLSTACK.md` fila por fila.

Próximo paso concreto: **recargar `/community` y comprobar visualmente que utiliza el feed PostgreSQL. Para ejecutar create post → like → recarga → unlike → recarga sigue haciendo falta autorización expresa para mutar esa PostgreSQL.**
