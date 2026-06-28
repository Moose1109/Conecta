# Mapeo Frontend-Backend

Este documento mapea el frontend actual de ConectaPueblos con el futuro backend en FastAPI. Está basado en la implementación actual con Next.js App Router, los mocks locales en `data/`, los tipos frontend en `lib/types.ts` y los servicios mock en `lib/api/`.

Todavía no hay backend conectado. La aplicación actual es solo frontend y usa datos mock locales.

## Arquitectura frontend actual

- Framework: Next.js App Router
- Lenguaje: TypeScript
- Estilos: TailwindCSS y componentes shadcn/ui
- Iconos: lucide-react
- Fuente de datos actual: archivos mock locales en `data/`
- Capa de servicios actual: funciones mock en `lib/api/`
- URL base futura de la API: `NEXT_PUBLIC_API_URL`
- URL API por defecto actual en `lib/api/client.ts`: `http://localhost:8000`

## Fuentes de datos mock

| Archivo | Propósito | Fuente backend futura |
| --- | --- | --- |
| `data/villages.ts` | Pueblos, búsqueda de detalle y fuente de búsqueda de pueblos | Tabla `villages` |
| `data/activities.ts` | Actividades, categorías, detalle de actividad y actividades por pueblo | Tabla `activities` y enum/tabla de categorías |
| `data/community.ts` | Publicaciones del feed comunitario y publicaciones por pueblo | Tabla `community_posts` |
| `lib/api/auth.service.ts` | Usuario actual mock y respuestas de auth mock | `users`, endpoints de auth |

## Capa de servicios frontend actual

| Servicio | Comportamiento actual | Comportamiento futuro |
| --- | --- | --- |
| `lib/api/villages.service.ts` | Lee datos mock de `villages` | Obtener datos desde `/api/v1/villages` |
| `lib/api/activities.service.ts` | Lee datos mock de `activities` | Obtener datos desde `/api/v1/activities` |
| `lib/api/community.service.ts` | Lee datos mock de `communityPosts` | Obtener datos desde `/api/v1/posts` |
| `lib/api/auth.service.ts` | Devuelve `currentUserMock` | Usar `/api/v1/auth/*` y `/api/v1/users/me` |
| `lib/api/client.ts` | Cliente API genérico ya preparado | Mantenerlo y usarlo para la integración backend |

## Mapeo de rutas

| Ruta frontend | Datos actuales del frontend | Endpoints backend futuros |
| --- | --- | --- |
| `/` | Actividades y pueblos destacados desde servicios mock | `GET /api/v1/activities`, `GET /api/v1/villages` |
| `/login` | Formulario solo visual | `POST /api/v1/auth/login` |
| `/register` | Formulario visual con opciones de pueblo | `POST /api/v1/auth/register`, `GET /api/v1/villages` |
| `/dashboard` | Usuario mock actual, actividades, publicaciones y pueblos | `GET /api/v1/users/me`, `GET /api/v1/activities`, `GET /api/v1/posts`, `GET /api/v1/villages` |
| `/community` | Publicaciones, pueblos y actividades recomendadas | `GET /api/v1/posts`, `GET /api/v1/villages`, `GET /api/v1/activities` |
| `/activities` | Actividades, categorías y pueblos | `GET /api/v1/activities`, `GET /api/v1/activity-categories`, `GET /api/v1/villages` |
| `/activities/[id]` | Detalle de actividad y detalle de pueblo | `GET /api/v1/activities/{id_or_slug}`, `GET /api/v1/villages/{id_or_slug}` |
| `/activities/create` | Formulario solo visual | `POST /api/v1/activities` |
| `/villages` | Listado de pueblos | `GET /api/v1/villages` |
| `/villages/[id]` | Detalle de pueblo, actividades del pueblo y publicaciones del pueblo | `GET /api/v1/villages/{id_or_slug}`, `GET /api/v1/activities?village_id=...`, `GET /api/v1/posts?village_id=...` |
| `/profile` | Usuario mock actual, pueblo favorito, actividades/publicaciones mock | `GET /api/v1/users/me`, `GET /api/v1/users/me/activities`, `GET /api/v1/users/me/posts`, `GET /api/v1/users/me/followed-villages` |
| `/admin` | Actividades, pueblos y usuarios mock hardcodeados | `GET /api/v1/admin/metrics`, `GET /api/v1/admin/users`, `GET /api/v1/admin/villages`, `GET /api/v1/admin/activities` |
| `/explore` | Página futura estática | `GET /api/v1/explore` |
| `/notifications` | Página futura estática | `GET /api/v1/notifications` |
| `/messages` | Página futura estática | `GET /api/v1/conversations`, `GET /api/v1/conversations/{id}/messages` |
| `/settings` | Página futura estática | `GET /api/v1/users/me/settings`, `PUT /api/v1/users/me/settings` |

## Mapeo de filtros

