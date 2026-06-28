# ConectaPueblos — Contrato API

## URL base

Backend local:

```txt
http://localhost:8000
```

Backend de producción:

```txt
TBD
```

Variable de entorno del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Autenticación

Los endpoints protegidos deben usar un bearer token:

```http
Authorization: Bearer <access_token>
```

Los endpoints públicos de lectura pueden estar disponibles sin autenticación, pero deberían incluir flags específicos del usuario como `is_liked`, `is_saved`, `is_following` o `is_joined` cuando haya un usuario autenticado.

## DTOs compartidos

### Respuesta de usuario

```json
{
  "id": "uuid",
  "name": "Ana Morales",
  "username": "ana.conecta",
  "email": "ana@pueblo.es",
  "avatar_url": null,
  "banner_url": "https://example.com/banner.jpg",
  "bio": "Vecina colaboradora",
  "role": "user",
  "favorite_village_id": "uuid",
  "stats": {
    "activities": 3,
    "posts": 8,
    "followed_villages": 5
  },
  "created_at": "2026-06-28T10:00:00Z",
  "updated_at": "2026-06-28T10:00:00Z"
}
```

### Respuesta de pueblo

```json
{
  "id": "uuid",
  "slug": "rupit",
  "name": "Rupit",
  "province": "Barcelona",
  "region": "Catalunya",
  "population": 270,
  "image_url": "https://example.com/rupit.jpg",
  "banner_url": "https://example.com/rupit-banner.jpg",
  "tagline": "Calles de piedra, calma y miradores sobre el Collsacabra.",
  "description": "Rupit conserva un trazado medieval...",
  "highlights": ["Puente colgante", "Salt de Sallent"],
  "stats": {
    "activities_count": 2,
    "posts_count": 3,
    "followers_count": 20
  },
  "is_following": false,
  "created_at": "2026-06-28T10:00:00Z",
  "updated_at": "2026-06-28T10:00:00Z"
}
```

### Respuesta de actividad

```json
{
  "id": "uuid",
  "slug": "ruta-salt-sallent",
  "title": "Ruta al Salt de Sallent",
  "description": "Caminata guiada entre hayedos...",
  "category": "Naturaleza",
  "village_id": "uuid",
  "village": {
    "id": "uuid",
    "slug": "rupit",
    "name": "Rupit"
  },
  "organizer_id": "uuid",
  "organizer_name": "Associació Collsacabra Viu",
  "image_url": "https://example.com/activity.jpg",
  "starts_at": "2026-07-12T09:30:00Z",
  "ends_at": null,
  "capacity": 18,
  "participants_count": 7,
  "location": "Rupit",
  "status": "published",
  "is_joined": false,
  "is_saved": false,
  "created_at": "2026-06-28T10:00:00Z",
  "updated_at": "2026-06-28T10:00:00Z"
}
```

### Respuesta de publicación comunitaria

```json
{
  "id": "uuid",
  "title": "Buscamos manos para el huerto compartido",
  "content": "Este sábado abrimos bancales nuevos...",
  "author_id": "uuid",
  "author": {
    "id": "uuid",
    "name": "Marta Soler",
    "username": "marta.rupit",
    "avatar_url": null
  },
  "village_id": "uuid",
  "village": {
    "id": "uuid",
    "slug": "rupit",
    "name": "Rupit"
  },
  "image_url": "https://example.com/post.jpg",
  "likes_count": 48,
  "comments_count": 12,
  "shares_count": 5,
  "is_liked": false,
  "is_saved": true,
  "created_at": "2026-06-20T10:00:00Z",
  "updated_at": "2026-06-20T10:00:00Z"
}
```

## Salud del servicio

### GET `/health`

Descripción: Endpoint de comprobación de salud.

Autenticación: No requerida.

Respuesta:

```json
{
  "status": "ok",
  "service": "conecta-pueblos-api"
}
```

## Auth

### POST `/api/v1/auth/register`

Descripción: Registrar un nuevo usuario.

Autenticación: No requerida.

Solicitud:

