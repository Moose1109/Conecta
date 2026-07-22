# Auditoría full-stack de ConectaPueblos

## Alcance, fecha y regla de protección

- Corte de la auditoría: **2026-07-20**.
- Frontend: Next.js 16, React 19 y TypeScript, con cambios permitidos únicamente en este repositorio.
- Backend: FastAPI, SQLAlchemy, Pydantic, Alembic y PostgreSQL, inspeccionado y probado en modo **estrictamente de solo lectura**.
- No se modificaron código Python, configuración, `.env`, migraciones, schemas, modelos, tablas ni datos backend.
- No se hicieron commit, push ni despliegue.
- Las mutaciones de registro, login, posts, actividades, follows, joins, likes y guardados **no se ejecutaron**. Su compatibilidad se verificó por contrato y código, pero no se presenta como validación end-to-end.

## Cómo leer la evidencia

| Etiqueta | Alcance real |
|---|---|
| `RUNTIME-REAL` | GET seguro ejecutado con `USE_MOCK_DATA=false` contra el backend local y PostgreSQL. |
| `RUNTIME-MOCK` | GET seguro ejecutado contra la instancia local que ya tenía `USE_MOCK_DATA=true`; valida routing/forma, no persistencia. |
| `ESTÁTICO-FE` | Inspección del consumidor, payload, adapter, estado React y manejo visual. |
| `ESTÁTICO-BE` | Inspección de routers, dependencias, schemas, modelos, servicios y OpenAPI sin editar. |
| `CONTRATO` | Método, URL, auth, payload y respuesta contrastados entre frontend y backend. |
| `NO EJECUTADO` | Requiere una mutación, un navegador o infraestructura de test que no se ejecutó en esta auditoría. |

`CORREGIDO` significa que la corrección está implementada en frontend; no equivale a `VALIDADO` en runtime. Cuando falta esa prueba, se indica expresamente en Evidencia.

## Resumen ejecutivo

La integración principal existe: auth, catálogos, creación de posts/actividades y mutadores sociales tienen servicio frontend y endpoint backend compatibles. Los GET reales confirmaron conectividad con PostgreSQL, pero la validación funcional completa queda abierta porque no se ejecutaron mutaciones.

Las correcciones frontend más relevantes endurecen la sesión, validan contratos de formularios, reconcilian las respuestas sociales, evitan que un fallo auxiliar derribe pantallas completas, centralizan errores de API y dejan estados controlados para funciones sin backend. Persisten riesgos importantes que **no se pueden resolver desde frontend**: configuración local híbrida mock/DB, secreto JWT por defecto, seeds previsibles, OpenAPI sin esquema Bearer, falta de colecciones personales/paginación, inconsistencias de integridad y un contrato de pueblo favorito que acepta pero descarta el valor.

## Levantamiento de observaciones

