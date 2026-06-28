# ConectaPueblos — Propuesta de esquema de base de datos

## Recomendaciones generales

- Usar PostgreSQL.
- Usar UUID como clave primaria en todas las tablas.
- Usar slugs para URLs públicas cuando sea relevante.
- Usar campos de auditoría `created_at` y `updated_at` en las tablas principales.
- Preferir soft delete para contenido generado por usuarios y contenido gestionado por administración.
- Añadir constraints únicas en tablas de interacción para evitar duplicados.
- Guardar imágenes como URLs en Fase 2; la subida y almacenamiento de archivos puede añadirse más adelante.
- Usar tablas relacionales normalizadas para interacciones sociales en vez de blobs JSON.

## Recomendaciones de enums

### Rol de usuario

- `user`
- `organizer`
- `moderator`
- `admin`

### Estado de actividad

- `draft`
- `published`
- `cancelled`
- `completed`

### Categoría de actividad

Categorías actuales del frontend:

- `Naturaleza`
- `Cultura`
- `Gastronomía`
- `Deporte`
- `Música`
- `Voluntariado`
- `Mercados`
- `Fiestas locales`

Opción de implementación:

- Empezar con una columna string y validación en Pydantic.
- Migrar más adelante a una tabla dedicada `activity_categories` si se necesitan categorías editables desde admin.

## Tablas

## users

Almacena usuarios registrados.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `name` | VARCHAR(160) | Requerido |
| `username` | VARCHAR(80) | Único, indexado |
| `email` | VARCHAR(255) | Único, indexado |
| `password_hash` | TEXT | Requerido |
| `avatar_url` | TEXT | Permite null |
| `banner_url` | TEXT | Permite null |
| `bio` | TEXT | Permite null |
| `role` | VARCHAR(40) | Valor por defecto `user` |
| `favorite_village_id` | UUID | Permite null, FK a `villages.id` |
| `created_at` | TIMESTAMPTZ | Requerido |
| `updated_at` | TIMESTAMPTZ | Requerido |
| `deleted_at` | TIMESTAMPTZ | Permite null, soft delete opcional |

Índices recomendados:

- Índice único en `email`.
- Índice único en `username`.
- Índice en `favorite_village_id`.
- Índice en `role`.

## villages

Almacena perfiles de pueblos.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `name` | VARCHAR(160) | Requerido |
| `slug` | VARCHAR(180) | Único, indexado |
| `province` | VARCHAR(120) | Requerido |
| `region` | VARCHAR(120) | Requerido |
| `description` | TEXT | Requerido |
| `tagline` | TEXT | Permite null, mapea el `tagline` actual del frontend |
| `image_url` | TEXT | Permite null |
| `banner_url` | TEXT | Permite null |
| `population` | INTEGER | Permite null |
| `highlights` | JSONB | Array de strings |
| `created_at` | TIMESTAMPTZ | Requerido |
| `updated_at` | TIMESTAMPTZ | Requerido |
| `deleted_at` | TIMESTAMPTZ | Permite null, soft delete opcional |

Índices recomendados:

- Índice único en `slug`.
- Índice en `province`.
- Índice en `region`.
- Índice GIN en `highlights` si se buscan destacados.
- Índice de búsqueda full-text en `name`, `province`, `region`, `description`, `tagline`.

## activities

Almacena actividades y eventos locales.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `title` | VARCHAR(220) | Requerido |
| `slug` | VARCHAR(240) | Único, indexado |
| `description` | TEXT | Requerido |
| `village_id` | UUID | FK a `villages.id` |
| `organizer_id` | UUID | FK a `users.id` |
| `category` | VARCHAR(80) | Requerido |
| `image_url` | TEXT | Permite null |
| `starts_at` | TIMESTAMPTZ | Requerido |
| `ends_at` | TIMESTAMPTZ | Permite null |
| `capacity` | INTEGER | Requerido |
| `location` | VARCHAR(255) | Permite null |
| `status` | VARCHAR(40) | Valor por defecto `published` |
| `created_at` | TIMESTAMPTZ | Requerido |
| `updated_at` | TIMESTAMPTZ | Requerido |
| `deleted_at` | TIMESTAMPTZ | Permite null, soft delete opcional |

Índices recomendados:

- Índice único en `slug`.
- Índice en `village_id`.
- Índice en `organizer_id`.
- Índice en `category`.
- Índice en `starts_at`.
- Índice compuesto en `(village_id, starts_at)`.
- Índice de búsqueda full-text en `title`, `description`, `category`, `location`.

## activity_participants

Almacena usuarios apuntados a actividades.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `activity_id` | UUID | FK a `activities.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(activity_id, user_id)`

Índices recomendados:

- Índice en `activity_id`.
- Índice en `user_id`.

## community_posts

