# Regresión de interacciones sociales

Fecha de corte: **2026-07-20**  
Alcance: frontend ConectaPueblos y contraste backend estrictamente de solo lectura.

## Resultado ejecutivo

La conexión real de Me gusta no fue eliminada por un commit. `git log`, `git show`, `git diff` y `git blame` demuestran que el commit `80b50fffda0756d7a0af6f544fc16c6bdb21e862` introdujo `POST/DELETE /api/v1/posts/{post_id}/like`, y que los commits posteriores conservaron esas llamadas.

La regresión encontrada estaba en el **working tree sin commit**, sobre `HEAD cd983e080060a6aa6eb4a1b41527902c2a5aa0ad`: después de cualquier 404, `SocialPostActions` activaba `interactionUnavailable` y los intentos posteriores dejaban de llamar al backend. Además mostraba el mismo concepto de “interacción no persistente” tanto para un fixture demo confirmado como para una publicación considerada real. Eso mezclaba origen de datos con resultado de red.

La corrección elimina ese estado derivado del 404. Solo un origen `demo` confirmado antes de la acción impide la petición. Una publicación real conserva su capacidad tras 401, 403, 404, red o timeout; el optimismo se revierte y el usuario recibe un toast seguro.

## Evidencia Git

Comandos usados, todos de solo lectura:

```text
git log --follow -- components/social/social-post-actions.tsx
git show --stat 80b50ff -- components/social/social-post-actions.tsx lib/api/community.service.ts
git show --stat e938e33 -- components/social/social-post-actions.tsx data/community.ts
git show --stat e86d9ad -- components/social/social-post-actions.tsx
git show --stat cd983e0 -- components/social/social-post-actions.tsx lib/api/community.service.ts
git blame HEAD -- components/social/social-post-actions.tsx
git diff HEAD -- components/social/social-post-actions.tsx components/social/social-post-card.tsx
```

| Revisión | Evidencia | Conclusión |
|---|---|---|
| `80b50ff` — 2026-07-01 | Añadió `likePost`/`unlikePost`, token, POST/DELETE, estado de envío y rollback. | Aquí comenzó la integración real; no es la regresión. |
| `e938e33` — 2026-07-05 | Mantuvo las llamadas reales y el rollback; eliminó `data/community.ts`. | Retiró datos funcionales mock del frontend; no desactivó Me gusta. |
| `e86d9ad` — 2026-07-05 | Añadió `useAuthGuard` y mensajes de sesión. | La autenticación siguió entregando el token a los servicios. |
| `cd983e0` — 2026-07-19, `HEAD` | Modificó el adapter del servicio; no modificó `SocialPostActions`. | No introdujo un bloqueo global de interacciones. |
| Working tree auditado | Añadía `interactionSupported`, `demo` e `interactionUnavailable`; este último se activaba ante un 404 real. | **Regresión localizada sin commit. Commit introductor: ninguno.** |

## Respuestas a las preguntas de regresión

| Pregunta | Evidencia y respuesta |
|---|---|
| ¿Cómo funcionaba antes? | Desde `80b50ff`, obtenía token e ID, aplicaba optimismo, ejecutaba POST/DELETE y revertía ante error. |
| ¿Qué archivo cambió? | En el working tree: `components/social/social-post-actions.tsx`, con propagación desde `social-post-card.tsx` y clasificación central en `lib/api/entity-capabilities.ts`. |
| ¿Qué condición nueva se añadió? | `!interactionSupported || interactionUnavailable`; `interactionUnavailable` pasaba a `true` tras cualquier 404. |
| ¿Qué commit introdujo el cambio? | **Ninguno**. No existe en `HEAD`; era una modificación local no confirmada. La base era `cd983e0`. |
| ¿Se perdió el token? | No. `getStoredToken()` seguía ejecutándose y el token seguía llegando a `likePost`/`unlikePost`. |
| ¿Cambió el ID? | No. La card conserva `post.id` como `storageKey`; el servicio lo codifica en el path. |
| ¿Cambió la fuente del feed? | No por un commit de la acción. Sí existe un riesgo backend independiente: `USE_MOCK_DATA=true` sirve fixtures en GET mientras los mutadores consultan PostgreSQL. |
| ¿Se empezó a clasificar todo como mock? | No. La compatibilidad local solo reconoce los tres UUID de fixtures documentados; cualquier otro ID queda `persistent`, salvo que el backend declare `data_source`. |
| ¿Se deshabilitaron acciones globalmente? | No. El bloqueo era por instancia de card, aunque un 404 real lo dejaba bloqueado hasta remontar el componente. |
| ¿El sistema de alertas sustituyó una acción real? | En el primer intento real se llamaba al endpoint; después del 404 el estado local sí sustituía nuevos intentos por un aviso. Esa condición fue eliminada. |