| ID | Severidad | Capa | Ruta/archivo | Observación | Evidencia | Impacto | Corrección frontend | Estado |
|---|---|---|---|---|---|---|---|---|
| AUD-001 | P0 | Backend / seguridad | Configuración y seeds | El repositorio backend conserva configuración sensible versionada, permite un secreto JWT fallback y contiene seeds con credenciales previsibles sin guard de entorno suficiente. | `ESTÁTICO-BE`; no se imprimieron valores. | Riesgo de compromiso de cuentas/tokens y ejecución accidental de datos de prueba fuera de QA. | Ninguna corrección frontend puede rotar secretos ni proteger seeds. | PENDIENTE BACKEND |
| AUD-002 | P1 | Backend / datos | Configuración `USE_MOCK_DATA` | La instancia local existente tenía mocks activos: los GET pueden devolver IDs mock mientras follow/join/save/like escriben en PostgreSQL. | `RUNTIME-MOCK` + `ESTÁTICO-BE`; el valor preexistente no se modificó. | Integración híbrida incoherente, 404/relaciones inválidas y falsas conclusiones de persistencia. | Los estados visuales fallan de forma controlada; QA debe usar un entorno real homogéneo. | PENDIENTE BACKEND |
| AUD-003 | P1 | Backend / contrato | `/openapi.json`, dependencias auth | OpenAPI no declara `securitySchemes`; Authorization aparece opcional incluso en operaciones protegidas y las interacciones carecen de response models. | `RUNTIME-REAL` OpenAPI + `ESTÁTICO-BE`. | SDKs, QA y consumidores no pueden distinguir correctamente auth ni respuestas. | Adapters toleran las claves reales `followed`, `joined`, `saved`, `liked` y aliases durante transición. | PENDIENTE BACKEND |
| AUD-004 | P1 | Backend / auth | Listados con bearer opcional | Un bearer inválido en endpoints públicos puede degradarse a respuesta anónima en vez de 401. | `RUNTIME-REAL` GET con token inválido + `ESTÁTICO-BE`. | La UI podría interpretar flags personalizados falsos como estado real. | Las rutas privadas validan con `/users/me`; catálogos cliente rehidratan con sesión válida. La corrección raíz sigue siendo backend. | PENDIENTE BACKEND |
| AUD-005 | P0 | Frontend / auth | `features/auth/auth-gate.tsx`, rutas privadas | Antes bastaba la presencia de un token local para abrir una ruta protegida. | `ESTÁTICO-FE`; prueba E2E no ejecutada. | Token caducado/inválido podía mostrar contenido privado o producir bucles confusos. | `AuthGate` verifica `/users/me`, bloquea mientras valida, limpia sesión en 401 y separa error recuperable de acceso denegado. | CORREGIDO |
| AUD-006 | P1 | Frontend / auth | `features/auth/auth-landing.tsx` | Login/register podían redirigir solo por existir un token almacenado, aunque fuese inválido. | `ESTÁTICO-FE`; prueba de token caducado no ejecutada. | Bloqueo de reautenticación y navegación circular. | La redirección exige validación de sesión y ofrece reintento/cambio de cuenta ante fallo. | CORREGIDO |
| AUD-007 | P1 | Frontend / sesión | `lib/api/session.ts` | Guardar un token nuevo sin usuario podía conservar el usuario de una sesión anterior. | `ESTÁTICO-FE`. | Identidad equivocada entre cuentas en avatar, composer o perfil. | Al guardar token sin usuario se elimina el usuario previo; `/users/me` repuebla la sesión. | CORREGIDO |
| AUD-008 | P1 | Frontend / registro | `/register`, `features/auth/register-form.tsx` | El username se generaba de forma opaca y no había confirmación de contraseña completa. | `ESTÁTICO-FE`; POST no ejecutado. | Colisiones, cuenta creada con identidad inesperada y errores evitables. | Campo username visible, confirmación, errores asociados y límites name 2–120, username 3–80 y password 8–128. | CORREGIDO |
| AUD-009 | P2 | Frontend / login | `/login`, `features/auth/login-form.tsx` | Un 401 de credenciales podía comunicarse como sesión caducada. | `CONTRATO` + `ESTÁTICO-FE`; credenciales no ejecutadas. | Mensaje incorrecto y mala recuperación del usuario. | El login trata 401 como “email o contraseña no correctos”; el adapter reserva sesión caducada para peticiones autenticadas. | CORREGIDO |
| AUD-010 | P1 | Backend / auth | Auth global | Solo hay access JWT; logout es local y no existe refresh/revocación. El token se almacena en `localStorage`. | `ESTÁTICO-BE` + `ESTÁTICO-FE`. | Un token robado o ya emitido sigue válido hasta expirar; XSS amplía el riesgo. | Limpieza local ante logout/401 y no afirmar revocación remota. La solución robusta requiere backend/cookie HttpOnly. | PENDIENTE BACKEND |
| AUD-011 | P1 | Backend / auth | `/auth/password-reset/*`, OAuth | No existen recuperación de contraseña ni proveedores Google/Apple pese a affordances de producto. | `ESTÁTICO-BE` + OpenAPI. | Recuperación de cuenta y login social no funcionales. | Acciones deben permanecer deshabilitadas/interceptadas con aviso, sin simular correo u OAuth. | PENDIENTE BACKEND |
| AUD-012 | P1 | Frontend / API | `lib/api/client.ts` | El cliente no diferenciaba timeout, respuesta 204/vacía ni configuración API vacía con suficiente robustez. | `ESTÁTICO-FE`; escenarios aislados ejecutados sin backend. | Parseos fallidos tras DELETE, esperas indefinidas y errores técnicos. | Única base `NEXT_PUBLIC_API_BASE_URL`, timeout de 15 s, `isTimeout`, abort signal, `ApiTimeoutError` y soporte 204/body vacío. | CORREGIDO |
| AUD-013 | P2 | Frontend / errores | `lib/api/error-message.ts`, formularios y acciones | Los fallos se resolvían con mensajes genéricos o solo consola. | `ESTÁTICO-FE`. | Usuario sin causa ni siguiente paso ante 400/401/403/404/409/422/429/500/red/timeout. | Adapter central de mensajes seguros y estados inline/sección/pending; el usuario ya no depende de la consola. | CORREGIDO |
| AUD-014 | P1 | Comunidad | `/community`, `CommunityDataProvider` | Crear un post y hacer `router.refresh()` no actualizaba necesariamente el provider cliente ya montado. | `ESTÁTICO-FE`; POST no ejecutado. | Éxito confirmado pero publicación ausente hasta recarga manual. | Evento de invalidación vuelve a consultar posts/villages/activities; perfil escucha el mismo evento. | CORREGIDO |
| AUD-015 | P1 | Comunidad | `PostComposer` | Las restricciones de título/contenido/imagen no reproducían por completo el schema backend. | `CONTRATO` + `ESTÁTICO-FE`; POST no ejecutado. | 422 evitable, publicaciones vacías o imagen incompatible con el renderer. | Content mínimo 2; title vacío o 2–180; village e image URL opcionales; autor nunca se toma del cliente; doble envío bloqueado. | CORREGIDO |
| AUD-016 | P1 | Comunidad | `SocialPostActions`, servicios de posts | El frontend no usaba de forma canónica el contador `likes_count` devuelto por backend. | `CONTRATO` + `ESTÁTICO-FE`; like/unlike no ejecutado. | Drift visual tras concurrencia o respuesta distinta del optimismo. | Reconciliación con `liked`/alias y `likes_count`; rollback y mensaje visible si falla. | CORREGIDO |
| AUD-017 | P1 | Backend / comunidad | Comments | Existe `comments_count`, pero no hay tabla ni endpoints para listar/crear/editar/eliminar comentarios. | `ESTÁTICO-BE` + OpenAPI. | Acción social principal no puede persistirse ni inspeccionarse. | Botón interceptado, sin incrementar contador local; estado “pendiente de backend”. | PENDIENTE BACKEND |
| AUD-018 | P2 | Backend / comunidad | Shares | Existe `shares_count`, pero no hay endpoint ni semántica de idempotencia/contador. | `ESTÁTICO-BE`. | Compartir no puede registrarse de forma fiable. | No se altera el contador ni se simula persistencia; contrato propuesto en pendientes backend. | PENDIENTE BACKEND |
| AUD-019 | P1 | Backend / media | Composer, settings y actividades | Los schemas aceptan URLs, pero no existe upload seguro de imágenes/vídeo. | `ESTÁTICO-BE`. | Botones de archivo no pueden cumplir su promesa; URL arbitraria no sustituye gestión de media. | Foto/vídeo se intercepta como pendiente; las imágenes de actividad se limitan a HTTP(S) y orígenes configurados, y adapters descartan URLs incompatibles con `next/image`. | PENDIENTE BACKEND |
| AUD-020 | P2 | Comunidad / producto | `community-feed.tsx` | “Avisos” y “Actividades” se infieren por expresiones regulares sobre texto. | `ESTÁTICO-FE`. | Clasificación inexacta y no persistente. | Se evita crear entidades falsas, pero la clasificación solo puede resolverse con un tipo de post backend. | PENDIENTE BACKEND |
| AUD-021 | P2 | Backend + frontend | GET/PUT/DELETE `/posts/{id}` | GET detalle se usa para rehidratar interacciones, pero no hay deep link; edición y borrado no tienen UI efectiva. | `ESTÁTICO-BE` + búsqueda `ESTÁTICO-FE`; no ejecutados. | Deep links y gestión del contenido propio incompletos. | GET se consume solo con IDs recibidos del backend; PUT/DELETE se documentan y no se activan sin ownership, confirmación y QA. | DETECTADO |
| AUD-022 | P1 | Backend / posts | GET `/posts/{post_id}` | El backend convierte el path a UUID sin capturar formato inválido. | `ESTÁTICO-BE`; caso malformado no ejecutado. | Un enlace malformado puede terminar en 500 en vez de 422/404. | Validar UUID antes de consumir una futura ruta de detalle. La corrección raíz es backend. | PENDIENTE BACKEND |
| AUD-023 | P1 | Actividades | Adapters/cards/detalle | `spots_left` se presentaba como si fuera el aforo total. | `CONTRATO` + `ESTÁTICO-FE`. | Información de plazas incorrecta para el usuario. | `capacity` y `spotsLeft` son campos separados; UI muestra “disponibles” o “Aforo” según el dato real. | CORREGIDO |
| AUD-024 | P1 | Actividades | `/activities/create` | Validaciones de fechas, capacidad, longitudes, slug e imagen eran incompletas. | `CONTRATO` + `ESTÁTICO-FE`; creación no ejecutada. | 409/422 evitables y actividades pasadas o inválidas. | Fecha futura, entero >=1, límites backend, URL HTTP(S), slug <=160 y errores visibles. | CORREGIDO |
| AUD-025 | P1 | Frontend / resiliencia | `/community`, `/activities`, creación y detalles | `Promise.all` permitía que un fallo auxiliar derribase una entidad/pantalla válida. | `ESTÁTICO-FE`; fallo de red por sección no ejecutado. | Pérdida total de contenido por fallo parcial de pueblos/posts/activities. | `Promise.allSettled`, datos parciales, `ErrorState` de sección, retry y preservación de la entidad principal. | CORREGIDO |
| AUD-026 | P1 | Backend / actividades | POST `/activities/{id}/join` | La comprobación de aforo ocurre antes de comprobar si el usuario ya está inscrito. | `ESTÁTICO-BE`; mutación no ejecutada. | Reintentar una inscripción ya existente en actividad llena puede devolver 409. | El frontend muestra el 409 de aforo y reconcilia; idempotencia correcta requiere backend. | PENDIENTE BACKEND |
| AUD-027 | P1 | Backend / concurrencia | Join y like | Aforo y contadores de like no tienen garantías contractuales suficientes de atomicidad/consistencia. | `ESTÁTICO-BE`; carga concurrente no ejecutada. | Sobreaforo o drift de contadores bajo concurrencia. | Optimismo con rollback y uso de `likes_count`; no puede garantizar integridad DB. | PENDIENTE BACKEND |
| AUD-028 | P2 | Frontend / categorías | `activities.service.ts`, iconos | Una categoría backend desconocida se atribuía a una categoría conocida. | `ESTÁTICO-FE`. | Etiquetado semántico falso. | Fallback explícito `Otra` con icono neutro. | CORREGIDO |
| AUD-029 | P1 | Pueblos | `/villages`, `/villages/[id]` | Catálogo y detalle usan ID/slug reales; follow necesita estado personalizado tras SSR público. | `RUNTIME-REAL` lista: 200, 3 pueblos; `ESTÁTICO-FE` detalle/follow; mutación no ejecutada. | Riesgo de botón inicialmente falso para usuario autenticado. | Explorer rehidrata catálogo con bearer y FollowButton del detalle consulta el recurso autenticado. | CORREGIDO |
| AUD-030 | P1 | Backend / perfil | PUT `/users/me`, `favorite_village_id` | Schema/respuesta anuncian el campo, pero el modelo no tiene columna y el router lo descarta. | `ESTÁTICO-BE`; PUT no ejecutado. | El backend puede responder éxito sin persistir una preferencia. | Se eliminó del payload editable y se muestra aviso controlado; no se anuncia éxito ficticio. | PENDIENTE BACKEND |
| AUD-031 | P1 | Perfil | `/profile` | Las actividades inscritas y pueblos seguidos se derivan descargando hasta 100 recursos y filtrando flags. | `ESTÁTICO-FE` + `ESTÁTICO-BE`. | Colecciones y métricas incompletas al crecer los datos. | Se etiquetan datos ausentes y fallos por sección; la exactitud requiere endpoints `/users/me/*`. | PENDIENTE BACKEND |
| AUD-032 | P2 | Perfil | Cabecera y admin | Totales se derivan de arrays limitados; no existe stats real. | `ESTÁTICO-FE` + OpenAPI. | Números parciales presentables como globales. | Perfil usa valor backend si existe o derivado/`—`; admin indica “Sin endpoint” donde corresponde. | PENDIENTE BACKEND |
| AUD-033 | P1 | Backend / paginación | Listados de posts, pueblos y actividades | Respuestas son arrays sin `total`, `next` ni `has_more`; máximo 100. | `RUNTIME-REAL` + OpenAPI + `ESTÁTICO-BE`. | Omisiones silenciosas en perfil, admin, filtros y relaciones. | Frontend pide hasta 100 y no debe llamar total global a `length`; solución completa requiere envelope/colecciones backend. | PENDIENTE BACKEND |
| AUD-034 | P2 | Backend / fechas | Actividades y posts | Timestamps backend son naive, sin zona horaria. | `ESTÁTICO-BE` + contrato. | Desplazamientos de fecha/hora entre navegador, servidor y DB. | Frontend conserva la representación sin asumir UTC; definir UTC aware requiere backend/migración. | PENDIENTE BACKEND |
| AUD-035 | P2 | Frontend / perfil | `ProfileView`, acciones sociales | Cambios sociales podían quedar desincronizados entre feed y perfil. | `ESTÁTICO-FE`; mutaciones no ejecutadas. | Contadores/flags antiguos hasta recarga completa. | Evento compartido invalida CommunityDataProvider y ProfileView; overrides optimistas se atan al baseline backend. | CORREGIDO |
| AUD-036 | P1 | Backend / guardados | `/saved` | Save/unsave de posts y actividades existen, pero no hay GET de colecciones guardadas. | `ESTÁTICO-BE` + OpenAPI. | No se puede reconstruir “Guardados” tras recarga/dispositivo. | Pantalla controlada con `BackendPendingAlert`, sin localStorage como fuente canónica. | PENDIENTE BACKEND |
| AUD-037 | P2 | Backend / notificaciones | Bell y `/notifications` | No existen notificaciones, unread count ni marcar leído. | `ESTÁTICO-BE`. | Campana sin función social real. | Sin badge falso; pantalla vacía/pendiente comprensible. | PENDIENTE BACKEND |
| AUD-038 | P2 | Backend / mensajes | `/messages`, navegación desktop/móvil | La ruta e iconos existen, pero no hay conversaciones/mensajes backend. | `ESTÁTICO-BE` + `ESTÁTICO-FE`. | No puede enviarse ni persistirse chat. | Acceso coherente por navegación y vista pendiente; no hay conversaciones demo. | PENDIENTE BACKEND |
| AUD-039 | P2 | Backend / pueblos | Mapa y geolocalización | Village no contiene coordenadas y no existe endpoint espacial. | `ESTÁTICO-BE`. | Pins/mapa interactivo serían inventados. | Presentación editorial con alerta pendiente y alternativa de catálogo. | PENDIENTE BACKEND |
| AUD-040 | P2 | Backend / recomendaciones | Rails, perfil y detalles | No existe recomendación personalizada ni motivo/score. | `ESTÁTICO-BE`. | “Para ti” puede prometer personalización inexistente. | Se reutilizan catálogos reales como exploración y se identifica lo pendiente; no se simula motor. | PENDIENTE BACKEND |
| AUD-041 | P2 | Backend / admin | `/admin` | No existen users/stats/moderación admin; solo CRUD de pueblos y ownership de posts/actividades. | `ESTÁTICO-BE` + OpenAPI. | Panel no puede administrar comunidad ni mostrar métricas globales reales. | Celdas sin endpoint no inventan totales; CRUD existente queda sin activar hasta UI/QA. | PENDIENTE BACKEND |
| AUD-042 | P1 | Backend / integridad | Schemas de update | Algunos updates permiten `null` para columnas obligatorias; falta traducción consistente de `IntegrityError`. | `ESTÁTICO-BE`; mutaciones no ejecutadas. | Posibles 500, rollback incompleto o estado ambiguo. | Payloads frontend omiten campos no modificados y bloquean null conocidos. | PENDIENTE BACKEND |
| AUD-043 | P1 | Backend / calidad | `tests/test_health.py`, dependencias | El test backend está vacío y pytest no está instalado/declarado. | `ESTÁTICO-BE`; suite no ejecutable. | Regresiones de auth, permisos, integridad y contratos sin barrera automática. | Ninguna; documentar suite backend separada sin modificar este repositorio. | PENDIENTE BACKEND |
| AUD-044 | P2 | Frontend / testing | `package.json` | No existen scripts `test` ni `test:e2e`; lint/build son las únicas puertas declaradas. | `ESTÁTICO-FE`; resultados finales pendientes. | Flujos críticos dependen de QA manual y revisión estática. | Roadmap propone tests unitarios de adapters y Playwright contra QA descartable. | DETECTADO |
| AUD-045 | P2 | Frontend / a11y | Tabs, modales, navegación, formularios | Se añadieron roles, labels, `aria-live`, focus visible, controles de teclado y superficies táctiles, pero no se hizo auditoría automatizada/navegador final. | `ESTÁTICO-FE`; navegador/axe `NO EJECUTADO`. | Posibles regresiones de focus, contraste u overflow no detectadas. | Mantener las mejoras y ejecutar la matriz 375–1440 px + teclado/axe antes de release. | PENDIENTE DECISIÓN |
| AUD-046 | P2 | Frontend / responsive | Rutas principales | El layout contiene variantes desktop/móvil y navegación adaptativa, pero la matriz visual posterior a estos cambios funcionales no se reejecutó. | `NO EJECUTADO`. | Overflow o estados de error mal contenidos en un breakpoint. | Ningún rediseño adicional; validar rutas y estados en 375, 430, 768, 1024, 1280 y 1440 px. | PENDIENTE DECISIÓN |
| AUD-047 | P3 | Frontend / deuda | `components/ui/future-page.tsx` y docs históricas | Queda un componente de demostración sin consumidor y documentación de fases tempranas potencialmente obsoleta. | `ESTÁTICO-FE`; búsqueda de imports. | Ruido para mantenimiento, no afecta runtime actual. | Retirar/archivar solo tras confirmar que no se usa; actualizar docs históricas en tarea separada. | DETECTADO |
| AUD-048 | P3 | Frontend / assets | Fallbacks editoriales | Imágenes editoriales cubren recursos sin imagen real. | `ESTÁTICO-FE`. | Podrían confundirse con contenido aportado por usuario si no se etiquetan. | Fallbacks visibles se identifican como “Editorial” y no sustituyen datos funcionales. | CORREGIDO |
| AUD-049 | P2 | Frontend / observabilidad | Formularios, servicios y personalización cliente | Los logs técnicos podían ejecutarse también en producción. | `ESTÁTICO-FE`; búsqueda final de `console.error`. | Ruido y posible exposición accidental de objetos de error. | Los logs técnicos quedan condicionados a `NODE_ENV === "development"`; el mensaje visible sigue siendo la fuente de recuperación para el usuario. | CORREGIDO |
| AUD-050 | P2 | Frontend / build | `app/layout.tsx`, `package.json` | `next/font/google` hacía que el build dependiera de descargar fuentes y Turbopack intenta abrir un puerto auxiliar no permitido por este entorno. | Primer build con caché OK; repetición sin red falló al descargar fuentes; Turbopack devolvió EPERM; build final Webpack OK. | CI aislado no era reproducible aunque el código compilara con red/caché. | Se mantienen Manrope/Fraunces con stylesheet runtime y stacks fallback; `npm run build` usa el opt-out Webpack soportado por Next 16. Conviene autoalojar las fuentes en un sprint posterior. | CORREGIDO |
| AUD-051 | P0 | Frontend / regresión | `SocialPostActions`, capabilities | Un cambio local sin commit marcaba una card como `interactionUnavailable` tras cualquier 404 y sustituía intentos reales posteriores por un aviso de no persistencia. | `git log/show/blame/diff`; `HEAD cd983e0` no contiene la condición. | Un post real podía quedar bloqueado y confundirse visualmente con datos demo. | El 404 revierte e informa, pero no cambia origen/capacidad. Solo fixtures confirmados se bloquean antes de llamar a API. Informe: `REGRESION_INTERACCIONES_SOCIALES.md`. | CORREGIDO — QA MUTABLE PENDIENTE |