```json
{
  "name": "Ana Morales",
  "email": "ana@pueblo.es",
  "password": "secure-password",
  "favorite_village_id": "uuid"
}
```

Respuesta:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "Ana Morales",
    "username": "ana.morales",
    "email": "ana@pueblo.es",
    "role": "user"
  }
}
```

### POST `/api/v1/auth/login`

Descripción: Autenticar un usuario.

Autenticación: No requerida.

Solicitud:

```json
{
  "email": "ana@pueblo.es",
  "password": "secure-password"
}
```

Respuesta:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "Ana Morales",
    "username": "ana.morales",
    "email": "ana@pueblo.es",
    "role": "user"
  }
}
```

### GET `/api/v1/auth/me`

Descripción: Devolver el usuario autenticado.

Autenticación: Requerida.

Respuesta: `Respuesta de usuario`.

## Usuarios

### GET `/api/v1/users/me`

Descripción: Devolver el perfil del usuario actual.

Autenticación: Requerida.

Respuesta: `Respuesta de usuario`.

### PUT `/api/v1/users/me`

Descripción: Actualizar el perfil del usuario actual.

Autenticación: Requerida.

Solicitud:

```json
{
  "name": "Ana Morales",
  "username": "ana.conecta",
  "bio": "Vecina colaboradora",
  "avatar_url": "https://example.com/avatar.jpg",
  "banner_url": "https://example.com/banner.jpg",
  "favorite_village_id": "uuid"
}
```

Respuesta: `Respuesta de usuario`.

### GET `/api/v1/users/{id}`

Descripción: Devolver el perfil público de un usuario.

Autenticación: Opcional.

Respuesta: `Respuesta de usuario`.

## Pueblos

### GET `/api/v1/villages`

Descripción: Listar pueblos.

Autenticación: Opcional.

Query params:

- `search`: string.
- `province`: string.
- `region`: string.
- `limit`: number.
- `offset`: number.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "rupit",
      "name": "Rupit",
      "province": "Barcelona",
      "region": "Catalunya",
      "population": 270,
      "image_url": "https://example.com/rupit.jpg",
      "tagline": "Calles de piedra, calma y miradores sobre el Collsacabra.",
      "description": "Rupit conserva un trazado medieval...",
      "highlights": ["Puente colgante", "Salt de Sallent"],
      "is_following": false
    }
  ],
  "total": 1
}
```

### GET `/api/v1/villages/{id}`

Descripción: Obtener el detalle de un pueblo por UUID o slug.

Autenticación: Opcional.

Respuesta: `Respuesta de pueblo`.

### POST `/api/v1/villages`

Descripción: Crear un pueblo.

Autenticación: Requerida, admin.

Solicitud:

```json
{
  "name": "Rupit",
  "slug": "rupit",
  "province": "Barcelona",
  "region": "Catalunya",
  "population": 270,
  "image_url": "https://example.com/rupit.jpg",
  "banner_url": "https://example.com/rupit-banner.jpg",
  "tagline": "Calles de piedra...",
  "description": "Rupit conserva...",
  "highlights": ["Puente colgante", "Salt de Sallent"]
}
```

Respuesta: `Respuesta de pueblo`.

### PUT `/api/v1/villages/{id}`

Descripción: Actualizar un pueblo.

Autenticación: Requerida, admin.

Solicitud: Los mismos campos que en creación, todos opcionales.

Respuesta: `Respuesta de pueblo`.

### DELETE `/api/v1/villages/{id}`

Descripción: Eliminar o marcar como eliminado un pueblo.

Autenticación: Requerida, admin.

Respuesta:

```json
{
  "deleted": true
}
```

### POST `/api/v1/villages/{id}/follow`

Descripción: Seguir un pueblo.

Autenticación: Requerida.

Respuesta:

```json
{
  "village_id": "uuid",
  "is_following": true,
  "followers_count": 21
}
```

### DELETE `/api/v1/villages/{id}/follow`

Descripción: Dejar de seguir un pueblo.

Autenticación: Requerida.

Respuesta:

```json
{
  "village_id": "uuid",
  "is_following": false,
  "followers_count": 20
}
```

## Actividades

### GET `/api/v1/activities`

Descripción: Listar actividades.

Autenticación: Opcional.

Query params:

- `search`: string.
- `category`: string.
- `village_id`: UUID o slug.
- `date_from`: ISO date.
- `date_to`: ISO date.
- `limit`: number.
- `offset`: number.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "ruta-salt-sallent",
      "title": "Ruta al Salt de Sallent",
      "category": "Naturaleza",
      "village_id": "uuid",
      "village": {
        "id": "uuid",
        "slug": "rupit",
        "name": "Rupit"
      },
      "starts_at": "2026-07-12T09:30:00Z",
      "capacity": 18,
      "participants_count": 7,
      "image_url": "https://example.com/activity.jpg",
      "description": "Caminata guiada...",
      "is_joined": false,
      "is_saved": false
    }
  ],
  "total": 1
}
```

