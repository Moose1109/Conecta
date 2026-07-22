# Matriz endpoints frontend-backend

Corte: **2026-07-20**. “Existe” fue verificado en routers/OpenAPI. “Persistencia” describe el código backend con `USE_MOCK_DATA=true`.

| Módulo | Acción | Método | Endpoint | Existe | Usado por frontend | Persistencia | Observación |
|---|---|---|---|---|---|---|---|
| Sistema | Raíz | GET | `/` | Sí | No | N/A | Información API. |
| Sistema | Salud | GET | `/health` | Sí | Smoke | N/A | Público. |
| Sistema | Salud v1 | GET | `/api/v1/health` | Sí | Smoke | N/A | Público. |
| Sistema | DB check | GET | `/api/v1/db-check` | Sí | Smoke | Lectura DB | Solo diagnóstico. |
| Auth | Registro | POST | `/api/v1/auth/register` | Sí | Sí | PostgreSQL | 201; crea usuario y JWT. No probado con mutación. |
| Auth | Login | POST | `/api/v1/auth/login` | Sí | Sí | PostgreSQL lectura | 401 inline. |
| Auth | Usuario actual alternativo | GET | `/api/v1/auth/me` | Sí | Fallback | PostgreSQL | Bearer. |
| Usuarios | Usuario actual | GET | `/api/v1/users/me` | Sí | Sí | PostgreSQL | Fuente canónica de sesión. |
| Usuarios | Actualizar actual | PUT | `/api/v1/users/me` | Sí | Sí | PostgreSQL parcial | `favorite_village_id` se descarta: pendiente backend. |
| Usuarios | Perfil público | GET | `/api/v1/users/{id_or_username}` | Sí | No | PostgreSQL | Endpoint sin UI pública dedicada. |
| Posts | Listar | GET | `/api/v1/posts` | Sí | Sí | Mock o PostgreSQL | Mock ignora `author_id` y `village_id`. |
| Posts | Detalle | GET | `/api/v1/posts/{post_id}` | Sí | Sí | Mock o PostgreSQL | La rama DB espera UUID. |
| Posts | Crear | POST | `/api/v1/posts` | Sí | Sí | PostgreSQL | Feed mock puede ocultar el 201. |
| Posts | Editar | PUT | `/api/v1/posts/{post_id}` | Sí | No | PostgreSQL | Endpoint existente sin UI/servicio. Autor/admin. |
| Posts | Eliminar | DELETE | `/api/v1/posts/{post_id}` | Sí | No | PostgreSQL | Endpoint existente sin UI/servicio. 204. |
| Posts | Me gusta | POST | `/api/v1/posts/{post_id}/like` | Sí | Sí | PostgreSQL | Protegido ante post demo; no es endpoint faltante. |
| Posts | Quitar Me gusta | DELETE | `/api/v1/posts/{post_id}/like` | Sí | Sí | PostgreSQL | Rollback 401/404. |
| Posts | Guardar | POST | `/api/v1/posts/{post_id}/save` | Sí | Sí | PostgreSQL | No existe GET de colección guardada. |
| Posts | Quitar guardado | DELETE | `/api/v1/posts/{post_id}/save` | Sí | Sí | PostgreSQL | Rollback 401/404. |
| Posts | Comentarios | GET/POST/PATCH/DELETE | `/api/v1/posts/{id}/comments*` | No | Aviso UI | — | Contrato sugerido en pendientes. |
| Posts | Compartir | POST | `/api/v1/posts/{id}/shares` | No | Aviso UI | — | No se incrementa contador. |
| Actividades | Listar | GET | `/api/v1/activities` | Sí | Sí | Mock o PostgreSQL | Array máximo 100, sin total. |
| Actividades | Detalle | GET | `/api/v1/activities/{id_or_slug}` | Sí | Sí | Mock o PostgreSQL | UUID o slug. |
| Actividades | Crear | POST | `/api/v1/activities` | Sí | Sí | PostgreSQL | Requiere pueblo persistente. |
| Actividades | Editar | PUT | `/api/v1/activities/{id_or_slug}` | Sí | No | PostgreSQL | Endpoint sin UI/servicio. Organizador/admin. |
| Actividades | Eliminar | DELETE | `/api/v1/activities/{id_or_slug}` | Sí | No | PostgreSQL | Endpoint sin UI/servicio. 204. |
| Actividades | Apuntarse | POST | `/api/v1/activities/{id_or_slug}/join` | Sí | Sí | PostgreSQL | Demo bloqueado; 409 si llena. |
| Actividades | Abandonar | DELETE | `/api/v1/activities/{id_or_slug}/join` | Sí | Sí | PostgreSQL | Optimismo reversible. |
| Actividades | Guardar | POST | `/api/v1/activities/{id_or_slug}/save` | Sí | Sí | PostgreSQL | Demo bloqueado. |
| Actividades | Quitar guardado | DELETE | `/api/v1/activities/{id_or_slug}/save` | Sí | Sí | PostgreSQL | No GET de guardadas. |
| Pueblos | Listar | GET | `/api/v1/villages` | Sí | Sí | Mock o PostgreSQL | Array máximo 100, sin total. |
| Pueblos | Detalle | GET | `/api/v1/villages/{id_or_slug}` | Sí | Sí | Mock o PostgreSQL | UUID o slug. |
| Pueblos | Crear | POST | `/api/v1/villages` | Sí | Servicio sin UI | PostgreSQL | Admin. |
| Pueblos | Editar | PUT | `/api/v1/villages/{id_or_slug}` | Sí | No | PostgreSQL | Admin. |
| Pueblos | Eliminar | DELETE | `/api/v1/villages/{id_or_slug}` | Sí | No | PostgreSQL | Admin, 204. |
| Pueblos | Seguir | POST | `/api/v1/villages/{id_or_slug}/follow` | Sí | Sí | PostgreSQL | Demo bloqueado. |
| Pueblos | Dejar de seguir | DELETE | `/api/v1/villages/{id_or_slug}/follow` | Sí | Sí | PostgreSQL | Optimismo reversible. |
| Guardados | Colecciones | GET | `/api/v1/users/me/saved-*` | No | Estado pendiente | — | Mutadores sí existen. |
| Perfil | Actividades inscritas | GET | `/api/v1/users/me/activities` | No | Filtro temporal | — | Filtra primera página del catálogo. |
| Perfil | Pueblos seguidos | GET | `/api/v1/users/me/followed-villages` | No | Filtro temporal | — | Filtra primera página del catálogo. |
| Plataforma | Notificaciones | Varios | `/api/v1/notifications*` | No | Estado pendiente | — | Función futura. |
| Plataforma | Mensajes | Varios | `/api/v1/conversations*` | No | Estado pendiente | — | Función futura. |
| Plataforma | Upload | POST/DELETE | `/api/v1/uploads*` | No | Estado pendiente | — | Ahora solo URL de imagen. |

## Clasificación

- **Endpoint inexistente:** comentarios, compartir, colecciones personales, mensajería, notificaciones y uploads.
- **Endpoint existente no conectado:** edición/eliminación de posts y actividades; parte del CRUD admin de pueblos; perfil público.
- **Endpoint conectado contra entidad mock:** mutaciones sociales, protegidas mediante capacidades y rollback.
- **Bloqueado por autenticación:** mutaciones y `/users/me`.
- **Problema de configuración:** `USE_MOCK_DATA=true` en una prueba de persistencia.