## Rutas frontend auditadas

| Ruta | Acceso | Integración principal | Estado a fecha de corte |
|---|---|---|---|
| `/` | Pública | Sesión opcional y navegación | Contrato revisado; sesión almacenada se valida antes de redirigir. |
| `/login` | Pública | POST `/auth/login`, GET `/users/me` al validar sesión | Conectada sin prueba de credenciales. |
| `/register` | Pública | POST `/auth/register` | Conectada sin mutación E2E. |
| `/community` | Pública con personalización autenticada | GET/POST posts; like/save; pueblos/actividades auxiliares | GET validado; mutaciones no ejecutadas. |
| `/activities` | Pública con personalización autenticada | GET activities/villages, join/save | GET validado; mutaciones no ejecutadas. |
| `/activities/[id]` | Pública | GET detalle/pueblo; join/save | Contrato revisado; detalle y mutaciones no ejecutados. |
| `/activities/create` | Privada | POST `/activities` | Protegida y validada estáticamente; POST no ejecutado. |
| `/villages` | Pública con personalización autenticada | GET villages; follow | GET validado; follow no ejecutado. |
| `/villages/[id]` | Pública | GET detalle/posts/activities; follow | Contrato revisado; mutaciones no ejecutadas. |
| `/profile` | Privada | `/users/me`, posts por author, catálogos con flags | Contrato revisado; colecciones personales limitadas por backend. |
| `/settings` | Privada | PUT `/users/me` | Contrato revisado; PUT no ejecutado; favorito deshabilitado. |
| `/saved` | Privada | Sin GET de colecciones | Estado controlado pendiente backend. |
| `/notifications` | Privada | Sin backend | Estado controlado pendiente backend. |
| `/messages` | Privada | Sin backend | Estado controlado pendiente backend; icono desktop/móvil disponible. |
| `/explore` | Pública | Catálogos existentes; sin búsqueda global | Navegación real con limitación documentada. |
| `/admin` | Privada admin | `/users/me`, catálogos | Rol verificado; métricas/usuarios admin pendientes backend. |
| `/dashboard` | Compatibilidad | Redirección/navegación existente | Revisada como ruta adicional. |

