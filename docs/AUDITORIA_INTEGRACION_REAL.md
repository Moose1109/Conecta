# Auditoría de integración real

Fecha: **2026-07-20**.

## Alcance y garantías

Se revisaron el frontend Next.js 16 y, en modo lectura, OpenAPI, routers, schemas, servicios, modelos y fixtures FastAPI. No se modificó código backend, `.env`, migraciones ni base de datos. No se ejecutaron mutaciones durante esta corrección.

## Resultado ejecutivo

La integración frontend ya diferencia fallo, vacío y demo; usa una sola variable API; normaliza errores HTTP/red/timeout/validación; protege acciones optimistas; y evita que entidades mock se presenten como persistentes. El diseño, rutas y responsive existentes se conservaron.

## Cliente API

- Fuente única: `NEXT_PUBLIC_API_BASE_URL`.
- URL vacía o inválida: `ApiError` de tipo `configuration` con mensaje seguro.
- Bearer solo cuando existe token.
- `Accept` siempre y `Content-Type` JSON solo para body string.
- Timeout de 15 segundos y soporte de señal externa.
- Respuestas 204 o body vacío.
- Errores tipados: `status`, `statusText`, `detail`, `code`, `fieldErrors`, `path`, `type`, `isNetworkError`.
- Los paths de diagnóstico ocultan claves de query sensibles.
- Validaciones FastAPI se agrupan por campo.
- Ningún mensaje visible incluye stack, SQL, JSON crudo, rutas locales o nombres internos.

## Acciones sociales

| Acción | Implementación frontend | Protección |
|---|---|---|
| Like/unlike post | POST/DELETE `/posts/{id}/like` | Auth, ID real, lock síncrono, optimismo reversible, respuesta canónica, contador >= 0, 401/404 específicos. |
| Save/unsave post | POST/DELETE `/posts/{id}/save` | Auth, lock, rollback, 404 demo/persistencia. |
| Join/leave actividad | POST/DELETE `/activities/{id}/join` | Auth, lock, rollback, 409 aforo, 404 demo. |
| Save/unsave actividad | POST/DELETE `/activities/{id}/save` | Auth, lock, rollback, 404 demo. |
| Follow/unfollow pueblo | POST/DELETE `/villages/{id}/follow` | Auth, lock, rollback, 404 demo. |
| Comentar/compartir | Sin endpoint | No incrementa contadores; informa que necesita servidor. |

## Autenticación y perfil

- Registro/login bloquean doble envío y muestran errores dentro del formulario.
- Registro consume `fieldErrors` de FastAPI y asocia campos conocidos.
- Sesión almacenada se valida contra `/api/v1/users/me`; fallback `/auth/me` solo para 404/405.
- Un 401 limpia sesión; un fallo de red permite reintentar sin inventar usuario.
- Perfil filtra posts propios, actividades inscritas y pueblos seguidos por relaciones distintas.
- Recomendaciones se muestran en un rail separado.
- Una colección fallida no se convierte silenciosamente en vacío.

## Estados asíncronos

Comunidad, actividades, pueblos, perfil, administración, guardados, notificaciones y formularios cuentan con loading, vacío, error o backend pendiente según corresponda. `app/error.tsx` queda reservado a errores de render inesperados; fallos esperables de eventos se capturan localmente.

## Límites de la validación

Se comprobó contrato, cliente API aislado, TypeScript, lint y build. El smoke read-only no pudo conectar con `127.0.0.1:8000`; esto permitió confirmar el tratamiento del escenario sin API, pero no validar respuestas runtime del servidor en esta pasada. Las mutaciones autenticadas no se ejecutaron porque el encargo prohíbe modificar la base y no se identificó una DB QA descartable autorizada. Por ello no se afirma persistencia E2E de registro, creación, like, save, join o follow en esta entrega.

Consultar también `AUDITORIA_MOCK_VS_PERSISTENCIA.md`, `MATRIZ_ENDPOINTS_FRONTEND_BACKEND.md`, `FUNCIONALIDADES_PENDIENTES_BACKEND.md` y `CHECKPOINT_POST_CORRECCION.md`.