## Clasificación final

`getPostCapabilities(post)` es el único punto de decisión para publicaciones:

1. Si el backend declara `data_source: "demo" | "persistent"`, ese dato tiene prioridad.
2. Mientras el backend no lo declare, únicamente los UUID exactos publicados por `app/mock_data/posts.py` se consideran demo.
3. El resto de IDs con forma UUID canónica `8-4-4-4-12` se consideran persistentes. No se exige nibble RFC de versión/variante porque PostgreSQL contiene IDs reales `cccc…` aceptados por FastAPI/Python. Un ID sin esa forma queda como entidad persistente incompleta, no como mock.
4. Imagen ausente, avatar, autor, título, campos opcionales y errores HTTP no intervienen en la clasificación.

Fixtures confirmados y bloqueados antes de la red:

```text
77777777-7777-4777-8777-777777777777
88888888-8888-4888-8888-888888888888
99999999-9999-4999-8999-999999999999
```

Esta lista procede del backend inspeccionado en `app/mock_data/posts.py`; no son IDs inventados.

## Comportamiento final

| Caso | Petición | Estado local | Mensaje / recuperación |
|---|---|---|---|
| Post real, like | POST `/api/v1/posts/{id}/like` con Bearer | Optimismo, reconciliación con `liked`/`likes_count` | Invalida el feed para recuperar el estado autenticado. |
| Post real, unlike | DELETE al mismo endpoint con Bearer | Optimismo reversible; contador nunca negativo | Reconciliación con respuesta backend. |
| Doble clic | Solo se acepta la primera acción mientras el ref está en vuelo | Sin duplicado | Botón deshabilitado y spinner. |
| Demo confirmado | Ninguna | Corazón y contador intactos | “Esta publicación forma parte de los datos de demostración y todavía no admite interacciones persistentes.” |
| 401 real | Sí, falla | Rollback completo y sesión limpiada | “Tu sesión ha caducado. Inicia sesión nuevamente para continuar.” |
| 403 real | Sí, falla | Rollback completo | “No tienes permiso para realizar esta acción.” |
| 404 real | Sí, falla | Rollback completo; conserva origen real y capacidad futura | “No encontramos esta publicación. Actualiza el contenido e inténtalo nuevamente.” |
| Red real | Sí, no obtiene respuesta | Rollback completo | “No pudimos conectar con el servidor.” |
| Timeout | Sí, excede límite | Rollback completo | “La solicitud tardó demasiado.” |

En desarrollo, el 404 registra únicamente ID, path seguro del endpoint, status y origen calculado; nunca token, credenciales, payload sensible ni stack para el usuario.

## Archivos de la corrección focal

- `lib/api/entity-capabilities.ts`: fuente y capacidades centralizadas, prioridad para metadata futura del backend.
- `lib/api/community.service.ts`: adapta `data_source` si aparece y conserva `post.id`.
- `components/social/social-post-card.tsx`: consume capacidades centralizadas.
- `components/social/social-post-actions.tsx`: quita la reclasificación/bloqueo por 404, mantiene endpoint real, rollback y mensajes exactos.
- `components/ui/app-toast.tsx`: feedback accesible para errores de acción.
- `lib/api/client.ts`: añade `isTimeout` al error tipado.
- `lib/api/error-message.ts`: mapeo de red central a “No pudimos conectar con la API.”

La misma separación se aplicó a join/save de actividades y follow de pueblos: solo fixtures confirmados se bloquean antes de la red; un 404 real revierte, informa y no cambia el origen.

## Límites de la evidencia

No se ejecutó like/unlike contra PostgreSQL porque la tarea prohíbe modificar la base de datos. Primero, con el `USE_MOCK_DATA=true` preexistente, `GET /api/v1/posts` devolvió exactamente los fixtures `777…`, `888…` y `999…`. Tras la autorización expresa para cambiar únicamente esa bandera y reiniciar Uvicorn, el GET devolvió tres IDs persistidos `cccc…` y el catálogo de actividades pasó de 3 a 4 elementos. Por tanto:

- la ruta, método, token, ID, respuesta, optimismo, rollback e invalidación están validados por código/contrato;
- la persistencia tras recarga queda **pendiente de QA mutable en una base descartable autorizada**;
- no se presenta una prueba estática como evidencia de persistencia runtime.