### GET `/api/v1/activities/{id}`

Descripción: Obtener el detalle de una actividad por UUID o slug.

Autenticación: Opcional.

Respuesta: `Respuesta de actividad`.

### POST `/api/v1/activities`

Descripción: Crear una actividad.

Autenticación: Requerida.

Solicitud:

```json
{
  "title": "Paseo botánico al atardecer",
  "description": "Paseo guiado por el entorno...",
  "category": "Naturaleza",
  "village_id": "uuid",
  "starts_at": "2026-07-12T09:30:00Z",
  "ends_at": null,
  "capacity": 24,
  "location": "Plaza del pueblo",
  "image_url": "https://example.com/activity.jpg"
}
```

Respuesta: `Respuesta de actividad`.

### PUT `/api/v1/activities/{id}`

Descripción: Actualizar una actividad.

Autenticación: Requerida, organizer o admin.

Solicitud: Los mismos campos que en creación, todos opcionales.

Respuesta: `Respuesta de actividad`.

### DELETE `/api/v1/activities/{id}`

Descripción: Eliminar o cancelar una actividad.

Autenticación: Requerida, organizer o admin.

Respuesta:

```json
{
  "deleted": true
}
```

### POST `/api/v1/activities/{id}/join`

Descripción: Apuntarse a una actividad.

Autenticación: Requerida.

Respuesta:

```json
{
  "activity_id": "uuid",
  "is_joined": true,
  "participants_count": 8
}
```

### DELETE `/api/v1/activities/{id}/join`

Descripción: Salir de una actividad.

Autenticación: Requerida.

Respuesta:

```json
{
  "activity_id": "uuid",
  "is_joined": false,
  "participants_count": 7
}
```

### POST `/api/v1/activities/{id}/save`

Descripción: Guardar una actividad.

Autenticación: Requerida.

Respuesta:

```json
{
  "activity_id": "uuid",
  "is_saved": true
}
```

### DELETE `/api/v1/activities/{id}/save`

Descripción: Quitar una actividad de guardados.

Autenticación: Requerida.

Respuesta:

```json
{
  "activity_id": "uuid",
  "is_saved": false
}
```

## Publicaciones comunitarias

### GET `/api/v1/posts`

Descripción: Listar publicaciones comunitarias.

Autenticación: Opcional.

Query params:

- `search`: string.
- `village_id`: UUID o slug.
- `author_id`: UUID.
- `limit`: number.
- `offset`: number.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Buscamos manos para el huerto compartido",
      "content": "Este sábado abrimos bancales nuevos...",
      "author": {
        "id": "uuid",
        "name": "Marta Soler",
        "username": "marta.rupit",
        "avatar_url": null
      },
      "village": {
        "id": "uuid",
        "slug": "rupit",
        "name": "Rupit"
      },
      "image_url": "https://example.com/post.jpg",
      "likes_count": 48,
      "comments_count": 12,
      "shares_count": 5,
      "is_liked": false,
      "is_saved": true,
      "created_at": "2026-06-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

### GET `/api/v1/posts/{id}`

Descripción: Obtener el detalle de una publicación.

Autenticación: Opcional.

Respuesta: `Respuesta de publicación comunitaria`.

