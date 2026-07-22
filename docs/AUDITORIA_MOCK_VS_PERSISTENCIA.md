# Auditoría mock vs. persistencia

Fecha de corte: **2026-07-20**. Backend inspeccionado exclusivamente en lectura.

## Causa raíz

`USE_MOCK_DATA=true` solo cambia las lecturas de catálogo y detalle. Las mutaciones continúan resolviendo la entidad en PostgreSQL. El mismo recurso visible puede, por tanto, no existir para la operación persistente. El backend no devuelve `data_source`, `is_mock` ni una lista de capacidades.

El frontend conserva el contenido demo, lo identifica mediante una compatibilidad centralizada en `lib/api/entity-capabilities.ts` y evita presentarlo como persistente. Esta detección es temporal. Un `404` de una mutación real provoca rollback y un mensaje controlado, pero **no** convierte la entidad a demo ni bloquea intentos posteriores.

## Publicaciones

| Operación | Fuente con mock activo | Consecuencia |
|---|---|---|
| `GET /api/v1/posts` | `list_mock_posts()` | Feed con IDs `777…`, `888…`, `999…`. |
| `GET /api/v1/posts/{post_id}` | `get_mock_post()` | El detalle confirma el fixture, no su existencia en DB. |
| `POST /api/v1/posts` | PostgreSQL | La creación puede devolver 201 pero no aparecer en el feed mock. |
| `PUT /api/v1/posts/{post_id}` | PostgreSQL | Un post mock devuelve 404. |
| `DELETE /api/v1/posts/{post_id}` | PostgreSQL | Un post mock devuelve 404. |
| `POST/DELETE /api/v1/posts/{post_id}/like` | PostgreSQL | Un post mock devuelve 404. |
| `POST/DELETE /api/v1/posts/{post_id}/save` | PostgreSQL | Un post mock devuelve 404. |

Impacto corregido en frontend:

- Me gusta y guardado no mutan el estado demo ni llaman a la API para fixtures conocidos.
- Un 404 inesperado revierte corazón, contador o guardado, muestra un aviso controlado y mantiene el origen persistente.
- La creación correcta informa que el feed actual es demo y que el recurso será visible cuando la API sirva datos reales.
- Los pueblos demo no pueden enviarse como `village_id` de una publicación real.

## Actividades

| Operación | Fuente con mock activo | Consecuencia |
|---|---|---|
| `GET /api/v1/activities` | `list_mock_activities()` | Agenda demo. |
| `GET /api/v1/activities/{id_or_slug}` | `get_mock_activity()` | Detalle demo. |
| `POST /api/v1/activities` | PostgreSQL | Necesita un `village_id` persistente. |
| `PUT/DELETE /api/v1/activities/{id_or_slug}` | PostgreSQL | Fixture no encontrado. |
| `POST/DELETE .../join` | PostgreSQL | Fixture no admite inscripción real. |
| `POST/DELETE .../save` | PostgreSQL | Fixture no admite guardado real. |

El frontend bloquea join/save demo, revierte 404 inesperados sin reclasificar la actividad y no altera plazas o participantes. El formulario solo permite pueblos persistentes. Si todo el catálogo de pueblos es demo, explica el bloqueo y no inventa un UUID.

## Pueblos

| Operación | Fuente con mock activo | Consecuencia |
|---|---|---|
| `GET /api/v1/villages` | `list_mock_villages()` | Catálogo demo. |
| `GET /api/v1/villages/{id_or_slug}` | `get_mock_village()` | Detalle demo. |
| `POST/PUT/DELETE /api/v1/villages*` | PostgreSQL | CRUD admin real. |
| `POST/DELETE .../follow` | PostgreSQL | Fixture no admite seguimiento real. |

El frontend conserva los pueblos demo para explorar, pero seguimiento muestra una explicación y no cambia contador ni estado. Un 404 de un pueblo no reconocido revierte la acción sin clasificarlo como demo.

## Perfil

Con mock activo, `author_id`, `is_joined` e `is_following` de los catálogos no representan relaciones del usuario autenticado. El perfil:

- vuelve a filtrar publicaciones por identidad del usuario;
- separa actividades con `is_joined=true` de recomendaciones;
- separa pueblos con `is_following=true` del catálogo recomendado;
- muestra cero, vacío o dato no disponible; no inserta fixtures como contenido personal.

## Recomendación operativa

Para validar integración y persistencia real, ejecutar la API en un entorno local/QA descartable con:

```text
USE_MOCK_DATA=false
```

Es una recomendación de configuración. Esta auditoría no editó `.env`, el backend ni PostgreSQL.

## Solución backend recomendada

Prioridad P0: evitar el split-brain. Como transición, cada respuesta debería exponer `data_source: "demo" | "persistent"` y capacidades como `can_like`, `can_save`, `can_join` y `can_follow`. La solución final preferida es que todas las operaciones de un entorno utilicen la misma fuente.