## Mocks, hardcodes y fallbacks

- No se encontró un usuario demo funcional (por ejemplo, “Ana”) usado como identidad autenticada. “Usuario” es un placeholder neutral mientras se hidrata la sesión, no una cuenta persistida.
- No se insertan posts, pueblos, actividades, mensajes ni notificaciones ficticios para cubrir una API vacía.
- Los assets `/public/images/raiz-*.webp` son recursos editoriales de presentación y los fallbacks visibles se etiquetan como tales.
- Las categorías de actividad son una taxonomía frontend; un valor desconocido se muestra como `Otra` y no como una categoría falsa.
- Los filtros Avisos/Actividades por regex siguen siendo una aproximación visual documentada; requieren tipo de post backend para ser canónicos.
- El backend local tenía sus propios mocks activos de forma preexistente. Esto es independiente de los fallbacks frontend y debe deshabilitarse en el entorno QA real.

## Validaciones y restricciones contrastadas

| Flujo | Restricción comprobada en frontend | Fuente |
|---|---|---|
| Registro | name 2–120; username 3–80; email requerido/válido; password 8–128; confirmación | Schemas backend + formulario |
| Login | email y password requeridos; password <=128; doble envío bloqueado | Schema/servicio + formulario |
| Post | content >=2; title vacío o 2–180; village UUID/null; image URL opcional de origen configurado; author derivado del JWT | Schema/router + composer |
| Actividad | slug 2–160; title 2–180; description >=10; category 2–80; capacity entero >=1; location 2–255; inicio futuro; URL HTTP(S) opcional de un origen de imágenes configurado | Schema/router + formulario |
| Perfil | name >=2; username >=3; bio <=500; email read-only; campos no editados no deben enviarse como null | Schema/router + settings |
| Acciones | token obligatorio, submitting/rollback, 401 limpia sesión, 409/422 visible | Dependencias backend + componentes |