### POST `/api/v1/posts`

Descripción: Crear una publicación comunitaria.

Autenticación: Requerida.

Solicitud:

```json
{
  "title": "Buscamos manos para el huerto compartido",
  "content": "Este sábado abrimos bancales nuevos...",
  "village_id": "uuid",
  "image_url": "https://example.com/post.jpg"
}
```

Respuesta: `Respuesta de publicación comunitaria`.

### PUT `/api/v1/posts/{id}`

Descripción: Actualizar una publicación comunitaria.

Autenticación: Requerida, author o admin.

Solicitud:

```json
{
  "title": "Nuevo título",
  "content": "Contenido actualizado",
  "village_id": "uuid",
  "image_url": "https://example.com/post.jpg"
}
```

Respuesta: `Respuesta de publicación comunitaria`.

### DELETE `/api/v1/posts/{id}`

Descripción: Eliminar o marcar como eliminada una publicación.

Autenticación: Requerida, author o admin.

Respuesta:

```json
{
  "deleted": true
}
```

### POST `/api/v1/posts/{id}/like`

Descripción: Dar like a una publicación.

Autenticación: Requerida.

Respuesta:

```json
{
  "post_id": "uuid",
  "is_liked": true,
  "likes_count": 49
}
```

### DELETE `/api/v1/posts/{id}/like`

Descripción: Quitar like de una publicación.

Autenticación: Requerida.

Respuesta:

```json
{
  "post_id": "uuid",
  "is_liked": false,
  "likes_count": 48
}
```

### POST `/api/v1/posts/{id}/save`

Descripción: Guardar una publicación.

Autenticación: Requerida.

Respuesta:

```json
{
  "post_id": "uuid",
  "is_saved": true
}
```

### DELETE `/api/v1/posts/{id}/save`

Descripción: Quitar una publicación de guardados.

Autenticación: Requerida.

Respuesta:

```json
{
  "post_id": "uuid",
  "is_saved": false
}
```

## Búsqueda / Explore

### GET `/api/v1/search`

Descripción: Búsqueda global en pueblos, actividades, publicaciones y usuarios.

Autenticación: Opcional.

Query params:

- `q`: string.
- `type`: opcional `all | villages | activities | posts | users`.

Respuesta:

```json
{
  "villages": [],
  "activities": [],
  "posts": [],
  "users": []
}
```

### GET `/api/v1/explore`

Descripción: Devolver contenido recomendado para la página explore.

Autenticación: Opcional.

Respuesta:

```json
{
  "featured_villages": [],
  "featured_activities": [],
  "trending_posts": []
}
```

## Notifications (futuro)

### GET `/api/v1/notifications`

Descripción: Listar notificaciones del usuario autenticado.

Autenticación: Requerida.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "type": "post_like",
      "title": "Nueva interacción",
      "body": "A alguien le gustó tu publicación",
      "read": false,
      "created_at": "2026-06-28T10:00:00Z"
    }
  ],
  "total": 1
}
```

## Messages (futuro)

### GET `/api/v1/conversations`

Descripción: Listar conversaciones del usuario autenticado.

Autenticación: Requerida.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Grupo de actividad",
      "last_message": "Nos vemos en la plaza",
      "updated_at": "2026-06-28T10:00:00Z"
    }
  ],
  "total": 1
}
```

### GET `/api/v1/conversations/{id}/messages`

Descripción: Listar mensajes de una conversación.

Autenticación: Requerida.

Respuesta:

```json
{
  "items": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "uuid",
      "content": "Nos vemos en la plaza",
      "created_at": "2026-06-28T10:00:00Z"
    }
  ],
  "total": 1
}
```

### POST `/api/v1/conversations/{id}/messages`

Descripción: Enviar un mensaje.

Autenticación: Requerida.

Solicitud:

```json
{
  "content": "Nos vemos en la plaza"
}
```

Respuesta:

```json
{
  "id": "uuid",
  "conversation_id": "uuid",
  "sender_id": "uuid",
  "content": "Nos vemos en la plaza",
  "created_at": "2026-06-28T10:00:00Z"
}
```