Almacena publicaciones del feed comunitario.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `author_id` | UUID | FK a `users.id` |
| `village_id` | UUID | Permite null, FK a `villages.id` |
| `title` | VARCHAR(220) | Recomendado porque el frontend muestra títulos de publicaciones |
| `content` | TEXT | Requerido |
| `image_url` | TEXT | Permite null |
| `created_at` | TIMESTAMPTZ | Requerido |
| `updated_at` | TIMESTAMPTZ | Requerido |
| `deleted_at` | TIMESTAMPTZ | Permite null, soft delete opcional |

Índices recomendados:

- Índice en `author_id`.
- Índice en `village_id`.
- Índice en `created_at`.
- Índice compuesto en `(village_id, created_at)`.
- Índice de búsqueda full-text en `title`, `content`.

## post_likes

Almacena likes de publicaciones.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `post_id` | UUID | FK a `community_posts.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(post_id, user_id)`

Índices recomendados:

- Índice en `post_id`.
- Índice en `user_id`.

## saved_posts

Almacena publicaciones guardadas.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `post_id` | UUID | FK a `community_posts.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(post_id, user_id)`

Índices recomendados:

- Índice en `post_id`.
- Índice en `user_id`.

## saved_activities

Almacena actividades guardadas.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `activity_id` | UUID | FK a `activities.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(activity_id, user_id)`

Índices recomendados:

- Índice en `activity_id`.
- Índice en `user_id`.

## village_followers

Almacena seguimiento de pueblos.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `village_id` | UUID | FK a `villages.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(village_id, user_id)`

Índices recomendados:

- Índice en `village_id`.
- Índice en `user_id`.

## notifications (futuro)

Almacena notificaciones de usuario.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `user_id` | UUID | FK a `users.id` |
| `type` | VARCHAR(80) | Ejemplo: `post_like`, `activity_join` |
| `title` | VARCHAR(220) | Requerido |
| `body` | TEXT | Permite null |
| `read` | BOOLEAN | Valor por defecto `false` |
| `metadata` | JSONB | Permite null |
| `created_at` | TIMESTAMPTZ | Requerido |

Índices recomendados:

- Índice en `user_id`.
- Índice compuesto en `(user_id, read, created_at)`.

## conversations (futuro)

Almacena conversaciones.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `title` | VARCHAR(220) | Permite null |
| `type` | VARCHAR(40) | Ejemplo: `direct`, `group`, `activity` |
| `created_at` | TIMESTAMPTZ | Requerido |
| `updated_at` | TIMESTAMPTZ | Requerido |

Tabla adicional recomendada:

### conversation_participants

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `conversation_id` | UUID | FK a `conversations.id` |
| `user_id` | UUID | FK a `users.id` |
| `created_at` | TIMESTAMPTZ | Requerido |

Restricciones:

- `unique(conversation_id, user_id)`

## messages (futuro)

Almacena mensajes dentro de conversaciones.

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | Clave primaria |
| `conversation_id` | UUID | FK a `conversations.id` |
| `sender_id` | UUID | FK a `users.id` |
| `content` | TEXT | Requerido |
| `created_at` | TIMESTAMPTZ | Requerido |
| `deleted_at` | TIMESTAMPTZ | Permite null |

Índices recomendados:

- Índice en `conversation_id`.
- Índice en `sender_id`.
- Índice compuesto en `(conversation_id, created_at)`.

## Relaciones

- `users.favorite_village_id` → `villages.id`
- `activities.village_id` → `villages.id`
- `activities.organizer_id` → `users.id`
- `activity_participants.activity_id` → `activities.id`
- `activity_participants.user_id` → `users.id`
- `community_posts.author_id` → `users.id`
- `community_posts.village_id` → `villages.id`
- `post_likes.post_id` → `community_posts.id`
- `post_likes.user_id` → `users.id`
- `saved_posts.post_id` → `community_posts.id`
- `saved_posts.user_id` → `users.id`
- `saved_activities.activity_id` → `activities.id`
- `saved_activities.user_id` → `users.id`
- `village_followers.village_id` → `villages.id`
- `village_followers.user_id` → `users.id`

## Notas sobre soft delete

Recomendado:

- Usar `deleted_at` en `users`, `villages`, `activities`, `community_posts` y `messages`.
- Hacer hard deletes en filas de interacción como likes, guardados, seguimientos y participantes, salvo que se requiera retención por auditoría.
- Filtrar por defecto las filas marcadas como eliminadas en endpoints públicos.

## Notas sobre slugs

El frontend actual usa IDs de string que ya son similares a slugs:

- Ejemplos de pueblos: `rupit`, `besalu`, `siurana`
- Ejemplos de actividades: `ruta-salt-sallent`, `mercado-medieval-besalu`

Enfoque backend recomendado:

- Usar UUID como clave primaria.
- Añadir `slug` único a pueblos y actividades.
- Permitir que los endpoints de detalle resuelvan tanto UUID como slug.
- Mantener slugs estables para SEO y URLs del frontend.

## Campos de auditoría

Las tablas principales deberían incluir:

- `created_at`
- `updated_at`
- `deleted_at` cuando aplique soft delete

Opcional más adelante:

- `created_by`
- `updated_by`
- `deleted_by`