Las validaciones frontend mejoran UX, pero el backend sigue siendo la autoridad y debe corregir integridad, enums, concurrencia y timestamps indicados en BACK-024/BACK-025.

## Pruebas y límites de la conclusión

Sí se confirmó en runtime local:

- `/health`: 200.
- `/api/v1/health`: 200.
- `/api/v1/db-check`: conexión PostgreSQL disponible.
- `/openapi.json`: 200; 20 paths y 35 operaciones de sistema/producto auditadas.
- Con `USE_MOCK_DATA=false`: 3 pueblos, 4 actividades y 3 posts; revisión Alembic `f1c3a8d9b120 (head)`.
- Con la instancia preexistente `USE_MOCK_DATA=true`: listados mock respondieron 200, únicamente como comprobación de routing.

No se ejecutó:

- registro/login/logout con credenciales QA;
- creación/edición/borrado;
- like/unlike, save/unsave, join/leave o follow/unfollow;
- verificación de persistencia tras recarga;
- pruebas de roles autor/organizador/admin;
- fallos 409/422/500 mediante mutaciones;
- suite backend (vacía/no instalada), suite frontend (no existe), Playwright, axe ni matriz de navegadores;
- smoke mutable. Debe ejecutarse solo en una DB QA descartable, nunca en producción.

Los resultados finales de instalación, lint, TypeScript y build están aprobados y consolidados en `CHECKPOINT_POST_AUDITORIA.md`. El smoke integrado, navegador, axe y las mutaciones siguen expresamente no ejecutados.

## Referencias de detalle

- Matriz acción por acción: [`MATRIZ_INTEGRACION_FULLSTACK.md`](./MATRIZ_INTEGRACION_FULLSTACK.md).
- Funciones y contratos backend propuestos: [`FUNCIONALIDADES_PENDIENTES_BACKEND.md`](./FUNCIONALIDADES_PENDIENTES_BACKEND.md).
- Endpoints existentes sin consumidor: [`ENDPOINTS_BACKEND_SIN_USO.md`](./ENDPOINTS_BACKEND_SIN_USO.md).
- Priorización: [`ROADMAP_RECOMENDADO.md`](./ROADMAP_RECOMENDADO.md).
- Trazabilidad de Me gusta y clasificación real/demo: [`REGRESION_INTERACCIONES_SOCIALES.md`](./REGRESION_INTERACCIONES_SOCIALES.md).
- Estado ejecutable de cierre: [`CHECKPOINT_POST_AUDITORIA.md`](./CHECKPOINT_POST_AUDITORIA.md).