### Actividades

Filtros actuales del frontend:

- Búsqueda de texto por título, descripción, organizador, nombre del pueblo y provincia.
- Filtro de categoría por `ActivityCategory`.

Endpoint futuro:

```http
GET /api/v1/activities?search=&category=&village_id=&province=&date_from=&date_to=&limit=&offset=
```

El backend debería soportar:

- `search` sobre título, descripción, nombre visible del organizador, nombre del pueblo y provincia.
- `category` usando los valores de categoría del frontend o slugs seguros para backend.
- Paginación.
- Orden por fecha próxima por defecto.

### Pueblos

Filtros actuales del frontend:

- Búsqueda de texto por nombre, provincia, región, descripción, tagline y highlights.

Endpoint futuro:

```http
GET /api/v1/villages?search=&province=&region=&limit=&offset=
```

El backend debería soportar:

- `search` sobre nombre, provincia, región, descripción, tagline y highlights.
- Orden por popularidad o número de actividades para recomendaciones sociales.

### Comunidad

Filtros actuales del frontend:

- Búsqueda de texto por título de publicación, contenido, autor, handle del autor, nombre del pueblo y provincia.

Endpoint futuro:

```http
GET /api/v1/posts?search=&village_id=&author_id=&limit=&offset=
```

El backend debería soportar:

- `search` sobre título, contenido, nombre visible del autor, handle y nombre del pueblo.
- Paginación.
- Orden por más reciente por defecto.

## Mapeo de interacciones

| Interacción frontend | Estado local actual | Modelo backend futuro | Endpoints futuros |
| --- | --- | --- | --- |
| Like post | `cp:post:{post.id}:liked` | `post_likes` | `POST /api/v1/posts/{id}/like`, `DELETE /api/v1/posts/{id}/like` |
| Save post | `cp:post:{post.id}:saved` | `saved_posts` | `POST /api/v1/posts/{id}/save`, `DELETE /api/v1/posts/{id}/save` |
| Join activity | `cp:activity:{activity.id}:joined` | `activity_participants` | `POST /api/v1/activities/{id}/join`, `DELETE /api/v1/activities/{id}/join` |
| Save activity | `cp:item:activity:{activity.id}:saved` | `saved_activities` | `POST /api/v1/activities/{id}/save`, `DELETE /api/v1/activities/{id}/save` |
| Follow village | `cp:village:{village.id}:following` | `village_followers` | `POST /api/v1/villages/{id}/follow`, `DELETE /api/v1/villages/{id}/follow` |

El frontend actualmente guarda estos estados solo de forma local. La integración backend debería reemplazar las lecturas de localStorage por campos de respuesta específicos del usuario autenticado, como `liked_by_me`, `saved_by_me`, `joined_by_me` y `followed_by_me`.

## Mapeo de tipos

### `Village`

Tipo frontend actual:

```ts
type Village = {
  id: string;
  name: string;
  province: string;
  region: string;
  population: number;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
};
```

DTO backend recomendado:

```ts
type VillageDto = {
  id: string;
  slug: string;
  name: string;
  province: string;
  region: string;
  population: number;
  image_url: string;
  tagline: string;
  description: string;
  highlights: string[];
  followers_count: number;
  activities_count: number;
  followed_by_me?: boolean;
};
```

### `Activity`

Tipo frontend actual:

```ts
type Activity = {
  id: string;
  title: string;
  category: ActivityCategory;
  villageId: string;
  date: string;
  time: string;
  spots: number;
  image: string;
  description: string;
  organizer: string;
};
```

DTO backend recomendado:

```ts
type ActivityDto = {
  id: string;
  slug: string;
  title: string;
  category: string;
  village_id: string;
  village_name: string;
  starts_at: string;
  ends_at?: string | null;
  capacity: number;
  participants_count: number;
  spots_left: number;
  image_url: string;
  description: string;
  organizer: {
    id: string;
    name: string;
    handle: string;
    avatar_url?: string | null;
  };
  joined_by_me?: boolean;
  saved_by_me?: boolean;
};
```

### `CommunityPost`

Tipo frontend actual:

```ts
type CommunityPost = {
  id: string;
  title: string;
  content: string;
  villageId: string;
  villageName?: string;
  author: string;
  authorHandle?: string;
  avatar?: string;
  authorAvatar?: string;
  image?: string;
  date: string;
  likes?: number;
  comments?: number;
  commentsCount?: number;
  shares?: number;
  saved?: boolean;
};
```

DTO backend recomendado:

```ts
type CommunityPostDto = {
  id: string;
  title: string;
  content: string;
  village_id: string;
  village_name: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar_url?: string | null;
  };
  image_url?: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
};
```

### `MockUser`

Tipo frontend actual:

```ts
type MockUser = {
  id: string;
  name: string;
  email: string;
  handle: string;
  role: string;
  location: string;
  avatar: string;
  banner: string;
  favoriteVillageId: string;
  interests: string[];
  stats: {
    activities: number;
    posts: number;
    followedVillages: number;
  };
};
```

DTO backend recomendado:

```ts
type UserDto = {
  id: string;
  name: string;
  email: string;
  handle: string;
  role: string;
  location?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  favorite_village_id?: string | null;
  interests: string[];
  stats: {
    activities_count: number;
    posts_count: number;
    followed_villages_count: number;
  };
};
```

## Plan de sustitución de servicios

### Fase 1: mantener estable el frontend

Mantener los nombres actuales de funciones exportadas para que las páginas no necesiten reescrituras amplias:

- `getVillages()`
- `getVillageById(id)`
- `getActivities()`
- `getActivityById(id)`
- `getActivitiesByVillageId(villageId)`
- `getActivityCategories()`
- `getCommunityPosts()`
- `getPostsByVillageId(villageId)`
- `getCurrentUserMock()`

Después, reemplazar gradualmente las implementaciones internas con `apiFetch`.

### Fase 2: introducir servicios async

Las llamadas al backend requerirán funciones async:

```ts
export async function getVillages() {
  return apiFetch<VillageDto[]>("/api/v1/villages");
}
```

Las páginas afectadas tendrán que hacer await de estas llamadas de servicio. Los server components de App Router pueden hacerlo directamente.

### Fase 3: añadir adapters frontend

Para evitar cambiar todos los componentes UI de una vez, añadir adapters:

```ts
function villageDtoToVillage(dto: VillageDto): Village {
  return {
    id: dto.slug,
    name: dto.name,
    province: dto.province,
    region: dto.region,
    population: dto.population,
    image: dto.image_url,
    tagline: dto.tagline,
    description: dto.description,
    highlights: dto.highlights,
  };
}
```

Esto permite que el backend use nombres API estables mientras el frontend existente se mantiene casi sin cambios.

## Inconsistencias importantes encontradas

1. El frontend usa IDs string tipo slug como identificadores principales. El backend debería usar UUID como claves primarias y slugs estables para rutas públicas.
2. `Activity` separa `date` y `time`, mientras que el backend debería guardar `starts_at` como datetime con timezone.
3. `Activity.spots` significa plazas disponibles en la UI, pero el backend debería distinguir `capacity`, `participants_count` y `spots_left`.
4. `Activity.organizer` es un string plano. El backend debería modelarlo como `organizer_id` vinculado a `users`.
5. `CommunityPost` duplica `comments` y `commentsCount`. El backend debería devolver un único campo: `comments_count`.
6. `CommunityPost` duplica `avatar` y `authorAvatar`. El backend debería devolver `author.avatar_url`.
7. El frontend muestra `post.title`, así que la tabla backend `community_posts` debe incluir `title`.
8. Las estadísticas de perfil son valores mock incrustados. El backend debería calcularlas o devolverlas como campos de lectura denormalizados.
9. Los usuarios de admin están hardcodeados en `app/admin/page.tsx`, no en `data/` ni en un servicio. Los datos futuros de admin deberían venir de endpoints admin.
10. Login, register, create activity y el composer UI son solo visuales. Necesitan handlers de submit cuando exista la API.

## Prioridades backend recomendadas para integración frontend

1. Implementar primero endpoints públicos de solo lectura:
   - `GET /api/v1/villages`
   - `GET /api/v1/villages/{id_or_slug}`
   - `GET /api/v1/activities`
   - `GET /api/v1/activities/{id_or_slug}`
   - `GET /api/v1/posts`

2. Añadir autenticación:
   - `POST /api/v1/auth/register`
   - `POST /api/v1/auth/login`
   - `GET /api/v1/users/me`

3. Añadir interacciones sociales autenticadas:
   - follow village
   - join activity
   - like post
   - save post/activity

4. Añadir flujos de creación:
   - create activity
   - create community post
   - update profile

5. Añadir admin y funcionalidades sociales futuras:
   - admin metrics
   - notifications
   - messages
   - settings

## Checklist de integración frontend

- Añadir tipos DTO de API o tipos generados del cliente.
- Convertir servicios en `lib/api/` desde lecturas mock a `apiFetch`.
- Decidir si los params de ruta del frontend usan UUIDs o slugs.
- Añadir estados de loading y error a páginas async cuando haga falta.
- Reemplazar el estado de interacciones en localStorage por flags específicos del usuario devueltos por backend.
- Mantener mocks locales disponibles como fallback de demo si se desea.
- Añadir estrategia de almacenamiento de auth token antes de implementar login real.
- Proteger dashboard, profile, create activity, messages, notifications, settings y admin routes cuando exista auth.
- Añadir validación de formularios antes de enviar requests de login, register, post y creación de actividad.
- Mantener CORS configurado para frontend local y URL de producción en Vercel.
